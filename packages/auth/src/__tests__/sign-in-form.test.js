import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { SignInForm } from '../components/SignInForm';
import { supabase } from '../lib/supabase';
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));
describe('SignInForm', () => {
    it('renders the form correctly', () => {
        render(<SignInForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
    it('handles form submission correctly', async () => {
        const mockSignIn = vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });
        supabase.auth.signInWithPassword = mockSignIn;
        render(<SignInForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });
    it('displays error message on failed sign in', async () => {
        const mockSignIn = vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid credentials' },
        });
        supabase.auth.signInWithPassword = mockSignIn;
        render(<SignInForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=sign-in-form.test.js.map