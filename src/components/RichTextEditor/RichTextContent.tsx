import { cn } from '@/lib/utils';

interface RichTextContentProps {
  content?: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        'prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap text-white',
        '[&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
        '[&_a]:text-blue-400 [&_a]:underline',
        '[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold',
        '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold',
        '[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-xl [&_h3]:font-semibold',
        '[&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4]:text-lg [&_h4]:font-semibold',
        '[&_h5]:mt-2 [&_h5]:mb-1 [&_h5]:text-base [&_h5]:font-medium',
        '[&_h6]:mt-2 [&_h6]:mb-1 [&_h6]:text-sm [&_h6]:font-medium',
        '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:my-0.5',
        '[&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman]',
        '[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square]',
        '[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:pl-0',
        '[&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-center [&_li[data-type="taskItem"]]:gap-2',
        '[&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-zinc-200 [&_code]:before:content-none [&_code]:after:content-none',
        '[&_pre]:my-2 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm',
        '[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-600 [&_blockquote]:bg-zinc-900/50 [&_blockquote]:py-2 [&_blockquote]:pr-2 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-300 [&_blockquote]:italic',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
