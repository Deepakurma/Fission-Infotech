import express from "express";
import { body } from "express-validator";
import {
  createTable,
  listTables,
  updateTable,
} from "../controllers/tableController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.get("/", protect, adminOnly, listTables);
router.post(
  "/",
  protect,
  adminOnly,
  [
    body("number").isInt({ min: 1 }).withMessage("Table number is required"),
    body("capacity").isInt({ min: 1 }).withMessage("Capacity is required"),
  ],
  validate,
  createTable,
);
router.patch(
  "/:id",
  protect,
  adminOnly,
  [
    body("number").optional().isInt({ min: 1 }),
    body("capacity").optional().isInt({ min: 1 }),
    body("isActive").optional().isBoolean(),
  ],
  validate,
  updateTable,
);

export default router;
