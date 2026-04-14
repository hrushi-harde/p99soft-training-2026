import { useEffect, useState } from "react";
import API from "../services/api";
import MoodForm from "../components/MoodForm";
import MoodCard from "../components/MoodCard";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW STATE (added)
  const [report, setReport] = useState(null);

  const fetchMoods = async () => {
    try {
      const res = await API.get("/moods");
      setMoods(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  // 🔥 GENERATE REPORT FUNCTION (added)
  const handleGenerateReport = async () => {
    try {
      const summaryRes = await API.get("/moods/weekly-summary");
      const dominantRes = await API.get("/moods/dominant");
      const streakRes = await API.get("/moods/streak");

      const reportData = {
        summary: summaryRes.data.data,
        dominant: dominantRes.data.data,
        streak: streakRes.data.streak,
      };

      setReport(reportData);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DOWNLOAD FUNCTION (added)
  const downloadReport = () => {
    if (!report) return;

    let text = "Mood Tracker Report\n\n";

    text += `Dominant Mood: ${report.dominant?.mood}\n`;
    text += `Streak: ${report.streak} days\n\n`;

    text += "Weekly Summary:\n";
    report.summary.forEach((item) => {
      text += `${item.mood}: ${item.count}\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mood-report.txt";
    a.click();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8 dark:from-slate-950 dark:to-slate-900 sm:px-6 sm:py-10">
        <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-2 md:gap-8">
          
          {/* Form */}
          <MoodForm fetchMoods={fetchMoods} />

          {/* Mood List */}
          <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/60 dark:bg-slate-950/40 sm:p-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
                Your Moods
              </h2>

              {/* 🔥 BUTTON ADDED */}
              <button
                onClick={handleGenerateReport}
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
              >
                📊 Summary
              </button>
            </div>

            {loading ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading...</p>
            ) : moods.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No moods yet 😴</p>
            ) : (
              <div className="mt-4 space-y-3">
                {moods.map((m) => (
                  <MoodCard key={m.id} mood={m} fetchMoods={fetchMoods} />
                ))}
              </div>
            )}

            {/* 🔥 REPORT UI ADDED */}
            {report && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                    📊 Weekly Report
                  </h3>

                  <button
                    type="button"
                    onClick={() => setReport(null)}
                    aria-label="Close summary"
                    className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-100 dark:border-rose-900/40 dark:bg-slate-950/40 dark:text-rose-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-200 dark:focus:ring-rose-900/30"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  🔥 Dominant Mood: <b>{report.dominant?.mood}</b>
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  📅 Streak: <b>{report.streak}</b> days
                </p>

                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <b>Summary:</b>
                  {report.summary.map((item, i) => (
                    <p key={i}>
                      {item.mood}: {item.count}
                    </p>
                  ))}
                </div>

                <button
                  onClick={downloadReport}
                  className="mt-3 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                >
                  ⬇ Download Report
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}