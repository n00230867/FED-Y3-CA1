import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SingleCelebrity() {
    // Get the celebrity name from the URL
    const { name } = useParams();

    // selected celebrity info
    const [celeb, setCeleb] = useState(null);

    // top movies and shows
    const [titles, setTitles] = useState([]);

    // Loading state for UI feedback
    const [loading, setLoading] = useState(true);

    // Fetch data when component loads or name changes
    useEffect(() => {
        async function loadData() {
            setLoading(true);

            try {
                // Search TMDB for a celebrity by name
                const search = await axios.get(
                    `https://api.themoviedb.org/3/search/person?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${name}`
                );

                if (!search.data.results.length) {
                    setCeleb(null);
                    setLoading(false);
                    return;
                }

                // Get the first matched person ID
                const id = search.data.results[0].id;

                // Fetch detailed celebrity information
                const info = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );

                // Fetch all movies and shows they acted in
                const credits = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${import.meta.env.VITE_TMDB_KEY}`
                );
                setCeleb(info.data);

                // Sort titles by highest rating and keep top 12 with posters
                const sorted = credits.data.cast
                    .filter(t => t.poster_path)
                    .sort((a, b) => b.vote_average - a.vote_average)
                    .slice(0, 12);

                setTitles(sorted);
            } catch (err) {
                console.log("Error fetching celebrity", err);
            }

            setLoading(false);
        }

        loadData();
    }, [name]); // Re-run if URL name changes


    // Show loading screen while data is fetched
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary mb-4" />
                <p className="text-lg">Loading celebrity info...</p>
            </div>
        );
    }

    // Show fallback if no celebrity was found
    if (!celeb) {
        return (
            <div className="flex justify-center items-center h-screen bg-base-100">
                <h2 className="text-3xl font-bold">Celebrity not found</h2>
            </div>
        );
    }

    // Main celebrity details page UI
    return (
        <div className="min-h-screen bg-base-100 p-6 text-base-content">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">

                {/* Header */}
                <h1 className="text-4xl font-bold">{celeb.name}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Profile Card */}
                    <div className="bg-base-200 border border-base-300 rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-md">

                        {/* Profile Image */}
                        <img
                            src={
                                celeb.profile_path
                                    ? `https://image.tmdb.org/t/p/w500${celeb.profile_path}`
                                    : "https://via.placeholder.com/500x700?text=No+Image"
                            }
                            alt={celeb.name}
                            className="w-full max-w-sm rounded-xl border border-base-300 shadow-md object-cover"
                            style={{ height: "480px", objectFit: "cover" }}
                        />

                        {/* Basic details */}
                        <div className="mt-4 w-full">
                            <p className="text-xl font-semibold text-center mb-2">{celeb.name}</p>

                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                                <span className="badge badge-outline">
                                    {celeb.gender === 2 ? "Male" : celeb.gender === 1 ? "Female" : "Unknown"}
                                </span>

                                <span className="badge badge-outline">{celeb.known_for_department}</span>
                            </div>

                            {/* Birth info */}
                            <div className="space-y-1 text-sm">
                                <p><b>Born:</b> {celeb.birthday || "Unknown"}</p>
                                <p><b>Birthplace:</b> {celeb.place_of_birth || "Unknown"}</p>
                                {celeb.deathday && <p><b>Died:</b> {celeb.deathday}</p>}
                            </div>

                            {/* External search button */}
                            <a
                                href={`https://www.google.com/search?q=${celeb.name}`}
                                target="_blank"
                                className="btn btn-primary btn-sm mt-4 w-full"
                            >
                                Search Google
                            </a>
                        </div>
                    </div>

                    {/* Biography */}
                    <div className="lg:col-span-2 bg-base-200 border border-base-300 rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-2">Biography</h2>
                        <p className="leading-relaxed">
                            {celeb.biography || "No biography available."}
                        </p>
                    </div>
                </div>

                {/* Top rated movies and shows */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Top Movies & Shows</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {titles.map((t, i) => (
                            <div
                                key={i}
                                className="
                                    bg-base-200 border border-base-300 rounded-xl p-2
                                    hover:border-primary/60 hover:shadow-lg transition-all
                                "
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${t.poster_path}`}
                                    alt={t.title || t.name}
                                    className="rounded-lg w-full object-contain mb-2"
                                />
                                <p className="text-sm font-medium text-center">{t.title || t.name}</p>
                                <p className="text-xs text-center opacity-70">
                                    {(t.release_date || t.first_air_date || "").slice(0, 4)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
