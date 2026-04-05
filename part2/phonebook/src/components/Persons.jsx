
function Persons({personsFilter, handleDelete}) {
    return (
        <>
            {personsFilter.map(person => 
            <p key={person.name}>
                {person.name} | {person.number} 
                <button onClick={() => handleDelete(person.id)}>delete</button>    
            </p>)}
        </>
    )
}

export default Persons