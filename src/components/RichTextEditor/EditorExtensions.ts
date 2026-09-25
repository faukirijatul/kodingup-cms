import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace('px', ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

export const TabIndent = Extension.create({
  name: 'tabIndent',
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.can().sinkListItem('listItem')) {
          return editor.chain().focus().sinkListItem('listItem').run();
        }
        if (editor.isActive('codeBlock')) {
          return editor.chain().focus().insertContent('  ').run();
        }
        return editor.chain().focus().insertContent('\t').run();
      },
      'Shift-Tab': ({ editor }) => {
        if (editor.can().liftListItem('listItem')) {
          return editor.chain().focus().liftListItem('listItem').run();
        }
        return false;
      },
    };
  },
});
