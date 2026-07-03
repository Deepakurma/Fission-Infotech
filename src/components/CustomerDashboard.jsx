import { TIME_SLOTS, today } from "../constants/reservations.js";
import ReservationTable from "./ReservationTable.jsx";

function CustomerDashboard({
  bookingForm,
  setBookingForm,
  reservations,
  createReservation,
  cancelReservation,
  loading,
}) {
  return (
    <>
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Customer</p>
          <h2>Book a table</h2>
        </div>
      </header>

      <form className="booking-row" onSubmit={createReservation}>
        <label>
          Date
          <input
            type="date"
            min={today}
            value={bookingForm.reservationDate}
            onChange={(event) =>
              setBookingForm({
                ...bookingForm,
                reservationDate: event.target.value,
              })
            }
            required
          />
        </label>
        <label>
          Time
          <select
            value={bookingForm.timeSlot}
            onChange={(event) =>
              setBookingForm({ ...bookingForm, timeSlot: event.target.value })
            }
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </label>
        <label>
          Guests
          <input
            type="number"
            min="1"
            value={bookingForm.guests}
            onChange={(event) =>
              setBookingForm({ ...bookingForm, guests: event.target.value })
            }
            required
          />
        </label>
        <button className="primary-action" disabled={loading}>
          Reserve
        </button>
      </form>

      <ReservationTable
        reservations={reservations}
        onCancel={cancelReservation}
        canEdit={false}
      />
    </>
  );
}

export default CustomerDashboard;
