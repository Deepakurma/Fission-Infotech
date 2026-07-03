import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";

const populateReservation = (query) =>
  query
    .populate("table", "number capacity")
    .populate("user", "name email role")
    .sort({ reservationDate: 1, timeSlot: 1 });

const findAvailableTable = async ({ reservationDate, timeSlot, guests, ignoreReservationId }) => {
  const tables = await Table.find({
    capacity: { $gte: guests },
    isActive: true,
  }).sort({ capacity: 1, number: 1 });

  for (const table of tables) {
    const conflictQuery = {
      table: table._id,
      reservationDate,
      timeSlot,
      status: "booked",
    };

    if (ignoreReservationId) {
      conflictQuery._id = { $ne: ignoreReservationId };
    }

    const conflict = await Reservation.exists(conflictQuery);
    if (!conflict) return table;
  }

  return null;
};

const createReservation = async (req, res, next) => {
  try {
    const { reservationDate, timeSlot, guests } = req.body;
    const table = await findAvailableTable({ reservationDate, timeSlot, guests });

    if (!table) {
      return res.status(409).json({
        message: "No available table fits this party size for the selected slot",
      });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: table._id,
      reservationDate,
      timeSlot,
      guests,
    });

    const result = await populateReservation(
      Reservation.findById(reservation._id),
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const myReservations = async (req, res, next) => {
  try {
    const reservations = await populateReservation(
      Reservation.find({ user: req.user._id }),
    );
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

const allReservations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.date) filter.reservationDate = req.query.date;

    const reservations = await populateReservation(Reservation.find(filter));
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role !== "admin") {
      filter.user = req.user._id;
    }

    const reservation = await Reservation.findOneAndUpdate(
      filter,
      { status: "cancelled" },
      { new: true },
    )
      .populate("table", "number capacity")
      .populate("user", "name email role");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const nextDate = req.body.reservationDate || reservation.reservationDate;
    const nextSlot = req.body.timeSlot || reservation.timeSlot;
    const nextGuests = req.body.guests || reservation.guests;

    const table = await findAvailableTable({
      reservationDate: nextDate,
      timeSlot: nextSlot,
      guests: nextGuests,
      ignoreReservationId: reservation._id,
    });

    if (!table) {
      return res.status(409).json({
        message: "No available table fits this update for the selected slot",
      });
    }

    reservation.reservationDate = nextDate;
    reservation.timeSlot = nextSlot;
    reservation.guests = nextGuests;
    reservation.table = table._id;
    reservation.status = req.body.status || reservation.status;
    await reservation.save();

    const result = await Reservation.findById(reservation._id)
      .populate("table", "number capacity")
      .populate("user", "name email role");

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  createReservation,
  myReservations,
  allReservations,
  cancelReservation,
  updateReservation,
};
