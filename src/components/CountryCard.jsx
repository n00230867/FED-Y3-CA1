import { useNavigate } from "react-router-dom";

export default function CountryCard({ flagImg, name, capital }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/country/${name}`)}
            className="relative flex flex-col bg-base-200 rounded-xl shadow-md hover:shadow-xl p-4 cursor-pointer transition-all duration-300 border border-base-300 hover:border-primary/60 min-h-60"
        >
            <img
                src={flagImg}
                alt={`${name} flag`}
                className="w-full h-32 object-cover rounded-lg border border-base-300 shadow-sm mb-3"
            />
            <div>
                <p className="font-semibold text-lg text-base-content mb-1">
                    {name}
                </p>
                <p className="text-sm text-base-content/70">
                    <span className="font-medium">Capital:</span> {capital.join(", ")}
                </p>
            </div>
        </div>
    );
}
