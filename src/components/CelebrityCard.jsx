import { Link } from "react-router-dom";

export default function CelebrityCard({ name, img, knownFor, birthplace }) {
    return (
        <Link
            to={`/celebrity/${encodeURIComponent(name)}`}
            className="card bg-base-200 border border-base-300 hover:border-primary/60 hover:shadow-lg transition-all duration-300"
        >
            <figure className="p-4">
                <img
                    src={img || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={name}
                    className="rounded-xl object-cover w-full h-64"
                />
            </figure>

            <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">{name}</h2>
                <p className="text-sm opacity-80">{knownFor}</p>
                <p className="text-xs opacity-50">
                    {birthplace || "Unknown birthplace"}
                </p>
            </div>
        </Link>
    );
}
