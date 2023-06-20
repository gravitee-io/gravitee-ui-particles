/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';

import { GioAsciidoctorComponent } from './gio-asciidoctor.component';
import { GioAsciidoctorModule } from './gio-asciidoctor.module';
import { policyMockReadme } from './testing/policy-mock-readme';

export default {
  title: 'Components / Asciidoctor',
  component: GioAsciidoctorComponent,
  decorators: [
    moduleMetadata({
      imports: [GioAsciidoctorModule],
    }),
  ],
  render: ({ content, src }) => ({
    template: `<gio-asciidoctor [content]="content" [src]="src"></gio-asciidoctor>`,
    props: { content, src },
  }),
} as Meta;

export const Empty: Story = {};

export const PolicyMock: Story = {};
PolicyMock.args = {
  content: policyMockReadme,
};

export const SanitizedMaliciousDoc: Story = {};
SanitizedMaliciousDoc.args = {
  content: '```test"><img src=x onerror=alert(1)></img>',
};

export const WithPrimJsCodeHighlighter: Story = {};
WithPrimJsCodeHighlighter.args = {
  content: `
= Test PrimJs code highlighter

[source, json]
.Json
----
  {@
      "id": "{#request.paths[3]}",
      "firstname": "{#properties['firstname_' + #request.paths[3]]}",
      "lastname": "{#properties['lastname_' + #request.paths[3]]}",
      "age": {(T(java.lang.Math).random() * 60).intValue()},
      "createdAt": {(new java.util.Date()).getTime()}
  }
----

`,
};

export const LoadSrcUrl: Story = {};
LoadSrcUrl.args = {
  src: 'https://raw.githubusercontent.com/gravitee-io/gravitee-policy-message-filtering/master/README.adoc',
};
