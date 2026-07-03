function AuthForm({
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  onSubmit,
  loading,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="mode-switch">
        <button
          type="button"
          className={authMode === "login" ? "active" : ""}
          onClick={() => setAuthMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={authMode === "register" ? "active" : ""}
          onClick={() => setAuthMode("register")}
        >
          Register
        </button>
      </div>

      {authMode === "register" && (
        <label>
          Name
          <input
            value={authForm.name}
            onChange={(event) =>
              setAuthForm({ ...authForm, name: event.target.value })
            }
            required
          />
        </label>
      )}

      <label>
        Email
        <input
          type="email"
          value={authForm.email}
          onChange={(event) =>
            setAuthForm({ ...authForm, email: event.target.value })
          }
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={authForm.password}
          onChange={(event) =>
            setAuthForm({ ...authForm, password: event.target.value })
          }
          minLength="6"
          required
        />
      </label>

      <button className="primary-action" disabled={loading}>
        {loading ? "Working..." : authMode === "login" ? "Login" : "Create account"}
      </button>
    </form>
  );
}

export default AuthForm;
