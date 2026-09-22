import { cn } from "../../lib/utils";
export function Button({ children, variant = "primary", className = "", ...props }) { return <button className={cn("btn", variant === "outline" ? "btn-outline" : variant === "ghost" ? "btn-ghost" : "btn-primary", className)} {...props}>{children}</button>; }
