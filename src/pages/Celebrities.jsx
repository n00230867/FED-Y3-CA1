import { useEffect, useState } from "react";
import axios from "axios";
import CelebrityCard from "../components/CelebrityCard";

export default function Celebrities({ searchText }) {

    // =========================
    // Countries & Filters
    // =========================
    const [countries, setCountries] = useState([]);
    const [countryLookup, setCountryLookup] = useState([]);
    const [regions, setRegions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [regionFilter, setRegionFilter] = useState("All");
    const [countryFilter, setCountryFilter] = useState("All");

    // =========================
    // Celebrities & Loading
    // =========================
    const [celebrities, setCelebrities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    // =========================
    // API: Load More Celebrities
    // (Pagination)
    // =========================
    async function loadMoreCelebs() {
        try {
            setLoadingMore(true);

            const res = await axios.get(
                `https://api.themoviedb.org/3/person/popular?api_key=${
                    import.meta.env.VITE_TMDB_KEY
                }&page=${page}`
            );

            // Stop if no more results
            if (!res.data.results.length) {
                setHasMore(false);
                return;
            }

            // Fetch full details for each celebrity
            const detailed = await Promise.all(
                res.data.results.map(async person => {
                    const info = await axios.get(
                        `https://api.themoviedb.org/3/person/${person.id}?api_key=${
                            import.meta.env.VITE_TMDB_KEY
                        }`
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

            // Merge new celebs + avoid duplicates
            setCelebrities(prev => {
                const combined = [...prev, ...detailed];
                return combined.filter(
                    (p, idx, arr) => idx === arr.findIndex(x => x.id === p.id)
                );
            });

            setPage(prev => prev + 1);
        } catch (err) {
            console.log("TMDB fetch error", err);
        }

        setLoadingMore(false);
    }


    // =========================
    // API: Load countries + initial celebs
    // =========================
    useEffect(() => {
        async function loadInitial() {
            setLoading(true);

            try {
                // Fetch country data
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

                // Populate region + country filter dropdowns
                const uniqueRegions = Array.from(new Set(countryList.map(c => c.region))).sort();
                setRegions(["All", ...uniqueRegions]);
                setCountryOptions(countryList.map(c => c.name).sort());

                // Load first batch of celebs
                await loadMoreCelebs();
            } catch (err) {
                console.log("Error loading countries", err);
            }

            setLoading(false);
        }

        loadInitial();
    }, []);


    // =========================
    // Update country dropdown when region changes
    // =========================
    useEffect(() => {
        if (regionFilter === "All") {
            setCountryOptions(countries.map(c => c.name).sort());
        } else {
            setCountryOptions(
                countries.filter(c => c.region === regionFilter).map(c => c.name).sort()
            );
        }
        setCountryFilter("All");
    }, [regionFilter, countries]);


    // =========================
    // Helper: Match birthplace to a country
    // =========================
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


    // =========================
    // Filter celebrities based on search + region + country
    // =========================
    const filteredCelebs = celebrities
        .filter(c => {
            const match = findCountryFromBirthplace(c.birthplace);
            if (regionFilter !== "All" && (!match || match.region !== regionFilter)) return false;
            if (countryFilter !== "All" && (!match || match.name !== countryFilter)) return false;
            return true;
        })
        .filter(c => c.name.toLowerCase().includes((searchText || "").toLowerCase()));


    // =========================
    // UI
    // =========================
    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-7xl mx-auto p-6">

                {/* Page title and filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-4xl font-bold mb-4 md:mb-0">
                        {regionFilter === "All" && countryFilter === "All"
                            ? "All Celebrities"
                            : countryFilter !== "All"
                            ? `Celebrities from ${countryFilter}`
                            : `Celebrities in ${regionFilter}`}
                    </h1>

                    <div className="flex gap-3">

                        {/* Region filter */}
                        <div className="form-control w-44">
                            <label className="label">
                                <span className="label-text text-lg font-semibold">Region</span>
                            </label>
                            <select
                                className="select select-bordered select-primary"
                                value={regionFilter}
                                onChange={e => setRegionFilter(e.target.value)}
                            >
                                {regions.map((r, i) => (
                                    <option key={i} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Country filter */}
                        <div className="form-control w-56">
                            <label className="label">
                                <span className="label-text text-lg font-semibold">Country</span>
                            </label>
                            <select
                                className="select select-bordered select-primary"
                                value={countryFilter}
                                onChange={e => setCountryFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                {countryOptions.map((c, i) => (
                                    <option key={i} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="text-lg">Loading celebrities...</p>
                    </div>
                ) : (
                    <>
                        {/* Celebrity grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {filteredCelebs.map((c) => (
                                <CelebrityCard
                                    key={c.id}
                                    name={c.name}
                                    img={c.img}
                                    knownFor={c.knownFor}
                                    birthplace={c.birthplace}
                                />
                            ))}
                        </div>

                        {/* Load more button */}
                        {hasMore && (
                            <div className="flex justify-center mb-12">
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
