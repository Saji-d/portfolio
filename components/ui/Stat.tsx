import CountUp from "@/components/ui/CountUp";

interface StatProps {
  value: string;
  label: string;
  className?: string;
}

function parseNumeric(value: string): { num: number; decimals: number } | null {
  const match = value.replace(/,/g, "").match(/^(\d+)(?:\.(\d+))?$/);
  if (!match) return null;
  const decimals = match[2]?.length ?? 0;
  return { num: parseFloat(match[1] + (match[2] ? `.${match[2]}` : "")), decimals };
}

export default function Stat({ value, label, className }: StatProps) {
  const parsed = parseNumeric(value);
  const prefix = value.startsWith("+") ? "+" : "";

  return (
    <div className={className}>
      <div className="font-display text-2xl font-medium tracking-tight text-text-primary sm:text-3xl">
        {parsed ? (
          <CountUp value={parsed.num} prefix={prefix} decimals={parsed.decimals} />
        ) : (
          <span>{value}</span>
        )}
      </div>
      <p className="mt-1 font-mono text-xs text-text-muted">{label}</p>
    </div>
  );
}
