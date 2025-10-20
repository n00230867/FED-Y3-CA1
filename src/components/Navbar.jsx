import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-gray-900 shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand / Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-white">
                            CountriesApp
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile menu placeholder */}
                    <div className="md:hidden">
                        {/* Optional: hamburger icon for mobile menu */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
