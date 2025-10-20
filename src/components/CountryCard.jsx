import { useNavigate } from "react-router-dom";

export default function CountryCard({ flagImg, name, capital }) {
    const navigate = useNavigate();

    return (
        <div
            className="flex items-center bg-base-100 shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => navigate(`/country/${name}`)}
        >
            <img
                src={flagImg}
                alt={name}
                className="w-24 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex flex-col">
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-sm text-gray-600">
                    <b>Capital: </b>
                    {capital.join(", ")}
                </p>
            </div>
        </div>
    );
}
