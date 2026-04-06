import { useState, useEffect } from "react"
import axios from "axios"
import Notification from "./components/Notification"
import Countries from "./components/Countries"
import CountryCard from "./components/CountryCard"

function App() {
  const [country, setCountry] = useState([])
  const [input, setInput] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (input) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then(response => {
          const allCountry = response.data
          const coincidences = allCountry.filter(c => c.name.common.toLowerCase().includes(input.toLowerCase()))
          setMessage(null)
          setCountry([])

          if (coincidences.length > 10) {
            setMessage("Too many matches")
            return;
          }

          else if (coincidences.length === 0) {
            setMessage("No matches found")
            return;
          }

          setCountry(coincidences)

        })
    }
  }, [input])

  const handleShow = (country) => setCountry([country])

  return (
    <>
      <label style={{ margin: "1em" }}>find countries</label>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />

      {country.length === 1 ? <CountryCard country={country[0]} /> : <Countries countries={country} handleShow={handleShow} />}

      <Notification message={message} />
    </>
  )
}

export default App
