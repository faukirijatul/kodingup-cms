interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mt-5 mb-7.5 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl leading-5 font-medium">{title}</h1>
        {description && (
          <p className="text-muted text-sm leading-5 font-normal">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
