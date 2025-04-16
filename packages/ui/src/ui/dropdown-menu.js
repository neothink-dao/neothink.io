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
export function DropdownMenu({ children }) {
    return <div className="relative inline-block">{children}</div>;
}
export function DropdownMenuTrigger(_a) {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (<button type="button" {...props}>
      {children}
    </button>);
}
export function DropdownMenuContent(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className || ''}`} {...props}>
      {children}
    </div>);
}
export function DropdownMenuItem(_a) {
    var { children, className } = _a, props = __rest(_a, ["children", "className"]);
    return (<div className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className || ''}`} {...props}>
      {children}
    </div>);
}
//# sourceMappingURL=dropdown-menu.js.map