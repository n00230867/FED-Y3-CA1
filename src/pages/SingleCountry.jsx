import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SingleCountry() {
    const { name } = useParams();
    const [country, setCountry] = useState(null);

    useEffect(() => {
        axios
            .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
            .then((response) => setCountry(response.data[0]))
            .catch((error) => console.log(error));
    }, [name]);

    if (!country) return <p className="text-center mt-8">Loading...</p>;

    const currencies = Object.keys(country.currencies || {}).map((code) => (
        <div
            key={code}
            className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition"
        >
            <p className="font-semibold text-gray-700">
                <b>Code:</b> {code}
            </p>
            <p className="text-gray-700">
                <b>Name:</b> {country.currencies[code].name}
            </p>
            <p className="text-gray-700">
                <b>Symbol:</b> {country.currencies[code].symbol}
            </p>
        </div>
    ));

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col items-center space-y-6">
            {/* Flag */}
            <img
                src={country.flags.png}
                alt={country.name.common}
                className="w-64 h-40 object-cover rounded-md shadow-md"
            />

            {/* Country Basic Info */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full">
                <p className="text-xl font-bold mb-2 text-gray-900">{country.name.common}</p>
                <p className="text-gray-800">
                    <b>Official Name:</b> {country.name.official}
                </p>
                <p className="text-gray-800">
                    <b>Capital(s):</b> {country.capital?.join(", ") || "N/A"}
                </p>
            </div>

            {/* Currencies */}
            <div className="w-full">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Currencies:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{currencies}</div>
            </div>

            {/* Coat of Arms */}
            {country.coatOfArms?.png && (
                <img
                    src={country.coatOfArms.png}
                    alt={`${country.name.common} coat of arms`}
                    className="w-32 h-32 object-contain mt-4"
                />
            )}
        </div>
    );
}
