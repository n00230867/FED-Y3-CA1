import { useEffect, useState } from 'react';
import axios from 'axios';
import CountryCard from '../components/CountryCard';

export default function Home () {
    const [countriesList, setCountriesList] = useState([]);

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all?fields=flags,flag,name,capital,cca3')
             .then(response => {
                console.log(response.data);
                setCountriesList(response.data);
             })
             .catch(error => console.log(error));
    }, []);

    let countryCards = countriesList.map((country) => {
        return (
                <CountryCard 
                    key={country.cca3}
                    flagImg={country.flags.png}
                    name={country.name.common}
                    capital={country.capital}
                />
        );
    });

    return (
        <div>
            <h1>Home</h1>
            {countryCards}
        </div>
    );
};