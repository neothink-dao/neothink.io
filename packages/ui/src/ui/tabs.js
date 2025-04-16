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
export function Tabs(_a) {
    var { value, onValueChange, children, className } = _a, props = __rest(_a, ["value", "onValueChange", "children", "className"]);
    // Minimal implementation: just render children
    return (<div className={className} {...props}>
      {children}
    </div>);
}
export function TabsList(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<div className={`flex border-b ${className || ''}`} {...props}>
      {children}
    </div>);
}
export function TabsTrigger(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<button className={`px-4 py-2 text-sm font-medium focus:outline-none ${className || ''}`} {...props}>
      {children}
    </button>);
}
export function TabsContent(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<div className={className} {...props}>
      {children}
    </div>);
}
//# sourceMappingURL=tabs.js.map