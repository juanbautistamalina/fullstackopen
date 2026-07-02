require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Página Principal - NO se utiliza ya que se está sirviendo el front estático (./dist)
app.get("/", (request, response) => {
  response.send("<h1>Notes App</h1>");
});

// Obtener todos los recursos
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// Obtener un solo recurso
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

// Eliminar un recurso (PENDIENTE)
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Agregar un nuevo recurso
app.post("/api/notes", (request, response) => {
  
  // Obtener la información enviada en el body de la petición
  const body = request.body;

  // Comprobar que el body no se haya enviado vacío
  if (!body || !body.content) {
    return response.status(400).json({
      error: "content is missing",
    });
  }

  // Crear una nueva nota usando el modelo
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  // Guardar la nueva nota en la base de datos
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Definir un middleware para rutas no contempladas
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
