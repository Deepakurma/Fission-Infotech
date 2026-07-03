import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard.jsx";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { today } from "./constants/reservations.js";

const API_URL = process.env.REACT_APP_API_URL || "";

function App() {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("reservationSession");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [bookingForm, setBookingForm] = useState({
    reservationDate: today,
    timeSlot: "7:00 PM",
    guests: 2,
  });
  const [adminEdit, setAdminEdit] = useState({});
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [dateFilter, setDateFilter] = useState(today);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    }),
    [session],
  );

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  const saveSession = (nextSession) => {
    setSession(nextSession);
    localStorage.setItem("reservationSession", JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    setReservations([]);
    setTables([]);
    localStorage.removeItem("reservationSession");
  };

  const loadReservations = async () => {
    if (!session) return;
    const path = isAdmin
      ? `/api/reservations${dateFilter ? `?date=${dateFilter}` : ""}`
      : "/api/reservations/mine";
    const data = await request(path);
    setReservations(data);
  };

  const loadTables = async () => {
    if (!isAdmin) return;
    const data = await request("/api/tables");
    setTables(data);
  };

  useEffect(() => {
    if (!session) return;

    loadReservations().catch((error) => setMessage(error.message));
    loadTables().catch((error) => setMessage(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, dateFilter]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload =
        authMode === "register"
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await request(`/api/auth/${authMode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      saveSession(data);
      setMessage(`Signed in as ${data.user.role}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await request("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          ...bookingForm,
          guests: Number(bookingForm.guests),
        }),
      });
      setMessage("Reservation created");
      await loadReservations();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    setLoading(true);
    setMessage("");

    try {
      await request(`/api/reservations/${id}/cancel`, { method: "PATCH" });
      setMessage("Reservation cancelled");
      await loadReservations();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (reservation) => {
    setLoading(true);
    setMessage("");

    try {
      const values = adminEdit[reservation._id] || {};
      await request(`/api/reservations/${reservation._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          reservationDate: values.reservationDate || reservation.reservationDate,
          timeSlot: values.timeSlot || reservation.timeSlot,
          guests: Number(values.guests || reservation.guests),
        }),
      });
      setMessage("Reservation updated");
      await loadReservations();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDraft = (id, key, value) => {
    setAdminEdit((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [key]: value,
      },
    }));
  };

  return (
    <main className="app-shell">
      <Sidebar
        session={session}
        logout={logout}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        loading={loading}
      />

      <section className="workspace">
        {message && <div className="notice">{message}</div>}

        {!session ? (
          <div className="empty-state">
            <h2>Sign in to continue</h2>
            <p>
              Use a customer account to reserve tables, or seed and login as
              admin to manage all reservations.
            </p>
          </div>
        ) : isAdmin ? (
          <AdminDashboard
            reservations={reservations}
            tables={tables}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            updateDraft={updateDraft}
            updateReservation={updateReservation}
            cancelReservation={cancelReservation}
            loading={loading}
          />
        ) : (
          <CustomerDashboard
            bookingForm={bookingForm}
            setBookingForm={setBookingForm}
            reservations={reservations}
            createReservation={createReservation}
            cancelReservation={cancelReservation}
            loading={loading}
          />
        )}
      </section>
    </main>
  );
}

export default App;
