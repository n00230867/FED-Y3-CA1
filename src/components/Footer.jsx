import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="
            bg-base-200/90 backdrop-blur-lg 
            border-t border-base-300 shadow-md
            mt-12
        ">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">

                <div className="font-bold text-lg">
                    CountriesApp
                </div>

                <div className="flex gap-4 text-sm font-medium">
                    <Link to="/" className="link link-hover">Home</Link>
                    <Link to="/countries" className="link link-hover">Countries</Link>
                    <Link to="/celebrities" className="link link-hover">Celebrities</Link>
                </div>

                <p className="text-xs opacity-70">
                    © {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    );
}
