import express from "express";
import { body, query } from "express-validator";
import {
  allReservations,
  cancelReservation,
  createReservation,
  myReservations,
  updateReservation,
} from "../controllers/reservationController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const reservationValidators = [
  body("reservationDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must use YYYY-MM-DD"),
  body("timeSlot").trim().notEmpty().withMessage("Time slot is required"),
  body("guests").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
];

router.post("/", protect, reservationValidators, validate, createReservation);
router.get("/mine", protect, myReservations);
router.patch("/:id/cancel", protect, cancelReservation);

router.get(
  "/",
  protect,
  adminOnly,
  [query("date").optional().matches(/^\d{4}-\d{2}-\d{2}$/)],
  validate,
  allReservations,
);
router.patch(
  "/:id",
  protect,
  adminOnly,
  [
    body("reservationDate").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body("timeSlot").optional().trim().notEmpty(),
    body("guests").optional().isInt({ min: 1 }),
    body("status").optional().isIn(["booked", "cancelled"]),
  ],
  validate,
  updateReservation,
);

export default router;
