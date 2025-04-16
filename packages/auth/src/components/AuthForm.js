export function AuthForm({ children, onSubmit, error, loading }) {
    return (<form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
      {error && (<div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>)}
      <div className="space-y-4">
        {children}
      </div>
      {loading && (<div className="text-center text-gray-500">
          Processing...
        </div>)}
    </form>);
}
//# sourceMappingURL=AuthForm.js.map