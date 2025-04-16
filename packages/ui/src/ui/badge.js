var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
// Simple cn utility for className concatenation
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
export const Badge = React.forwardRef((_a, ref) => {
    var { className, variant = "default" } = _a, props = __rest(_a, ["className", "variant"]);
    return (<span ref={ref} className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variant === "default" && "bg-primary text-primary-foreground", variant === "outline" && "border border-input bg-background", variant === "secondary" && "bg-secondary text-secondary-foreground", className)} {...props}/>);
});
Badge.displayName = "Badge";
//# sourceMappingURL=badge.js.map