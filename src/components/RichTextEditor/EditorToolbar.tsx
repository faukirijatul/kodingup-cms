import type { Editor } from '@tiptap/react';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  Link as LinkIcon,
  Code,
  Minus,
  Plus,
  List,
  ListOrdered,
  Quote,
  SquareCode,
} from 'lucide-react';
import { DataSelect, type SelectOption } from '../DataSelect';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const HEADING_OPTIONS: SelectOption[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
];

const FONT_OPTIONS: SelectOption[] = [
  { value: 'default', label: 'Arial' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

interface EditorToolbarProps {
  editor: Editor;
  selectedHeading: string;
  setSelectedHeading: (val: string) => void;
}

export function EditorToolbar({
  editor,
  selectedHeading,
  setSelectedHeading,
}: EditorToolbarProps) {
  const [fontSize, setFontSize] = useState<number>(16);
  const [inputFontSize, setInputFontSize] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>('default');

  const displayFontSize = inputFontSize ?? String(fontSize);

  const applyFontSize = useCallback(
    (size: number) => {
      if (!editor) return;
      const clampedSize = Math.max(8, Math.min(72, size));
      setFontSize(clampedSize);
      setInputFontSize(null);
      editor.chain().focus().setFontSize(String(clampedSize)).run();
    },
    [editor],
  );

  const handleDecreaseFontSize = useCallback(() => {
    applyFontSize(fontSize - 1);
  }, [applyFontSize, fontSize]);

  const handleIncreaseFontSize = useCallback(() => {
    applyFontSize(fontSize + 1);
  }, [applyFontSize, fontSize]);

  const handleFontSizeInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputFontSize(e.target.value);
    },
    [],
  );

  const commitFontSize = useCallback(() => {
    const parsed = parseInt(displayFontSize, 10);
    if (!isNaN(parsed)) {
      applyFontSize(parsed);
    } else {
      setInputFontSize(null);
    }
  }, [applyFontSize, displayFontSize]);

  const handleFontSizeInputBlurOrSubmit = useCallback(() => {
    commitFontSize();
  }, [commitFontSize]);

  const handleFontSizeInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitFontSize();
      }
    },
    [commitFontSize],
  );

  const handleUndo = useCallback(
    () => editor?.chain().focus().undo().run(),
    [editor],
  );
  const handleRedo = useCallback(
    () => editor?.chain().focus().redo().run(),
    [editor],
  );
  const handleAlignLeft = useCallback(
    () => editor?.chain().focus().setTextAlign('left').run(),
    [editor],
  );
  const handleAlignCenter = useCallback(
    () => editor?.chain().focus().setTextAlign('center').run(),
    [editor],
  );
  const handleAlignRight = useCallback(
    () => editor?.chain().focus().setTextAlign('right').run(),
    [editor],
  );
  const handleAlignJustify = useCallback(
    () => editor?.chain().focus().setTextAlign('justify').run(),
    [editor],
  );
  const handleToggleBold = useCallback(
    () => editor?.chain().focus().toggleBold().run(),
    [editor],
  );
  const handleToggleItalic = useCallback(
    () => editor?.chain().focus().toggleItalic().run(),
    [editor],
  );
  const handleToggleUnderline = useCallback(
    () => editor?.chain().focus().toggleUnderline().run(),
    [editor],
  );
  const handleToggleStrike = useCallback(
    () => editor?.chain().focus().toggleStrike().run(),
    [editor],
  );
  const handleToggleCode = useCallback(
    () => editor?.chain().focus().toggleCode().run(),
    [editor],
  );
  const handleToggleBulletList = useCallback(
    () => editor?.chain().focus().toggleBulletList().run(),
    [editor],
  );
  const handleToggleOrderedList = useCallback(
    () => editor?.chain().focus().toggleOrderedList().run(),
    [editor],
  );
  const handleToggleBlockquote = useCallback(
    () => editor?.chain().focus().toggleBlockquote().run(),
    [editor],
  );
  const handleToggleCodeBlock = useCallback(
    () => editor?.chain().focus().toggleCodeBlock().run(),
    [editor],
  );

  const handleAddImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && editor) {
            editor
              .chain()
              .focus()
              .setImage({ src: reader.result as string })
              .run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const handleToggleLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ').trim();

    if (!selectedText) return;

    const url =
      selectedText.startsWith('http://') || selectedText.startsWith('https://')
        ? selectedText
        : `https://${selectedText}`;

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleHeadingChange = useCallback(
    (val: string) => {
      if (!editor) return;
      setSelectedHeading(val);

      if (val === 'p') {
        editor.chain().focus().setParagraph().run();
      } else {
        const level = parseInt(val.replace('h', ''), 10) as
          1 | 2 | 3 | 4 | 5 | 6;
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor, setSelectedHeading],
  );

  const handleFontChange = useCallback(
    (font: string) => {
      if (!editor) return;
      setSelectedFont(font);
      if (font === 'default') editor.chain().focus().unsetFontFamily().run();
      else editor.chain().focus().setFontFamily(font).run();
    },
    [editor],
  );

  return (
    <div className="border-dark flex flex-wrap items-center gap-1 border-b p-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleUndo}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        title="Undo"
      >
        <Undo size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleRedo}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        title="Redo"
      >
        <Redo size={16} />
      </Button>

      <div className="bg-dark mx-1 h-5 w-px" />

      <DataSelect
        options={HEADING_OPTIONS}
        value={selectedHeading}
        onValueChange={handleHeadingChange}
        className="w-32"
      />
      <DataSelect
        options={FONT_OPTIONS}
        value={selectedFont}
        onValueChange={handleFontChange}
        className="w-40"
      />

      <div className="bg-dark mx-1 h-5 w-px" />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          onClick={handleDecreaseFontSize}
          className="h-8 w-8 p-0"
          title="Decrease Font Size"
        >
          <Minus size={14} />
        </Button>

        <Input
          type="text"
          value={displayFontSize}
          onChange={handleFontSizeInputChange}
          onBlur={handleFontSizeInputBlurOrSubmit}
          onKeyDown={handleFontSizeInputKeyDown}
          className="h-8 w-12 px-1 text-center text-xs"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleIncreaseFontSize}
          className="h-8 w-8 p-0"
          title="Increase Font Size"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="bg-dark mx-1 h-5 w-px" />

      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'outline'
        }
        onClick={handleAlignLeft}
        className="h-8 w-8 p-0"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'outline'
        }
        onClick={handleAlignCenter}
        className="h-8 w-8 p-0"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'outline'
        }
        onClick={handleAlignRight}
        className="h-8 w-8 p-0"
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'outline'
        }
        onClick={handleAlignJustify}
        className="h-8 w-8 p-0"
        title="Align Justify"
      >
        <AlignJustify size={16} />
      </Button>

      <div className="bg-dark mx-1 h-5 w-px" />

      <Button
        type="button"
        variant={editor.isActive('bold') ? 'secondary' : 'outline'}
        onClick={handleToggleBold}
        className="h-8 w-8 p-0"
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'secondary' : 'outline'}
        onClick={handleToggleItalic}
        className="h-8 w-8 p-0"
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'secondary' : 'outline'}
        onClick={handleToggleUnderline}
        className="h-8 w-8 p-0"
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'secondary' : 'outline'}
        onClick={handleToggleStrike}
        className="h-8 w-8 p-0"
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('code') ? 'secondary' : 'outline'}
        onClick={handleToggleCode}
        className="h-8 w-8 p-0"
        title="Inline Code"
      >
        <Code size={16} />
      </Button>

      <div className="bg-dark mx-1 h-5 w-px" />

      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'secondary' : 'outline'}
        onClick={handleToggleBulletList}
        className="h-8 w-8 p-0"
        title="Bullet List"
      >
        <List size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'secondary' : 'outline'}
        onClick={handleToggleOrderedList}
        className="h-8 w-8 p-0"
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </Button>

      <div className="bg-dark mx-1 h-5 w-px" />

      <Button
        type="button"
        variant={editor.isActive('blockquote') ? 'secondary' : 'outline'}
        onClick={handleToggleBlockquote}
        className="h-8 w-8 p-0"
        title="Blockquote"
      >
        <Quote size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('codeBlock') ? 'secondary' : 'outline'}
        onClick={handleToggleCodeBlock}
        className="h-8 w-8 p-0"
        title="Code Block"
      >
        <SquareCode size={16} />
      </Button>

      <div className="bg-dark mx-1 h-5 w-px" />

      <Button
        type="button"
        variant={editor.isActive('link') ? 'secondary' : 'outline'}
        onClick={handleToggleLink}
        className="h-8 w-8 p-0"
        title="Toggle Link"
      >
        <LinkIcon size={16} />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddImage}
        className="h-8 w-8 p-0"
        title="Insert Image"
      >
        <ImageIcon size={16} />
      </Button>
    </div>
  );
}
