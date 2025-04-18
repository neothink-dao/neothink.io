import { Platform } from '@neothink/types';
import React from 'react';
export type AuthFormProps = {
    redirectTo?: string;
    magicLink?: boolean;
    socialProviders?: ('google' | 'github' | 'twitter')[];
    onlyThirdPartyProviders?: boolean;
    appearance?: {
        theme?: 'light' | 'dark';
        accentColor?: string;
        brandColor?: string;
        borderRadius?: string;
    };
    platform?: Platform;
};
export declare const SignIn: React.FC<AuthFormProps>;
export declare const SignUp: React.FC<AuthFormProps>;
export declare const ResetPassword: React.FC<AuthFormProps>;
export declare const UpdatePassword: React.FC<AuthFormProps>;
export declare const Auth: React.FC<AuthFormProps & {
    view?: 'sign_in' | 'sign_up' | 'forgotten_password' | 'update_password';
}>;
//# sourceMappingURL=index.d.ts.map