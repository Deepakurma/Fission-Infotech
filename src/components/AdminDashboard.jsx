import ReservationTable from "./ReservationTable.jsx";

function AdminDashboard({
  reservations,
  tables,
  dateFilter,
  setDateFilter,
  updateDraft,
  updateReservation,
  cancelReservation,
  loading,
}) {
  return (
    <>
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Administrator</p>
          <h2>Reservation control</h2>
        </div>
        <label className="filter">
          Date filter
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
          />
        </label>
      </header>

      <section className="tables-section">
        <h3>Tables</h3>
        <div className="table-strip">
          {tables.map((table) => (
            <span key={table._id}>
              T{table.number}: {table.capacity} seats
            </span>
          ))}
        </div>
      </section>

      <ReservationTable
        reservations={reservations}
        onCancel={cancelReservation}
        canEdit
        updateDraft={updateDraft}
        updateReservation={updateReservation}
        loading={loading}
      />
    </>
  );
}

export default AdminDashboard;
