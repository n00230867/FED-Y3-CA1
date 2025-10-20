import { useEffect, useState } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";

export default function Home() {
    const [countriesList, setCountriesList] = useState([]);

    useEffect(() => {
        axios
            .get(
                "https://restcountries.com/v3.1/all?fields=flags,flag,name,capital,cca3"
            )
            .then((response) => setCountriesList(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white-900 text-center">
                    Countries
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {countriesList.map((country) => (
                        <CountryCard
                            key={country.cca3}
                            flagImg={country.flags.png}
                            name={country.name.common}
                            capital={country.capital || ["N/A"]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
