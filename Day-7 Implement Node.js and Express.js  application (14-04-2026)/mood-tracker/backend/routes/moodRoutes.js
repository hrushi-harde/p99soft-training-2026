import express from "express";
import {
  createMood,
  getMoods,
  deleteMood,
  weeklySummary,
  dominantMood,
  moodStreak,
} from "../controllers/moodController.js";

const router = express.Router();

router.post("/", createMood);
router.get("/", getMoods);
router.delete("/:id", deleteMood);

router.get("/weekly-summary", weeklySummary);
router.get("/dominant", dominantMood);
router.get("/streak", moodStreak);

export default router;