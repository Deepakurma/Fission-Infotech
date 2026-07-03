import { TIME_SLOTS } from "../constants/reservations.js";

function ReservationTable({
  reservations,
  onCancel,
  canEdit,
  updateDraft,
  updateReservation,
  loading,
}) {
  if (!reservations.length) {
    return (
      <div className="empty-state">
        <h2>No reservations found</h2>
        <p>New bookings will appear here after they are created.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Date</th>
            <th>Time</th>
            <th>No of Guests</th>
            <th>Table</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation.user?.name || "You"}</td>
              <td>
                {canEdit ? (
                  <input
                    type="date"
                    defaultValue={reservation.reservationDate}
                    onChange={(event) =>
                      updateDraft(
                        reservation._id,
                        "reservationDate",
                        event.target.value,
                      )
                    }
                  />
                ) : (
                  reservation.reservationDate
                )}
              </td>
              <td>
                {canEdit ? (
                  <select
                    defaultValue={reservation.timeSlot}
                    onChange={(event) =>
                      updateDraft(reservation._id, "timeSlot", event.target.value)
                    }
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot}>{slot}</option>
                    ))}
                  </select>
                ) : (
                  reservation.timeSlot
                )}
              </td>
              <td>
                {canEdit ? (
                  <input
                    type="number"
                    min="1"
                    defaultValue={reservation.guests}
                    onChange={(event) =>
                      updateDraft(reservation._id, "guests", event.target.value)
                    }
                  />
                ) : (
                  reservation.guests
                )}
              </td>
              <td>
                T{reservation.table?.number} ({reservation.table?.capacity})
              </td>
              <td>
                <span className={`status ${reservation.status}`}>
                  {reservation.status}
                </span>
              </td>
              <td className="actions">
                {canEdit && reservation.status === "booked" && (
                  <button
                    type="button"
                    onClick={() => updateReservation(reservation)}
                    disabled={loading}
                  >
                    Update
                  </button>
                )}
                {reservation.status === "booked" && (
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onCancel(reservation._id)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationTable;
