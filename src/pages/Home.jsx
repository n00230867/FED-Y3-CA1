import { useEffect, useState } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";
import { motion, stagger } from "motion/react";

export default function Home({ searchText }) {
    const [countriesList, setCountriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRegion, setFilterRegion] = useState("All");

    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all?fields=flags,flag,name,capital,cca3,region")
            .then((response) => setCountriesList(response.data))
            .catch((error) => console.error("Error fetching countries:", error))
            .finally(() => setLoading(false));
    }, []);

    const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

    const filteredCountries = countriesList
        .filter(country => filterRegion === "All" || country.region === filterRegion)
        .filter(country => country.name.common.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="max-w-7xl mx-auto p-6">

                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h1
                        className="text-4xl font-bold mb-4 sm:mb-0"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {filterRegion === "All"
                            ? "All Countries"
                            : `Countries in ${filterRegion}`}
                    </motion.h1>

                    <div className="form-control w-56">
                        <label className="label">
                            <span className="label-text text-lg font-semibold">
                                Filter by Region
                            </span>
                        </label>

                        <select
                            className="select select-bordered select-primary"
                            value={filterRegion}
                            onChange={(e) => setFilterRegion(e.target.value)}
                        >
                            {regions.map((region) => (
                                <option key={region} value={region}>
                                    {region}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-neutral-content">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="text-lg">Loading countries...</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                delay: 0.2,
                                staggerChildren: stagger(0.08)
                            }
                        }}
                    >
                        {filteredCountries.map((country) => (
                            <motion.div
                                key={country.cca3}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                                whileHover={{
                                    scale: 1.04,
                                    rotateX: 6,
                                    rotateY: -6,
                                    boxShadow: "0px 12px 24px rgba(0,0,0,0.15)"
                                }}
                                whileTap={{ scale: 0.98, rotateX: 0, rotateY: 0 }}
                                style={{ transformStyle: "preserve-3d" }}
                                className="relative"
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-xl pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, rgba(0,150,255,0.2), transparent 70%)"
                                    }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1, scale: 1.4 }}
                                    transition={{ duration: 0.4 }}
                                />

                                <CountryCard
                                    flagImg={country.flags.png}
                                    name={country.name.common}
                                    capital={country.capital || ["N/A"]}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
