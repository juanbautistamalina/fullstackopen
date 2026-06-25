const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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

// Página Principal
app.get("/", (request, response) => {
  response.send("<h1>Notes App</h1>");
});

// Obtener Todos los recursos
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// Obtener un solo recurso
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Eliminar un recurso
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

  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  const newNote = {
    id: maxId + 1,
    content: body.content,
    important: typeof body.important !== "undefined" ? note.important : false,
  };

  // actualizar la lista de notas del backend con la nueva nota
  notes = [...notes, newNote];
  response.status(201).json(newNote);
});

// Definir un middleware para rutas no contempladas
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
