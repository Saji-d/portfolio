interface EyebrowProps {
  index?: string;
  children: string;
  className?: string;
}

export default function Eyebrow({ index, children, className }: EyebrowProps) {
  return (
    <p className={`eyebrow ${className ?? ""}`}>
      {index && <span className="text-text-muted">[ {index} ] · </span>}
      {children}
    </p>
  );
}
