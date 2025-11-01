import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CelebrityCard from "../components/CelebrityCard";
import CountryCard from "../components/CountryCard";

function ScrollRow({ children }) {
    const ref = useRef(null);

    const scroll = direction => {
        if (!ref.current) return;
        const amount = 320;
        ref.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative w-full space-y-3">

            {/* Scroll arrows */}
            <div className="flex justify-between px-1">
                <button
                    onClick={() => scroll("left")}
                    className="btn btn-circle btn-sm bg-base-200/80 backdrop-blur border border-base-300 hover:bg-base-200 hover:scale-105 transition shadow-md"
                >
                    ❮
                </button>
                <button
                    onClick={() => scroll("right")}
                    className="btn btn-circle btn-sm bg-base-200/80 backdrop-blur border border-base-300 hover:bg-base-200 hover:scale-105 transition shadow-md"
                >
                    ❯
                </button>
            </div>

            <div
                ref={ref}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>
        </div>
    );
}

export default function Home() {
    const [celebs, setCelebs] = useState([]);
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await axios.get(
                    "https://restcountries.com/v3.1/all?fields=flags,name,capital,cca3,region"
                );
                setCountries(res.data.slice(0, 10));
            } catch {
                console.log("Country fetch error");
            }
        }

        async function fetchCelebs() {
            try {
                const res = await axios.get(
                    `https://api.themoviedb.org/3/person/popular?api_key=${import.meta.env.VITE_TMDB_KEY}&page=1`
                );

                const detailed = await Promise.all(
                    res.data.results.slice(0, 10).map(async person => {
                        const info = await axios.get(
                            `https://api.themoviedb.org/3/person/${person.id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
                        );

                        return {
                            id: person.id,
                            name: person.name,
                            img: person.profile_path
                                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                                : null,
                            birthplace: info.data.place_of_birth || "",
                            knownFor: person.known_for_department
                        };
                    })
                );

                setCelebs(detailed);
            } catch {
                console.log("Celeb fetch error");
            }
        }

        fetchCountries();
        fetchCelebs();
    }, []);

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="max-w-7xl mx-auto p-6 space-y-12">

                {/* Countries */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">Featured Countries</h2>
                        <button
                            onClick={() => navigate("/countries")}
                            className="btn btn-primary btn-outline btn-sm rounded-full"
                        >
                            View All
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ScrollRow>
                            {countries.map(country => (
                                <motion.div
                                    key={country.cca3}
                                    whileHover={{ scale: 1.05 }}
                                    className="min-w-[200px]"
                                >
                                    <CountryCard
                                        flagImg={country.flags.png}
                                        name={country.name.common}
                                        capital={country.capital || ["N/A"]}
                                    />
                                </motion.div>
                            ))}
                        </ScrollRow>
                    </motion.div>
                </div>

                {/* Celebrities */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">Trending Celebrities</h2>
                        <button
                            onClick={() => navigate("/celebrities")}
                            className="btn btn-primary btn-outline btn-sm rounded-full"
                        >
                            View All
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ScrollRow>
                            {celebs.map(c => (
                                <motion.div
                                    key={c.id}
                                    whileHover={{ scale: 1.05 }}
                                    className="min-w-[200px]"
                                >
                                    <CelebrityCard
                                        name={c.name}
                                        img={c.img}
                                        knownFor={c.knownFor}
                                        birthplace={c.birthplace}
                                    />
                                </motion.div>
                            ))}
                        </ScrollRow>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
