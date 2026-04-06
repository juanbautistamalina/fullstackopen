function CountryCard({ country }) {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>

            <h2>Languages</h2>
            <ul>
                {Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)}
            </ul>

            <img src={country.flags.png} alt={`Bandera de ${country.name.common}`} style={{ border: "1px solid" }} />
        </div>
    )
}

export default CountryCard