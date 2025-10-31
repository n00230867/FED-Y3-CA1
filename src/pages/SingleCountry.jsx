import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SingleCountry() {
    const { name } = useParams();
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
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <p className="text-lg">Loading country data...</p>
            </div>
        );
    }

    const currencies = Object.keys(country.currencies || {}).map((code) => {
        const currency = country.currencies[code];
        return (
            <div
                key={code}
                className="bg-base-200 border border-base-300 hover:border-primary/60 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
            >
                <h3 className="text-lg font-semibold text-base-content mb-2">{code}</h3>
                <p className="text-base-content/80">
                    <b>Name:</b> {currency.name}
                </p>
                <p className="text-base-content/80">
                    <b>Symbol:</b> {currency.symbol || "N/A"}
                </p>
            </div>
        );
    });

    return (
        <div className="min-h-screen bg-base-100 text-base-content p-6">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex items-center pb-3">
                    <h1 className="text-4xl font-bold">{country.name.common}</h1>
                </div>

                {/* Flag & Coat of Arms */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Flag Card */}
                    <div className="bg-base-200 border border-base-300 hover:border-primary/60 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="flex items-center justify-center p-4">
                            <img
                                src={country.flags?.png}
                                alt={country.name.common}
                                className="object-contain w-full h-64 md:h-80 rounded-xl border border-base-300 shadow-sm hover:shadow-md transition-all duration-300 bg-base-100"
                            />
                        </div>
                        <div className="p-6 space-y-2">
                            <p className="text-base-content/80"><b>Official Name:</b> {country.name.official}</p>
                            <p className="text-base-content/80"><b>Capital:</b> {country.capital?.join(", ") || "N/A"}</p>
                            <p className="text-base-content/80"><b>Population:</b> {country.population?.toLocaleString() || "N/A"}</p>
                            <p className="text-base-content/80"><b>Region:</b> {country.region || "N/A"}</p>
                            {country.subregion && (
                                <p className="text-base-content/80"><b>Subregion:</b> {country.subregion}</p>
                            )}

                            <div className="flex flex-wrap gap-2 pt-3">
                                <span className="px-3 py-1 rounded-full bg-base-300 text-sm">{country.region}</span>
                                {country.subregion && (
                                    <span className="px-3 py-1 rounded-full bg-base-300 text-sm">{country.subregion}</span>
                                )}
                                <span className="px-3 py-1 rounded-full bg-primary text-primary-content text-sm font-semibold">
                                    {country.cca2}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coat of Arms */}
                    <div className="bg-base-200 border border-base-300 hover:border-primary/60 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center p-6">
                        {country.coatOfArms?.png ? (
                            <>
                                <h2 className="text-xl font-semibold mb-4 text-base-content">Coat of Arms</h2>
                                <img
                                    src={country.coatOfArms.png}
                                    alt={`${country.name.common} coat of arms`}
                                    className="w-80 h-80 object-contain border border-base-300 rounded-xl p-2 bg-base-100 shadow-sm hover:shadow-md transition-all duration-300"
                                />
                            </>
                        ) : (
                            <p className="text-base-content/70">No coat of arms available.</p>
                        )}
                    </div>
                </div>

                {/* Currencies Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-base-content">Currencies</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {currencies.length ? currencies : (
                            <p className="text-base-content/70">No currency data available.</p>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-base-content">Map Location</h2>
                    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-base-300 hover:border-primary/60">
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
                    </div>
                </div>

            </div>
        </div>
    );
}
