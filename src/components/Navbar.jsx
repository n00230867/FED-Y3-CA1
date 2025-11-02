import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import logoDark from "../assets/logo-light.png";   // white logo for dark theme
import logoLight from "../assets/logo-dark.png"; // black logo for light theme

const Navbar = ({ setSearchText }) => {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "corporate" : "dark");
    };

    return (
        <>
            <div className="
                navbar sticky top-0 z-50
                bg-base-200/90 backdrop-blur-lg
                border-b border-base-300 shadow-md
                px-6 py-2
            ">

                {/* Left Section */}
                <div className="flex items-center gap-8 flex-1">
                    <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                        <img
                            src={theme === "dark" ? logoDark : logoLight}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/countries" className="text-lg font-medium hover:text-primary">
                            Countries
                        </Link>
                        <Link to="/celebrities" className="text-lg font-medium hover:text-primary">
                            Celebrities
                        </Link>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-2">
                    <label className="input input-bordered flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-all">
                        <input
                            type="text"
                            className="grow bg-transparent outline-none"
                            placeholder="Search"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </label>

                    <button
                        className="btn btn-ghost btn-square"
                        onClick={() => setOpen(!open)}
                    >
                        <span className="text-3xl">☰</span>
                    </button>
                </div>
            </div>

            {/* Sidebar Drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            key="menu"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 120, damping: 14 }}
                            className="
                                fixed top-0 right-0 h-full w-64
                                bg-base-100 border-l border-base-300 shadow-xl
                                p-6 z-50 flex flex-col gap-4
                            "
                        >
                            <h3 className="text-xl font-bold mb-1">Menu</h3>

                            {/* Close Button - now blue theme default */}
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </button>

                            {/* Theme toggle inside sidebar */}
                            <button
                                className="btn w-full"
                                onClick={toggleTheme}
                            >
                                {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
