import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";

export default function SingleCountry() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
            .then((response) => setCountry(response.data[0]))
            .catch((error) => console.error("Error fetching country:", error))
            .finally(() => setLoading(false));
    }, [name]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-base-content">
                <span className="loading loading-spinner loading-lg text-primary mb-3"></span>
                <p className="text-base-content/80 text-lg">Loading country data…</p>
            </div>
        );
    }

    const currencies = Object.keys(country.currencies || {}).map((code) => {
        const currency = country.currencies[code];
        return (
            <motion.div
                key={code}
                className="bg-base-200 border border-base-300 rounded-xl shadow-sm p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h3 className="text-lg font-semibold mb-1">{code}</h3>
                <p><b>Name:</b> {currency.name}</p>
                <p><b>Symbol:</b> {currency.symbol || "N/A"}</p>
            </motion.div>
        );
    });

    return (
        <motion.div
            className="min-h-screen bg-base-100 text-base-content p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Back */}
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm btn-outline btn-primary"
                    >
                        ← Back
                    </button>

                    <div className="text-sm breadcrumbs">
                        <ul>
                            <li onClick={() => navigate('/')} className="cursor-pointer opacity-70 hover:opacity-100 transition">Home</li>
                            <li className="opacity-60">{country.name.common}</li>
                        </ul>
                    </div>
                </div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <h1 className="text-4xl font-bold">{country.name.common}</h1>
                    <p className="opacity-70 mt-1 text-sm">{country.name.official}</p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Flag */}
                    <motion.div
                        className="rounded-2xl card bg-base-200 shadow-sm border border-base-300"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <figure className="bg-base-200 border-b border-base-300 p-6">
                            <img
                                src={country.flags?.png}
                                alt={country.name.common}
                                className="w-full max-w-[520px] h-60 md:h-72 object-contain rounded-xl"
                            />
                        </figure>

                        <div className="card-body">
                            <p><b>Capital:</b> {country.capital?.join(", ") || "N/A"}</p>
                            <p><b>Population:</b> {country.population?.toLocaleString()}</p>
                            <p><b>Region:</b> {country.region}</p>
                            {country.subregion && <p><b>Subregion:</b> {country.subregion}</p>}

                            <div className="flex gap-2 flex-wrap pt-2">
                                <span className="badge badge-outline">{country.region}</span>
                                {country.subregion && <span className="badge badge-outline">{country.subregion}</span>}
                            </div>
                        </div>
                    </motion.div>

                    {/* Coat of Arms */}
                    <motion.div
                        className="rounded-2xl card bg-base-200 shadow-sm border border-base-300 flex flex-col items-center justify-center p-6"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                    >
                        {country.coatOfArms?.png ? (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Coat of Arms</h2>
                                <img
                                    src={country.coatOfArms.png}
                                    alt={`${country.name.common} coat of arms`}
                                    className="w-64 h-64 object-contain rounded-xl bg-base-100 p-3 border border-base-300"
                                />
                            </>
                        ) : (
                            <p className="opacity-70">No coat of arms available</p>
                        )}
                    </motion.div>
                </div>

                {/* Currencies */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Currencies</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currencies.length ? currencies : <p className="opacity-70 text-sm">No currency data available</p>}
                    </div>
                </section>

                {/* Map */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Map Location</h2>
                    <motion.div
                        className="rounded-xl overflow-hidden border border-base-300 shadow-sm"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <iframe
                            title="Google Map"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(country.name.common)}&output=embed`}
                        ></iframe>
                    </motion.div>
                </section>

            </div>
        </motion.div>
    );
}
