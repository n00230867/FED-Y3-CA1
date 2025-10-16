export default function CountryCard({flagImg, name, capital}){
    return (
        <>
            <img alt={name} src={flagImg} />
            <p><b>Name: </b> {name}</p>
            <p><b>Capital: </b> {capital.join(', ')}</p>
        </>
    );
};