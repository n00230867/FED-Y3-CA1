import { Link } from "react-router-dom";

const Navbar = ({ setSearchText }) => {
    return (
        <div className="
            navbar sticky top-0 z-50
            bg-base-200/90 backdrop-blur-lg
            border-b border-base-300 shadow-md
        ">
            
            {/* Left side links */}
            <div className="flex-1 gap-2">
                <Link
                    to="/"
                    className="btn btn-ghost normal-case text-xl font-bold text-base-content hover:text-primary"
                >
                    CountriesApp
                </Link>

                <Link
                    to="/countries"
                    className="btn btn-ghost normal-case text-lg font-semibold text-base-content hover:text-primary"
                >
                    Countries
                </Link>

                <Link
                    to="/celebrities"
                    className="btn btn-ghost normal-case text-lg font-semibold text-base-content hover:text-primary"
                >
                    Celebrities
                </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
                <label className="input input-bordered flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-all">
                    <input
                        type="text"
                        className="grow bg-transparent outline-none"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </label>
            </div>

        </div>
    );
};

export default Navbar;
