import { FormEvent, ReactNode } from 'react';
interface AuthFormProps {
    children: ReactNode;
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    error?: string;
    loading?: boolean;
}
export declare function AuthForm({ children, onSubmit, error, loading }: AuthFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AuthForm.d.ts.map