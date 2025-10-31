import { useEffect, useState } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";

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
        .filter(country =>
            filterRegion === "All" || country.region === filterRegion
        )
        .filter(country =>
            country.name.common.toLowerCase().includes(searchText.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="max-w-7xl mx-auto p-6">

                {/* Title and Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">

                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-4 sm:mb-0">
                        {filterRegion === "All"
                            ? "All Countries"
                            : `Countries in ${filterRegion}`}
                    </h1>

                    {/* Filter */}
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
                </div>

                {/* Loading Spinner */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-neutral-content">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="text-lg">Loading countries...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredCountries.map((country) => (
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
