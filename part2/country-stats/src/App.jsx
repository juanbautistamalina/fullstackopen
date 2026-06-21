import { useEffect, useState } from 'react'
import axios from "axios"
import Country from './components/Country';
import Countries from './components/Countries';

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  // Obtener todos los países de la API luego del primer render
  useEffect(() => {
    setLoading(true)
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        const { data } = response
        setAllCountries(data)
        setLoading(false)
      })
  }, [])

  // En base a lo que el usuario escriba, mostrar países que tengan coincidencias en el nombre
  const countriesList = text
    ? allCountries.filter(country => country.name.common.toLowerCase().includes(text.toLowerCase()))
    : allCountries

  // Función que se ejecuta cada vez que el usuario escribe en el input
  const handleChange = () => {
    setText(event.target.value)

    // Utilizar el valor actual del input (event.target.value) para ver si hay un único país
    const coincidences = allCountries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    if (coincidences.length === 1) {
      return setCountry(coincidences[0])
    }
    setCountry(null)
  }

  const render = loading
    ? <p>Loading...</p>
    : country
      ? <Country country={country} />
      : <Countries countries={countriesList} onClick={(newCountry) => setCountry(newCountry)} />

  return (
    <>
      <p>find countries <input value={text} onChange={handleChange} /></p>
      {render}
    </>
  )
}

export default App
