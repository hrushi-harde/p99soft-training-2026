import db from "../config/db.js";

/* CREATE */
export const createMood = async (req, res, next) => {
  try {
    const { mood, note } = req.body;

    const result = await db.query(
      "INSERT INTO moods (mood, note) VALUES ($1,$2) RETURNING *",
      [mood, note]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/* GET ALL */
export const getMoods = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT * FROM moods ORDER BY created_at DESC"
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

/* DELETE */
export const deleteMood = async (req, res, next) => {
  try {
    await db.query("DELETE FROM moods WHERE id=$1", [
      req.params.id,
    ]);

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

/* WEEKLY SUMMARY */
export const weeklySummary = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT mood, COUNT(*) 
      FROM moods
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY mood
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

/* DOMINANT MOOD */
export const dominantMood = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT mood, COUNT(*) as count
      FROM moods
      GROUP BY mood
      ORDER BY count DESC
      LIMIT 1
    `);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/* STREAK */
export const moodStreak = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT created_at FROM moods
      ORDER BY created_at DESC
    `);

    let streak = 0;
    let today = new Date();

    for (let i = 0; i < result.rows.length; i++) {
      const date = new Date(result.rows[i].created_at);

      if (
        today.toDateString() === date.toDateString()
      ) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ success: true, streak });
  } catch (err) {
    next(err);
  }
};