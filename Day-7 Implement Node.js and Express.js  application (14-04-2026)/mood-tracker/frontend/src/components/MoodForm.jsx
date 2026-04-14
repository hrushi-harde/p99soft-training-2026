import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function MoodForm({ fetchMoods }) {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood) return toast.error("Please select a mood");

    try {
      setLoading(true);

      await API.post("/moods", {
        mood,
        note: note.trim(), // 🔥 FIXED
      });

      toast.success("Mood added successfully 🎉");

      setMood("");
      setNote("");
      fetchMoods();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/60 dark:bg-slate-950/40 sm:p-6"
    >
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
        Add Your Mood
      </h2>

      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
      >
        <option value="">Select Mood</option>
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="stressed">😫 Stressed</option>
        <option value="angry">😡 Angry</option>
      </select>

      <textarea
        placeholder="Write a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
        rows={4}
      />

      <button
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Adding..." : "Add Mood"}
      </button>
    </form>
  );
}