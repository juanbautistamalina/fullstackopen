const mongoose = require("mongoose");
require("dotenv").config();

// Configurar url de la db y realizar la conexión
const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Crear una nueva persona usando el modelo
// const person = new Person({ name: "Arto Hellas", number: "040-123456" });
// const person = new Person({name: "Ada Lovelace", number: "39-44-5323523"});
// const person = new Person({name: "Dan Abramov", number: "12-43-234345"})
// const person = new Person({name: "Mary Poppendieck", number: "39-23-6423122"})

// Guardar persona en la base de datos
// person.save().then((result) => {
//   console.log(`added ${result.name} number ${result.number} to phonebook`);
//   mongoose.connection.close();
// });

Person.find({}).then((people) => {
  console.log("Phonebook:")
  people.map(p => console.log(`${p.name}, ${p.number}`));
  mongoose.connection.close()
});
