require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// Página Principal - NO se utiliza ya que se está sirviendo el front estático (./dist)
app.get("/", (request, response) => {
  response.send("<h1>Notes App</h1>");
});

// Obtener todos los recursos
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// Obtener un solo recurso
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Eliminar un recurso
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Actualizar un recurso
app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// Agregar un nuevo recurso
app.post("/api/notes", (request, response) => {

  // Obtener la información enviada en el body de la petición
  const body = request.body;

  // Comprobar que el body no se haya enviado vacío
  if (!body.content) {
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

// Middleware de rutas no contempladas
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Middleware de manejo de errores
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// Este debe ser el último middleware cargado
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
