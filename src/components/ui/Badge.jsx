export function Badge({ children, tone = "orange" }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
