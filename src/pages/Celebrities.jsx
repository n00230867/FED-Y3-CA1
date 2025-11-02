import { useEffect, useState } from "react";
import axios from "axios";
import CelebrityCard from "../components/CelebrityCard";
import { motion, stagger } from "motion/react";
import { useLocation } from "react-router-dom";

export default function Celebrities({ searchText }) {

    const location = useLocation();
    const [countries, setCountries] = useState([]);
    const [countryLookup, setCountryLookup] = useState([]);
    const [regions, setRegions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [regionFilter, setRegionFilter] = useState("All");
    const [countryFilter, setCountryFilter] = useState("All");

    const [celebrities, setCelebrities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function loadMoreCelebs() {
        try {
            setLoadingMore(true);
            const res = await axios.get(
                `https://api.themoviedb.org/3/person/popular?api_key=${import.meta.env.VITE_TMDB_KEY}&page=${page}`
            );

            if (!res.data.results.length) {
                setHasMore(false);
                return;
            }

            const detailed = await Promise.all(
                res.data.results.map(async person => {
                    const info = await axios.get(
                        `https://api.themoviedb.org/3/person/${person.id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                    );

                    return {
                        id: person.id,
                        name: person.name,
                        img: person.profile_path
                            ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                            : null,
                        knownFor: person.known_for_department,
                        birthplace: info.data.place_of_birth || "",
                    };
                })
            );

            setCelebrities(prev => {
                const combined = [...prev, ...detailed];
                return combined.filter(
                    (p, idx, arr) => idx === arr.findIndex(x => x.id === p.id)
                );
            });

            setPage(prev => prev + 1);
        } catch {
            console.log("TMDB fetch error");
        }

        setLoadingMore(false);
    }

    useEffect(() => {
        async function loadInitial() {
            setLoading(true);
            try {
                const res = await axios.get(
                    "https://restcountries.com/v3.1/all?fields=name,region,altSpellings"
                );

                const countryList = res.data.map(country => ({
                    name: country.name.common,
                    officialName: country.name.official,
                    officialNameLower: country.name.official.toLowerCase(),
                    altSpellings: country.altSpellings?.map(x => x.toLowerCase()) || [],
                    nameLower: country.name.common.toLowerCase(),
                    region: country.region || "Unknown",
                }));

                setCountries(countryList);
                setCountryLookup(countryList);

                const uniqueRegions = Array.from(new Set(countryList.map(c => c.region))).sort();
                setRegions(["All", ...uniqueRegions]);
                setCountryOptions(countryList.map(c => c.name).sort());

                await loadMoreCelebs();
            } catch {
                console.log("Error loading countries");
            }

            setLoading(false);
        }

        loadInitial();
    }, []);

    useEffect(() => {
        if (regionFilter === "All") {
            setCountryOptions(countries.map(c => c.name).sort());
        } else {
            setCountryOptions(
                countries
                    .filter(c => c.region === regionFilter)
                    .map(c => c.name)
                    .sort()
            );
        }
        setCountryFilter("All");
    }, [regionFilter, countries]);


    function findCountryFromBirthplace(place) {
        if (!place) return null;
        const text = place.toLowerCase();
        const parts = text.split(",").map(p => p.trim());

        for (const country of countryLookup) {
            if (parts.includes(country.nameLower)) return country;
            if (parts.includes(country.officialNameLower)) return country;
            if (country.altSpellings.some(spell => parts.includes(spell))) return country;
        }

        return null;
    }

    const filteredCelebs = celebrities
        .filter(c => {
            const match = findCountryFromBirthplace(c.birthplace);
            if (regionFilter !== "All" && (!match || match.region !== regionFilter)) return false;
            if (countryFilter !== "All" && (!match || match.name !== countryFilter)) return false;
            return true;
        })
        .filter(c => c.name.toLowerCase().includes((searchText || "").toLowerCase()));

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="max-w-7xl mx-auto p-6">

                <motion.div
                    className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold mb-4 md:mb-0">
                        {regionFilter === "All" && countryFilter === "All"
                            ? "Popular Celebrities"
                            : countryFilter !== "All"
                            ? `Celebrities from ${countryFilter}`
                            : `Celebrities in ${regionFilter}`}
                    </h1>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="text-lg">Loading celebrities...</p>
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: 0.2,
                                    staggerChildren: stagger(0.08),
                                },
                            }}
                        >
                            {filteredCelebs.map((c) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45 }}
                                    whileHover={{
                                        scale: 1.04,
                                        rotateX: 6,
                                        rotateY: -6,
                                        boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="relative"
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-xl pointer-events-none"
                                        style={{
                                            background:
                                                "radial-gradient(circle at center, rgba(0,150,255,0.2), transparent 70%)",
                                        }}
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1, scale: 1.4 }}
                                        transition={{ duration: 0.4 }}
                                    />

                                    <CelebrityCard
                                        name={c.name}
                                        img={c.img}
                                        knownFor={c.knownFor}
                                        birthplace={c.birthplace}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {hasMore && (
                            <div className="flex justify-center my-12">
                                <button
                                    className="btn btn-primary"
                                    onClick={loadMoreCelebs}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
