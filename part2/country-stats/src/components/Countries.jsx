function Countries({ countries, handleShow }) {
    return (
        <ul>
            {countries.map(c =>
                <li key={c.flag}>{c.name.common} <button onClick={() => handleShow(c)}>show</button></li>)}
        </ul>
    )
}

export default Countries