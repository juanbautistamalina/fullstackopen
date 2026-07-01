const mongoose = require("mongoose");
require("dotenv").config();

// Ejecutar: node mongo.js yourPassword || node mongo.js yourPassword name number

// Obtener los argumentos de la línea de comandos
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// Configurar url de la db y realizar la conexión
const url = `${process.env.MONGODB_BASE_URL}${password}@cluster0.nz96pis.mongodb.net/phonebookApp?appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  // Obtener todas las entradas de la base de datos y mostratrlas por consola
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  
  // Crear una nueva persona usando el modelo
  const person = new Person({ name, number });

  // Guardar persona en la base de datos
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
