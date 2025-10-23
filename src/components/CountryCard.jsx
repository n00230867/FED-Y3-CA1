import { useNavigate } from "react-router-dom";

export default function CountryCard({ flagImg, name, capital }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/country/${name}`)}
            className="flex items-center bg-base-200 dark:bg-base-200 rounded-xl shadow-md hover:shadow-lg p-4 cursor-pointer transition-all duration-300 border border-base-300 hover:border-primary/60"
        >
            <img
                src={flagImg}
                alt={`${name} flag`}
                className="w-28 h-20 object-cover rounded-lg mr-5 border border-base-300 dark:border-base-300 shadow-sm hover:shadow-md transition-all duration-300"
            />
            <div className="flex flex-col justify-center">
                <p className="font-semibold text-lg text-base-content mb-1">
                    {name}
                </p>
                <p className="text-sm text-base-content/70">
                    <span className="font-medium text-base-content">Capital:</span>{" "}
                    {capital.join(", ")}
                </p>
            </div>
        </div>
    );
}
