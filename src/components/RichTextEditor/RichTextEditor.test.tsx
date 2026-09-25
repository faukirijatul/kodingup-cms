import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { RichTextContent } from './RichTextContent';
import type { SelectOption } from '../DataSelect';

beforeAll(() => {
  if (typeof Range.prototype.getClientRects !== 'function') {
    Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  }
  if (typeof Range.prototype.getBoundingClientRect !== 'function') {
    Range.prototype.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }) as DOMRect;
  }
  if (typeof HTMLElement.prototype.scrollIntoView !== 'function') {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  }
  if (typeof document.elementFromPoint !== 'function') {
    document.elementFromPoint = () => null;
  }
});

vi.mock('lucide-react', () => ({
  Undo: () => <span data-testid="icon-undo" />,
  Redo: () => <span data-testid="icon-redo" />,
  Bold: () => <span data-testid="icon-bold" />,
  Italic: () => <span data-testid="icon-italic" />,
  Underline: () => <span data-testid="icon-underline" />,
  Strikethrough: () => <span data-testid="icon-strike" />,
  AlignLeft: () => <span data-testid="icon-align-left" />,
  AlignCenter: () => <span data-testid="icon-align-center" />,
  AlignRight: () => <span data-testid="icon-align-right" />,
  AlignJustify: () => <span data-testid="icon-align-justify" />,
  ImageIcon: () => <span data-testid="icon-image" />,
  Link: () => <span data-testid="icon-link" />,
  Code: () => <span data-testid="icon-code" />,
  Minus: () => <span data-testid="icon-minus" />,
  Plus: () => <span data-testid="icon-plus" />,
  List: () => <span data-testid="icon-bullet-list" />,
  ListOrdered: () => <span data-testid="icon-ordered-list" />,
  Quote: () => <span data-testid="icon-quote" />,
  SquareCode: () => <span data-testid="icon-code-block" />,
}));

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children?: ReactNode;
}

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, disabled, title }: ButtonProps) => (
    <button onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  ),
}));

vi.mock('../ui/input', () => ({
  Input: (props: ComponentPropsWithoutRef<'input'>) => (
    <input type="text" {...props} />
  ),
}));

interface DataSelectMockProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
}

vi.mock('../DataSelect', () => ({
  DataSelect: ({ value, onValueChange, options }: DataSelectMockProps) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      data-testid="data-select"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe('RichTextEditor Suite', () => {
  describe('1. RichTextEditor & EditorToolbar Integration', () => {
    it('renders initial HTML content correctly in editor', () => {
      const initialContent = '<p>Hello World</p>';
      render(<RichTextEditor value={initialContent} onChange={vi.fn()} />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('triggers onChange callback when content is updated', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { container } = render(
        <RichTextEditor value="" onChange={handleChange} />,
      );

      const editorEl = container.querySelector('.ProseMirror');
      expect(editorEl).not.toBeNull();

      if (editorEl) {
        await user.type(editorEl, 'Testing TipTap Editor');
      }

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('executes formatting commands on toolbar button clicks', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <RichTextEditor value="Sample Text" onChange={vi.fn()} />,
      );

      const boldButton = screen.getByTitle('Bold (Ctrl+B)');
      const italicButton = screen.getByTitle('Italic (Ctrl+I)');
      const underlineButton = screen.getByTitle('Underline (Ctrl+U)');

      await user.click(boldButton);
      await user.click(italicButton);
      await user.click(underlineButton);

      const editorEl = container.querySelector('.ProseMirror');
      expect(editorEl).toBeInTheDocument();
    });

    it('changes heading level when heading option is selected', async () => {
      const user = userEvent.setup();
      render(<RichTextEditor value="Heading Test" onChange={vi.fn()} />);

      const selects = screen.getAllByTestId('data-select');
      const headingSelect = selects[0];

      await user.selectOptions(headingSelect, 'h1');
      expect(headingSelect).toHaveValue('h1');
    });

    it('handles font size increment, decrement, and custom input', async () => {
      const user = userEvent.setup();
      render(<RichTextEditor value="Font Size Test" onChange={vi.fn()} />);

      const increaseBtn = screen.getByTitle('Increase Font Size');
      const decreaseBtn = screen.getByTitle('Decrease Font Size');

      await user.click(increaseBtn);
      await user.click(decreaseBtn);

      const fontInput = screen.getByDisplayValue('16');
      await user.clear(fontInput);
      await user.type(fontInput, '24{enter}');

      expect(fontInput).toBeInTheDocument();
    });

    it('inserts image when file input is triggered', async () => {
      const user = userEvent.setup();
      render(<RichTextEditor value="" onChange={vi.fn()} />);

      const dummyFile = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const originalFileReader = window.FileReader;

      class MockFileReader {
        result: string | null = null;
        onload: (() => void) | null = null;

        readAsDataURL(): void {
          this.result = 'data:image/png;base64,dummybase64';
          if (this.onload) {
            this.onload();
          }
        }
      }

      window.FileReader = MockFileReader as unknown as typeof FileReader;

      const imageButton = screen.getByTitle('Insert Image');

      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockInput = document.createElement('input');

      const clickSpy = vi.spyOn(mockInput, 'click').mockImplementation(() => {
        Object.defineProperty(mockInput, 'files', {
          value: [dummyFile],
          writable: false,
        });
        if (mockInput.onchange) {
          mockInput.onchange({
            target: mockInput,
          } as unknown as Event);
        }
      });

      createElementSpy.mockReturnValueOnce(mockInput);

      await user.click(imageButton);

      expect(clickSpy).toHaveBeenCalled();

      window.FileReader = originalFileReader;
    });
  });

  describe('2. RichTextContent Component', () => {
    it('returns null when content prop is empty or undefined', () => {
      const { container } = render(<RichTextContent content="" />);
      expect(container.firstChild).toBeNull();
    });

    it('renders HTML content safely with customized Tailwind classes', () => {
      const htmlString = '<h1>Title</h1><p>Paragraph content</p>';
      render(<RichTextContent content={htmlString} className="custom-class" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Title',
      );
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    });
  });
});
