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
import { supabase } from '@neothink/core/database/client';
export const SignIn = ({ redirectTo, magicLink = true, socialProviders = ['google', 'github'], appearance = { theme: 'dark' }, platform = 'hub', }) => {
    return supabaseClient = { supabase };
    appearance = { appearance };
    providers = { socialProviders };
    view = "sign_in";
    redirectTo = { redirectTo } || `/${platform}/dashboard`;
};
magicLink = { magicLink }
    /  >
;
;
;
export const SignUp = ({ redirectTo, magicLink = true, socialProviders = ['google', 'github'], appearance = { theme: 'dark' }, platform = 'hub', }) => {
    return supabaseClient = { supabase };
    appearance = { appearance };
    providers = { socialProviders };
    view = "sign_up";
    redirectTo = { redirectTo } || `/${platform}/dashboard`;
};
magicLink = { magicLink }
    /  >
;
;
;
export const ResetPassword = ({ redirectTo, appearance = { theme: 'dark' }, platform = 'hub', }) => {
    return supabaseClient = { supabase };
    appearance = { appearance };
    view = "forgotten_password";
    redirectTo = { redirectTo } || `/${platform}/reset-password/update`;
};
/>;
;
;
export const UpdatePassword = ({ redirectTo, appearance = { theme: 'dark' }, platform = 'hub', }) => {
    return supabaseClient = { supabase };
    appearance = { appearance };
    view = "update_password";
    redirectTo = { redirectTo } || `/${platform}/dashboard`;
};
/>;
;
;
// Export a complete Auth component that provides all auth functionality
export const Auth = (_a) => {
    var { view = 'sign_in' } = _a, props = __rest(_a, ["view"]);
    return supabaseClient = { supabase };
    appearance = { props, : .appearance || { theme: 'dark' } };
    providers = { props, : .socialProviders };
    view = { view };
    redirectTo = { props, : .redirectTo };
    magicLink = { props, : .magicLink }
        /  >
    ;
};
;
;
//# sourceMappingURL=index.js.map