# 📚 Full Stack Open — Mis notas y ejercicios

> Repositorio de ejercicios del curso [Full Stack Open](https://fullstackopen.com/) de la Universidad de Helsinki.  
> Además de los ejercicios, este README funciona como mi **guía de referencia personal** para construir una aplicación web full stack desde cero.

![Full Stack Open – University of Helsinki](./assets/home.png)

---

> 📝 **Proyecto de referencia:** todos los ejemplos de esta guía pertenecen a una **app de notas** — una aplicación simple que permite crear, leer y eliminar notas.

---

## 🛠️ Stack utilizado

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📕 Recursos

**Documentación oficial**
- [Documentación de React](https://react.dev/)
- [Documentación de Node.js](https://nodejs.org/en/docs/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de Mongoose](https://mongoosejs.com/docs/)
- [Documentación de MongoDB](https://www.mongodb.com/docs/)

**Herramientas útiles**
- [http.cat](https://http.cat/) — referencia visual de códigos de estado HTTP

---

## 📋 Tabla de contenidos

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [Frontend con React](#2-frontend-con-react)
3. [Simulando un backend con json-server](#3-simulando-un-backend-con-json-server)
4. [Backend con Node.js y Express](#4-backend-con-nodejs-y-express)
5. [MongoDB](#5-mongodb)
6. [Conectando frontend y backend](#6-conectando-frontend-y-backend)
7. [Subir la aplicación a internet](#7-subir-la-aplicación-a-internet)
8. [ESLint](#8-eslint)

---

## 1. 🗂️ Estructura del proyecto

La forma más ordenada de organizar una aplicación full stack es separar el frontend y el backend en carpetas independientes dentro del mismo repositorio.

```
notes-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables (Button, Note, Form...)
│   │   ├── pages/             # Vistas/páginas completas (Home, Login...)
│   │   ├── services/          # Lógica de comunicación con la API (axios)
│   │   ├── context/           # Contextos de React (AuthContext...)
│   │   ├── hooks/             # Custom hooks (useNotes, useFetch...)
│   │   ├── assets/            # Imágenes, íconos, fuentes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                   # VITE_API_URL=http://localhost:3001
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── models/                # Modelos de Mongoose (Note.js, User.js...)
│   ├── routes/                # Rutas por recurso (notes.js, users.js...)
│   ├── middleware/            # Middlewares propios (auth.js, errorHandler.js...)
│   ├── controllers/           # Lógica de cada ruta (opcional)
│   ├── index.js               # Punto de entrada del servidor
│   ├── .env                   # MONGODB_URI, JWT_SECRET, PORT
│   └── package.json
│
├── .gitignore
└── README.md
```

> **Nota:** tanto `frontend/.env` como `backend/.env` deben estar en el `.gitignore`. Nunca se commitean.

---

## 2. Frontend con React

El frontend es la parte de la aplicación que ve el usuario. Con React construimos interfaces a partir de **componentes**, que son funciones que devuelven JSX (HTML dentro de JavaScript).

### Crear el proyecto

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

### Componentes

Un componente es una función que recibe `props` y devuelve JSX. La regla principal: si un dato puede cambiar y debe reflejarse en la pantalla, usá `useState`.

```jsx
// components/Note.jsx
const Note = ({ note, onDelete }) => {
  return (
    <li>
      {note.content}
      <button onClick={() => onDelete(note.id)}>Eliminar</button>
    </li>
  )
}

export default Note
```

### Hooks esenciales

Los hooks son funciones especiales de React que permiten usar estado y otras características dentro de componentes funcionales.

| Hook | Para qué sirve |
|---|---|
| `useState` | Estado local del componente |
| `useEffect` | Efectos secundarios (fetch, suscripciones) |
| `useContext` | Compartir estado global sin prop drilling |
| `useRef` | Referencia a un elemento del DOM |

**`useState`** — maneja un valor que puede cambiar. Cada vez que cambia, React vuelve a renderizar el componente.

```jsx
import { useState } from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  const addNote = () => {
    setNotes(notes.concat({ id: Date.now(), content: newNote }))
    setNewNote('')
  }

  return (
    <div>
      <input value={newNote} onChange={e => setNewNote(e.target.value)} />
      <button onClick={addNote}>Agregar</button>
      <ul>
        {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </div>
  )
}
```

**`useEffect`** — ejecuta código como consecuencia de algo: que el componente se monte, que una variable cambie, etc. Se usa mucho para traer datos del backend al cargar la página.

```jsx
import { useState, useEffect } from 'react'
import noteService from './services/noteService'

const App = () => {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    // Esto se ejecuta una sola vez, cuando el componente aparece en pantalla
    noteService.getAll().then(data => setNotes(data))
  }, []) // El array vacío [] significa "solo al montar"

  // ...
}
```

> Si en vez de `[]` ponés una variable dentro del array, el efecto se vuelve a ejecutar cada vez que esa variable cambia: `[userId]`.

---

## 3. Simulando un backend con json-server

Durante el desarrollo del frontend, todavía no tenemos un backend propio. Para no bloquearnos, `json-server` genera una API REST completa a partir de un archivo JSON, sin escribir ningún código de servidor.

```bash
npm install -D json-server
```

Crear un archivo `db.json` en la raíz del proyecto:

```json
{
  "notes": [
    { "id": 1, "content": "HTML es fácil", "important": true },
    { "id": 2, "content": "El navegador solo puede ejecutar JavaScript", "important": false }
  ]
}
```

Agregar el script en `package.json`:

```json
"scripts": {
  "server": "json-server --watch db.json --port 3001"
}
```

```bash
npm run server
```

Con esto, `json-server` expone automáticamente los endpoints `GET`, `POST`, `PUT` y `DELETE` en `http://localhost:3001/notes`. Más adelante, cuando el backend real esté listo, simplemente se cambia la URL y el resto del código no cambia.

### Comunicación con el backend

En una aplicación full stack hay dos partes separadas: el **frontend** (React, corre en el navegador) y el **backend** (Node/Express, corre en un servidor). Para que se comuniquen, el frontend hace **peticiones HTTP** al backend usando `fetch` (nativo del navegador) o `axios` (una librería que simplifica la sintaxis y el manejo de errores).

El backend recibe esa petición, hace lo que tenga que hacer (consultar la base de datos, guardar algo, etc.) y le devuelve una respuesta en formato JSON que el frontend usa para actualizar la pantalla.

```bash
npm install axios
```

Para mantener el código ordenado, las llamadas al backend no van directamente dentro de los componentes, sino en archivos separados dentro de `services/`. Cada archivo agrupa las peticiones de un recurso.

```js
// src/services/noteService.js
import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api/notes' // desarrollo (json-server o backend local)
// const BASE_URL = '/api/notes'                   // producción (mismo servidor que el frontend)

const getAll = () =>
  axios.get(BASE_URL).then(res => res.data)

const create = (newNote) =>
  axios.post(BASE_URL, newNote).then(res => res.data)

const update = (id, updatedNote) =>
  axios.put(`${BASE_URL}/${id}`, updatedNote).then(res => res.data)

const remove = (id) =>
  axios.delete(`${BASE_URL}/${id}`)

export default { getAll, create, update, remove }
```

Y desde el componente, simplemente se importa y se usa:

```jsx
import noteService from './services/noteService'

// Traer todas las notas al montar
useEffect(() => {
  noteService.getAll().then(data => setNotes(data))
}, [])

// Crear una nota nueva
const addNote = () => {
  noteService.create({ content: newNote, important: false })
    .then(savedNote => setNotes(notes.concat(savedNote)))
}
```

Con el frontend funcionando y conectado al servidor simulado, es momento de construir el backend real.

---

## 4. Backend con Node.js y Express

El backend expone una **API REST**: recibe peticiones HTTP del frontend, las procesa y devuelve datos en JSON. Es un programa Node.js independiente que corre en su propio servidor.

### Inicializar el proyecto

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv mongoose
npm install --save-dev nodemon
```

En `package.json`, agregar los scripts:

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### Variables de entorno

Las variables de entorno son valores de configuración que no deben estar hardcodeados en el código ni subidos al repositorio: strings de conexión a la base de datos, claves secretas, puertos, URLs externas, etc.

Se guardan en un archivo `.env` en la raíz del proyecto (que va en el `.gitignore`) y se cargan con la librería `dotenv`:

```bash
# .env
PORT=3001
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/notes
JWT_SECRET=a8f5f167f44f4964e6c998dee8ae7110fad07971d648bfa254bebe3daab1cf59
```

```js
// index.js — debe ser la primera línea antes de cualquier uso de variables de entorno
require('dotenv').config()

const PORT = process.env.PORT        // "3001"
const uri  = process.env.MONGODB_URI // la uri de conexión
```

**¿Qué va en el `.env`?**

| Variable | Para qué |
|---|---|
| `PORT` | Puerto en el que corre el servidor |
| `MONGODB_URI` | String de conexión a la base de datos |
| `JWT_SECRET` | Clave para firmar y verificar tokens de autenticación |
| `VITE_API_URL` | (frontend) URL del backend durante desarrollo |

> Cuando deployás en Render o Railway, estas variables se cargan desde el panel de configuración de la plataforma — el archivo `.env` no se sube ni se necesita en producción.

### Nodemon

Por defecto, cada vez que modificamos el código del backend hay que detener el servidor y volver a ejecutarlo a mano para ver los cambios. **Nodemon** detecta cambios en los archivos y reinicia el servidor automáticamente.

Se instala como dependencia de desarrollo, ya que solo se usa mientras programamos:

```bash
npm install --save-dev nodemon
```

```bash
npm run dev   # usa nodemon — para desarrollo
npm start     # usa node — para producción
```

### Estructura básica de un servidor

```js
// index.js
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

let notes = [
  { id: 1, content: 'HTML es fácil', important: true },
  { id: 2, content: 'El navegador solo puede ejecutar JavaScript', important: false }
]

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes', (req, res) => {
  const note = { id: Date.now(), ...req.body }
  notes = notes.concat(note)
  res.status(201).json(note)
})

app.delete('/api/notes/:id', (req, res) => {
  notes = notes.filter(n => n.id !== Number(req.params.id))
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
```

### Middleware

Un **middleware** es una función que se ejecuta **entre** la petición y la respuesta. Express procesa la petición a través de una cadena de middlewares antes de que llegue a la ruta final, y cada uno decide si pasarle el control al siguiente o cortar la cadena respondiendo directamente.

```js
const miMiddleware = (request, response, next) => {
  // lógica del middleware
  next() // pasa el control al siguiente middleware o a la ruta
}

app.use(miMiddleware)
```

- `request` — la petición entrante (headers, body, params, etc.)
- `response` — lo que se va a devolver
- `next` — función que hay que llamar para que la cadena continúe

Se registran con `app.use(...)` y se ejecutan en el **orden** en que se declaran.

**Middlewares más comunes:**

| Middleware | Para qué sirve |
|---|---|
| `express.json()` | Parsea el body de la petición y lo deja disponible en `request.body` |
| `cors()` | Permite peticiones desde otros orígenes |
| `express.static('dist')` | Sirve el build del frontend como archivos estáticos |
| Middleware de errores | Captura errores y responde de forma centralizada |
| Middleware de autenticación | Verifica un token JWT antes de dejar pasar la petición |

```js
// Middleware de manejo de errores (siempre al final, después de todas las rutas)
// Se reconoce por tener 4 parámetros — Express lo detecta automáticamente
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})
```

### Depuración

Cuando algo no funciona en el backend, hay varias formas de investigar qué está pasando, de más simple a más completa:

**1. `console.log`** — la forma más directa. Imprime el valor de variables, el body de una petición, el resultado de una consulta, etc. Suficiente para la mayoría de los casos.

```js
app.post('/api/notes', (req, res) => {
  console.log('Body recibido:', req.body) // ¿llegó lo que esperaba?
  // ...
})
```

**2. Inspector de Node** — permite usar las DevTools del navegador para depurar el backend como si fuera código de frontend: breakpoints, inspección de variables, call stack, etc.

```bash
node --inspect index.js
# o con nodemon:
nodemon --inspect index.js
```

Luego abrir Chrome y navegar a `chrome://inspect` → clic en **Open dedicated DevTools for Node**.

**3. Debugger integrado de VS Code** — la opción más cómoda si usás VS Code. Crear un archivo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug backend",
      "program": "${workspaceFolder}/backend/index.js",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "console": "integratedTerminal"
    }
  ]
}
```

Con esto, apretando `F5` en VS Code arranca el servidor en modo debug con nodemon, y podés poner breakpoints directamente en el editor.

---

## 5. MongoDB

Hasta ahora los datos del backend se guardaban en una variable (`let notes = [...]`), lo que significa que se pierden cada vez que el servidor se reinicia. Para persistir los datos necesitamos una base de datos.

**MongoDB** es una base de datos **NoSQL orientada a documentos**: en lugar de guardar datos en tablas con filas y columnas como SQL, los guarda en **documentos** con formato similar a JSON. Es flexible, no requiere un schema fijo, y se integra de forma natural con JavaScript.

Para interactuar con MongoDB desde Node.js se usa **Mongoose**, una librería que actúa como ODM (Object Document Mapper): permite definir la estructura de los datos mediante schemas y modelos, y ofrece métodos para hacer consultas de forma sencilla.

### De qué se compone

**Colección** — el equivalente a una tabla en SQL. Agrupa documentos del mismo tipo. Por ejemplo, la colección `notes` contiene todas las notas de la app.

**Documento** — el equivalente a una fila. Es un objeto JSON con los datos de un registro particular:

```json
{
  "_id": "64a1f2e3b5c4d8e9f0a1b2c3",
  "content": "HTML es fácil",
  "important": true
}
```

**Schema** — define la estructura que deben tener los documentos de una colección: qué campos tienen, de qué tipo son, si son obligatorios, valores por defecto, etc.

**Modelo** — es la interfaz que Mongoose genera a partir del schema para interactuar con la colección. A través del modelo se hacen todas las operaciones: crear, leer, actualizar y eliminar documentos.

### MongoDB Atlas

En lugar de instalar MongoDB localmente, se usa **MongoDB Atlas**: una plataforma cloud que ofrece una base de datos MongoDB lista para usar, con plan gratuito incluido.

1. Crear una cuenta en [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crear un **cluster** gratuito (M0)
3. En **Database Access**: crear un usuario con contraseña
4. En **Network Access**: agregar `0.0.0.0/0` para permitir conexiones desde cualquier IP
5. En **Connect → Drivers**: copiar la URI de conexión

La URI tiene esta forma:
```
mongodb+srv://usuario:contraseña@cluster.mongodb.net/notes?retryWrites=true&w=majority
```

Esa URI va en el `.env` como `MONGODB_URI` — nunca hardcodeada en el código.

### Conectar el backend con MongoDB

```bash
npm install mongoose
```

```js
// index.js
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err.message))
```

### Definir el Schema y el Modelo

Los modelos van en archivos separados dentro de la carpeta `models/`.

```js
// models/Note.js
const mongoose = require('mongoose')

// 1. Definir el schema — la estructura del documento
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,   // campo obligatorio
    minlength: 5      // validación: mínimo 5 caracteres
  },
  important: {
    type: Boolean,
    default: false    // si no se envía, se guarda como false
  }
})

// 2. Ajuste opcional: transformar _id (ObjectId) a string "id" al serializar a JSON
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// 3. Crear y exportar el modelo
const Note = mongoose.model('Note', noteSchema)

module.exports = Note
```

### Operaciones CRUD con Mongoose

```js
const Note = require('./models/Note')

// CREATE — guardar una nota nueva
const note = new Note({ content: 'HTML es fácil', important: true })
await note.save()

// READ — traer todas las notas
const notes = await Note.find({})

// READ — traer una sola nota por id
const note = await Note.findById(id)

// UPDATE — actualizar una nota
const updated = await Note.findByIdAndUpdate(
  id,
  { important: true },
  { new: true }          // devuelve el documento actualizado, no el original
)

// DELETE — eliminar una nota
await Note.findByIdAndDelete(id)
```

### Manejo de errores y middleware de errores

Las operaciones de Mongoose pueden fallar por distintas razones: id con formato inválido, validación que no pasa, problema de conexión, etc. En lugar de manejar cada error dentro de cada ruta, se centraliza en un **middleware de errores** al final del `index.js`.

Para pasarle un error al middleware desde una ruta, se usa `next(error)`:

```js
app.get('/api/notes/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) return res.status(404).json({ error: 'nota no encontrada' })
    res.json(note)
  } catch (error) {
    next(error) // pasa el error al middleware de errores
  }
})
```

```js
// Middleware de errores — al final, después de todas las rutas
app.use((error, req, res, next) => {
  // ID con formato inválido para MongoDB
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'id con formato inválido' })
  }

  // Error de validación de Mongoose (campo requerido, minlength, etc.)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  // Error genérico
  res.status(500).json({ error: error.message })
})
```

---

## 6. Conectando frontend y backend

### ¿Qué es CORS y por qué ocurre?

**CORS (Cross-Origin Resource Sharing)** es una política de seguridad del navegador. Cuando el frontend (corriendo en `localhost:5173`) intenta hacer una petición al backend (corriendo en `localhost:3001`), el navegador los considera **orígenes distintos** y bloquea la petición por defecto.

Un **origen** está formado por tres partes: protocolo, host y puerto. Si cualquiera de esas tres partes cambia, el navegador lo considera un origen diferente.

```
http://localhost:5173
  │         │      │
