import { cn } from "../../lib/utils";
export function Card({ children, className = "" }) { return <div className={cn("card", className)}>{children}</div>; }
