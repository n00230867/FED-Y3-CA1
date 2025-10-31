import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import './style/App.css';

// components
import Navbar from './components/Navbar';

// pages
import Home from './pages/Home';
import SingleCountry from './pages/SingleCountry';

export default function App() {
    const [searchText, setSearchText] = useState("");

    return (
        <>
            <Router>
                <Navbar setSearchText={setSearchText} />
                <Routes>
                    <Route path='/' element={<Home searchText={searchText} />} />
                    <Route path='/country/:name' element={<SingleCountry />} />
                </Routes>
            </Router>
        </>
    );
}