protocolo  host   puerto
```

Por eso `http://localhost:5173` (frontend) y `http://localhost:3001` (backend) son orígenes distintos aunque sea la misma máquina: el puerto no coincide.

El error típico que se ve en la consola es:

```
Access to XMLHttpRequest at 'http://localhost:3001/api/notes'
from origin 'http://localhost:5173' has been blocked by CORS policy.
```

**La solución:** instalar el middleware `cors` en el backend para que acepte peticiones desde otros orígenes.

```bash
npm install cors
```

```js
const cors = require('cors')
app.use(cors()) // Permite peticiones desde cualquier origen
```

Esto ya estaba incluido en la estructura básica del servidor de arriba. Lo importante es entender **por qué está**: sin esa línea, el frontend no puede hablar con el backend durante el desarrollo.

### El proxy de Vite

Hay un problema que aparece después de tener todo funcionando en producción. Cuando el backend sirve el frontend como archivos estáticos (`app.use(express.static('dist'))`), ambos corren en el **mismo origen** — por ejemplo `http://localhost:3001`. Por eso, en el código del frontend, la URL al backend se deja como ruta relativa: `/api/notes`, sin protocolo ni puerto.

El problema aparece cuando volvés a trabajar en el frontend con `npm run dev`. Ahí el frontend corre en `http://localhost:5173`, mientras el backend sigue en `http://localhost:3001`. Son orígenes distintos otra vez, y la ruta `/api/notes` ahora apunta a `localhost:5173/api/notes` — un endpoint que no existe ahí.

