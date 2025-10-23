import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar bg-base-200 border-b border-base-300 shadow-md">
            {/* Left side - Brand */}
            <div className="flex-1">
                <Link
                    to="/"
                    className="btn btn-ghost normal-case text-xl font-bold text-base-content hover:text-primary transition-colors duration-300"
                >
                    CountriesApp
                </Link>
            </div>

            {/* Right side - Search + Avatar */}
            <div className="flex gap-2 items-center">
                {/* Search box */}
                <input
                    type="text"
                    placeholder="Search countries..."
                    className="input input-bordered border-base-300 bg-base-100 text-base-content w-28 md:w-auto focus:border-primary focus:outline-none transition-all duration-300"
                />

                {/* Avatar Dropdown */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar hover:border-primary/60 border border-transparent transition-all duration-300"
                    >
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
