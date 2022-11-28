// Set material classes to the Storybook body
window.document.body?.classList.add('mat-app-background');
window.document.body?.classList.add('mat-typography');

export const parameters = {
  docs: {
    inlineStories: true,
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['README', 'Theme', 'Guidelines'],
      includeName: true,
    },
  },
};