La solución es configurar un **proxy** en Vite: le decimos que redirija automáticamente cualquier petición a `/api` hacia `localhost:3001`.

```js
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
}
```

Con esto, el código del frontend puede usar `/api/notes` tanto en desarrollo como en producción, sin cambiar nada entre los dos casos.

---

Una vez que el backend funciona correctamente con el frontend en desarrollo, el siguiente paso es preparar la aplicación para producción.

### Frontend Production Build

```bash
# Dentro de la carpeta frontend/
npm run build
```

Esto genera una carpeta `dist/` con los archivos listos para producción.

### Sirviendo el frontend desde el backend

```js
app.use(express.static('dist'))
```

Con esto, Express sirve el frontend y responde las peticiones a `/api/notes` desde el mismo proceso. Un solo servidor, una sola URL.

> En desarrollo seguimos corriendo los dos servidores por separado. Este paso es solo para producción.

---

## 7. Subir la aplicación a internet

Para publicar la aplicación se usa un **PaaS (Platform as a Service)**. Las más usadas en 2026 con plan gratuito:

| Plataforma | Qué ofrece gratis |
|---|---|
| [Render](https://render.com/) | Web services, deploy desde GitHub |
| [Railway](https://railway.app/) | $5 de crédito mensual, muy simple de configurar |
| [Fly.io](https://fly.io/) | Hasta 3 VMs pequeñas, requiere CLI |

### Deploy en Render (recomendado para empezar)

1. Crear una cuenta en [render.com](https://render.com/) y conectar con GitHub
2. **New → Web Service** → seleccionar el repositorio
3. Configurar:
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. En **Environment Variables**, agregar las variables del `.env`:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=...
   ```
5. Hacer click en **Deploy**. Render redeploya automáticamente con cada push a `main`.

---

## 8. ESLint

A medida que el proyecto crece, es fácil introducir inconsistencias en el código: variables declaradas pero no usadas, comparaciones con `==` en lugar de `===`, estilos distintos entre archivos, etc. **ESLint** es una herramienta que analiza el código estáticamente y señala estos problemas antes de que se conviertan en bugs — sin necesidad de ejecutar el programa.

### Instalación

```bash
# En el backend
npm install --save-dev eslint @eslint/js

# Inicializar la configuración
npx eslint --init
```

El comando `--init` hace algunas preguntas (¿es un proyecto de Node?, ¿usás módulos ES o CommonJS?, etc.) y genera el archivo de configuración automáticamente.

### Configuración básica (`eslint.config.mjs`)

```js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'eqeqeq': 'error',        // obliga a usar === en lugar de ==
      'no-console': 'warn',     // avisa cuando hay console.log (útil en prod)
      'no-unused-vars': 'warn'  // avisa sobre variables declaradas pero no usadas
    }
  }
]
```

### Agregar el script en `package.json`

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js",
  "lint": "eslint ."
}
```

```bash
npm run lint   # analiza todos los archivos del proyecto
```

### ESLint en el frontend (Vite ya lo incluye)

Cuando creás un proyecto con Vite, ESLint ya viene preconfigurado con reglas básicas para React. Podés extenderlo agregando reglas propias en el archivo `eslint.config.js` que Vite genera.

### Integración con VS Code

Instalar la extensión **ESLint** de VS Code para ver los errores subrayados directamente en el editor, sin necesidad de correr `npm run lint` manualmente.

---

## 👤 Autor

Desarrollado con ❤️ por **Juan Bautista Malina**.

- 🌐 [Portfolio](https://juanbautistamalina.github.io/portfolio/)
- 💻 [GitHub](https://github.com/juanbautistamalina)
- 💼 [LinkedIn](https://www.linkedin.com/in/juan-bautista-malina/)