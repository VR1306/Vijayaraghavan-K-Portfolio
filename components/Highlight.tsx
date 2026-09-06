interface HighlightProps {
  text: string;
}

/**
 * Renders a string where **segments** are wrapped in a copper-accented
 * <strong> tag. Keeps data files free of JSX while still letting real
 * metrics stand out visually.
 */
export function Highlight({ text }: HighlightProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-accent-bright">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
