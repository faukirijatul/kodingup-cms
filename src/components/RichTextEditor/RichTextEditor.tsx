import { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ResizeImage from 'tiptap-extension-resize-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { FontSize, TabIndent } from './EditorExtensions';
import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  value: string;
  onChange: (richText: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [selectedHeading, setSelectedHeading] = useState<string>('p');

  const updateActiveHeading = useCallback((ed: Editor) => {
    if (ed.isActive('heading', { level: 1 })) setSelectedHeading('h1');
    else if (ed.isActive('heading', { level: 2 })) setSelectedHeading('h2');
    else if (ed.isActive('heading', { level: 3 })) setSelectedHeading('h3');
    else if (ed.isActive('heading', { level: 4 })) setSelectedHeading('h4');
    else if (ed.isActive('heading', { level: 5 })) setSelectedHeading('h5');
    else if (ed.isActive('heading', { level: 6 })) setSelectedHeading('h6');
    else setSelectedHeading('p');
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      ResizeImage,
      TextStyle,
      FontSize,
      FontFamily,
      TabIndent,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class:
            'text-blue-400 underline hover:text-blue-300 transition-colors',
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] w-full rounded-b-md bg-transparent p-4 text-sm text-white focus:outline-none prose prose-invert max-w-none whitespace-pre-wrap ' +
          '[&_a]:text-blue-400 [&_a]:underline ' +
          '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-2 ' +
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2 ' +
          '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-1.5 ' +
          '[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:my-1.5 ' +
          '[&_h5]:text-base [&_h5]:font-medium [&_h5]:my-1 ' +
          '[&_h6]:text-sm [&_h6]:font-medium [&_h6]:my-1 ' +
          '[&_ul]:list-disc [&_ul]:pl-5 ' +
          '[&_ol]:list-decimal [&_ol]:pl-5 ' +
          '[&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] ' +
          '[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square] ' +
          '[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:pl-0 ' +
          '[&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-center [&_li[data-type="taskItem"]]:gap-2 ' +
          '[&_code]:rounded [&_code]:bg-dark [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-zinc-200 [&_code]:before:content-none [&_code]:after:content-none ' +
          '[&_pre]:my-3 [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:border [&_pre]:border-zinc-800 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm ' +
          '[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-600 [&_blockquote]:bg-zinc-900/50 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:pr-2 [&_blockquote]:italic [&_blockquote]:text-zinc-300',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateActiveHeading(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateActiveHeading(editor);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border-dark bg-background/50 rounded-md border">
      <EditorToolbar
        editor={editor}
        selectedHeading={selectedHeading}
        setSelectedHeading={setSelectedHeading}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
