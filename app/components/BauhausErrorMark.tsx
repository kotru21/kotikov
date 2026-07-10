interface BauhausErrorMarkProps {
  code: "404" | "error";
}

export default function BauhausErrorMark({ code }: BauhausErrorMarkProps): React.JSX.Element {
  return (
    <div
      data-testid="bauhaus-error-mark"
      className="relative mx-auto mb-8 size-28"
      aria-hidden="true"
    >
      <span className="bg-primary-500 absolute inset-0 border-2 border-black dark:border-white" />
      <span className="absolute top-4 left-4 size-20 border-2 border-black bg-white dark:border-white dark:bg-black" />
      <span className="absolute right-2 bottom-2 bg-black px-2 py-1 font-mono text-xs font-bold text-white uppercase dark:bg-white dark:text-black">
        {code}
      </span>
    </div>
  );
}
