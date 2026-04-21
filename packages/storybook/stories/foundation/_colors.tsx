const TOKENS = [
  'background', 'foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'tertiary', 'tertiary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'success', 'success-foreground',
  'warning', 'warning-foreground',
  'border', 'input', 'ring',
];

export function ColorSwatches() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {TOKENS.map((name) => (
        <div key={name} className="flex flex-col gap-2">
          <div
            className="h-16 rounded-md border border-border"
            style={{ background: `var(--${name})` }}
          />
          <code className="text-xs">--{name}</code>
        </div>
      ))}
    </div>
  );
}
