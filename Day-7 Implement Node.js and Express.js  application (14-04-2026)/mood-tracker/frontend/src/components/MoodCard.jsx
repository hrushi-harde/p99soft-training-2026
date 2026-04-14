import API from "../services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function MoodCard({ mood, fetchMoods }) {
  const handleDelete = async () => {
    const res = await Swal.fire({
      title: "Delete this mood?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (res.isConfirmed) {
      try {
        await API.delete(`/moods/${mood.id}`);
        toast.success("Deleted!");
        fetchMoods();
      } catch {
        toast.error("Error deleting");
      }
    }
  };

  const moodColor = {
    happy: "bg-emerald-50 border-emerald-200/70 dark:bg-emerald-950/25 dark:border-emerald-800/40",
    sad: "bg-sky-50 border-sky-200/70 dark:bg-sky-950/25 dark:border-sky-800/40",
    stressed: "bg-amber-50 border-amber-200/70 dark:bg-amber-950/25 dark:border-amber-800/40",
    angry: "bg-rose-50 border-rose-200/70 dark:bg-rose-950/25 dark:border-rose-800/40",
  };

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${moodColor[mood.mood] || "bg-slate-50 border-slate-200/70 dark:bg-slate-900/40 dark:border-slate-800/60"}`}
    >
      <div>
        <p className="text-sm font-semibold capitalize tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">{mood.mood}</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{mood.note}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{mood.created_at}</p>
      </div>

      <button
        onClick={handleDelete}
        className="inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-white/70 hover:text-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-100 dark:text-rose-300 dark:hover:bg-slate-950/50 dark:hover:text-rose-200 dark:focus:ring-rose-900/30"
      >
        Delete
      </button>
    </div>
  );
}