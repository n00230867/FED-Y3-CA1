import { useEffect, useState } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";

export default function Home() {
    const [countriesList, setCountriesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all?fields=flags,flag,name,capital,cca3")
            .then((response) => setCountriesList(response.data))
            .catch((error) => console.error("Error fetching countries:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="max-w-7xl mx-auto p-6">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-8 text-center">
                    All Countries
                </h1>

                {/* Loading state */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-neutral-content">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="text-lg">Loading countries...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {countriesList.map((country) => (
                            <CountryCard
                                key={country.cca3}
                                flagImg={country.flags.png}
                                name={country.name.common}
                                capital={country.capital || ["N/A"]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
