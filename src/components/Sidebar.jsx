import AuthForm from "./AuthForm.jsx";

function Sidebar({
  session,
  logout,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  handleAuth,
  loading,
}) {
  return (
    <section className="sidebar">
      <div>
        <p className="eyebrow">Restaurant Reservations</p>
        <h1>Table booking workspace</h1>
        <p className="lede">
          Customers book available slots. Admins manage capacity and bookings.
        </p>
      </div>

      {session ? (
        <div className="account-panel">
          <span>{session.user.name}</span>
          <strong>{session.user.role}</strong>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <AuthForm
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          setAuthForm={setAuthForm}
          onSubmit={handleAuth}
          loading={loading}
        />
      )}
    </section>
  );
}

export default Sidebar;
