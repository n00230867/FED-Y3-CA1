import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";

export default function SingleCelebrity() {
    const { name } = useParams();
    const navigate = useNavigate();

    const [celeb, setCeleb] = useState(null);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            try {
                const search = await axios.get(
                    `https://api.themoviedb.org/3/search/person?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${name}`
                );

                if (!search.data.results.length) {
                    setCeleb(null);
                    setLoading(false);
                    return;
                }

                const id = search.data.results[0].id;

                const info = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );

                const credits = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );

                setCeleb(info.data);

                const sorted = credits.data.cast
                    .filter(t => t.poster_path)
                    .sort((a, b) => b.vote_average - a.vote_average)
                    .slice(0, 12);

                setTitles(sorted);

            } catch {
                console.log("Error fetching celebrity");
            }

            setLoading(false);
        }

        loadData();
    }, [name]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary mb-3" />
                <p className="text-lg opacity-80">Loading celebrity data…</p>
            </div>
        );
    }

    if (!celeb) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-base-100">
                <h2 className="text-3xl font-bold mb-3">Celebrity not found</h2>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>← Back</button>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-base-100 text-base-content p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Back + breadcrumbs */}
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-outline btn-primary"
                    >
                        ← Back
                    </button>

                    <div className="text-sm breadcrumbs">
                        <ul>
                            <li onClick={() => navigate("/")} className="cursor-pointer opacity-70 hover:opacity-100 transition">
                                Home
                            </li>
                            <li onClick={() => navigate("/celebrities")} className="cursor-pointer opacity-70 hover:opacity-100 transition">
                                Celebrities
                            </li>
                            <li className="opacity-60">{celeb.name}</li>
                        </ul>
                    </div>
                </div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <h1 className="text-4xl font-bold">{celeb.name}</h1>
                    <p className="opacity-70 mt-1 text-sm">{celeb.known_for_department}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Profile card */}
                    <motion.div
                        className="rounded-2xl card bg-base-200 shadow-sm border border-base-300 p-6 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <img
                            src={
                                celeb.profile_path
                                    ? `https://image.tmdb.org/t/p/w500${celeb.profile_path}`
                                    : "https://via.placeholder.com/400x600?text=No+Image"
                            }
                            alt={celeb.name}
                            className="w-full max-w-xs rounded-xl border border-base-300 shadow-md mb-4 object-cover"
                        />

                        <p className="text-lg font-semibold mb-2">{celeb.name}</p>

                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                            {celeb.gender !== 0 && (
                                <span className="badge badge-outline">
                                    {celeb.gender === 2 ? "Male" : "Female"}
                                </span>
                            )}
                            <span className="badge badge-outline">{celeb.known_for_department}</span>
                        </div>

                        <div className="text-sm opacity-90 space-y-1">
                            <p><b>Born:</b> {celeb.birthday || "Unknown"}</p>
                            <p><b>Birthplace:</b> {celeb.place_of_birth || "Unknown"}</p>
                            {celeb.deathday && <p><b>Died:</b> {celeb.deathday}</p>}
                        </div>

                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(celeb.name)}`}
                            target="_blank"
                            className="btn btn-primary btn-sm mt-4 w-full"
                        >
                            Search Google
                        </a>
                    </motion.div>

                    {/* Biography */}
                    <motion.div
                        className="rounded-2xl card bg-base-200 shadow-sm border border-base-300 p-6"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                    >
                        <h2 className="text-xl font-semibold mb-2">Biography</h2>
                        <p className="leading-relaxed opacity-90">
                            {celeb.biography || "No biography available."}
                        </p>
                    </motion.div>
                </div>

                {/* Top Movies & Shows */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Top Movies & Shows</h2>
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {titles.map((t, i) => (
                            <div
                                key={i}
                                className="bg-base-200 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-all p-2"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${t.poster_path}`}
                                    alt={t.title || t.name}
                                    className="rounded-lg w-full object-cover mb-2"
                                />
                                <p className="text-sm font-medium text-center">{t.title || t.name}</p>
                                <p className="text-xs text-center opacity-70">
                                    {(t.release_date || t.first_air_date || "").slice(0, 4)}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </section>
            </div>
        </motion.div>
    );
}
