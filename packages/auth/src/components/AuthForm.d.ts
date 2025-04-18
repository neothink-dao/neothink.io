import { FormEvent, ReactNode } from 'react';
interface AuthFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error?: string | null;
    submitted?: boolean;
    children: ReactNode;
}
export declare function AuthForm({ onSubmit, loading, error, submitted, children }: AuthFormProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AuthForm.d.ts.map