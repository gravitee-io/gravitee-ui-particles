const { readCsfOrMdx, getStorySortParameter } = require('@storybook/csf-tools');

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const path = require('path');

module.exports = async function (source) {
  const ast = babelParse(source);
  const that = this;

  let componentName = undefined;

  traverse(ast, {
    ExportDefaultDeclaration: {
      enter({ node, parent }) {
        const tt = node.declaration;

        // From sf csf
        let metaNode;
        if (t.isObjectExpression(node.declaration)) {
          // export default { ... };
          metaNode = node.declaration;
        } else if (
          // export default { ... } as Meta<...>
          t.isTSAsExpression(node.declaration) &&
          t.isObjectExpression(node.declaration.expression)
        ) {
          metaNode = node.declaration.expression;
        } else if (t.isIdentifier(node.declaration) && t.isProgram(parent)) {
          const init = findVarInitialization(node.declaration.name, parent);
          if (t.isObjectExpression(init)) {
            metaNode = init;
          }
        }

        if (metaNode && t.isProgram(parent)) {
          const compo = metaNode.properties.find(n => n.key.name === 'component');
          if (compo) {
            componentName = compo.value.name;
          }
        }
      },
    },
  });

  traverse(ast, {
    ImportDeclaration: {
      enter({ node }) {
        const modulePath = node.source.value;

        const componentSpecifier = node.specifiers.find(specifier => {
          const alias = specifier.local.name;

          return alias === componentName;
        });

        if (componentSpecifier) {
          const alias = componentSpecifier.local.name;
          let name;
          switch (componentSpecifier.type) {
            case 'ImportSpecifier':
              name = componentSpecifier.imported.name;
              break;
            case 'ImportDefaultSpecifier':
              name = 'default';
              break;
            case 'ImportNamespaceSpecifier':
              name = '*';
              break;
          }
          if (name) {
            console.log('Component file name', path.resolve(that.context, modulePath + '.ts'));
          }
        }
      },
    },
  });
};

const babelParse = code =>
  parse(code, {
    sourceType: 'module',
    // FIXME: we should get this from the project config somehow?
    plugins: [
      //   'jsx',
      'typescript',
      ['decorators', { decoratorsBeforeExport: true }],
      'classProperties',
    ],
  });
