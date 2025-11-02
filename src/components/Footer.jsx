import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import logoDark from "../assets/logo-light.png";   // white logo for dark theme
import logoLight from "../assets/logo-dark.png";   // black logo for light theme

export default function Footer() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        if (currentTheme) setTheme(currentTheme);
    }, []);

    return (
        <footer className="
            bg-base-200/90 backdrop-blur-lg 
            border-t border-base-300 shadow-md
            mt-12
        ">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Logo + Name */}
                <div className="flex items-center gap-3">
                    <img
                        src={theme === "dark" ? logoDark : logoLight}
                        alt="Logo"
                        className="w-25 h-25 object-contain"
                    />
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
