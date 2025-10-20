import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import React from 'react';
import './style/App.css';

//import components
import Navbar from './components/Navbar';

//import pages
import Home from './pages/Home';
import SingleCountry from './pages/SingleCountry';

export default function App () {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/country/:name' element={<SingleCountry />} />
                </Routes>
            </Router>
        </>
    );
};
