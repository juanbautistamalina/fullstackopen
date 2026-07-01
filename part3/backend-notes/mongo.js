const mongoose = require("mongoose");
require("dotenv").config();

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `${process.env.MONGODB_BASE_URL}${password}@cluster0.nz96pis.mongodb.net/noteApp?appName=Cluster0`;
mongoose.set("strictQuery", false);

// Abrir la conexión a la base de datos
mongoose.connect(url);

// Definiendo esquema (cómo se van a almacenar los objetos de nota en la base de datos)
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// Definiendo modelo
const Note = mongoose.model("Note", noteSchema);

// const note = new Note({ content: 'HTML is easy', important: true })
// const note = new Note({ content: 'CSS is hard', important: false })
// const note = new Note({ content: 'JS is fun', important: true })

// Guardando la nota en la db
// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// Obtener todas los documentos de la colección notes
Note.find({}).then(result => {
  console.log("Notes:")
  result.forEach(note => {
    console.log(`${note.content} - ${note.important}`)
  })
  mongoose.connection.close()
})