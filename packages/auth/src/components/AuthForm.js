export function AuthForm({ onSubmit, loading, error, submitted, children }) {
    return (<form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      {submitted && <div className="text-green-600">Check your email for instructions.</div>}
      {children}
    </form>);
}
//# sourceMappingURL=AuthForm.js.map