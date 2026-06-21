const Countries = ({ countries, onClick }) => {

    if (countries.length === 0) return <p>No matches found</p>
    else if (countries.length > 10) return <p>Too many matches, specify another filter</p>

    return (
        <ul>
            {countries.map(country =>
                <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => onClick(country)}>Show</button>
                </li>)}
        </ul>
    )
}

export default Countries