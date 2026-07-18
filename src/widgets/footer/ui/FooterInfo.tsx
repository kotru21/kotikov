interface FooterInfoProps {
  title: string;
  description: string;
}

export function FooterInfo({ title, description }: FooterInfoProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <h3 className="text-text-primary dark:text-text-inverse mb-4 text-2xl font-black uppercase">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed font-medium dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}
