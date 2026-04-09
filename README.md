# 📚 Full Stack Open — Mis notas y ejercicios

> Repositorio de ejercicios del curso [Full Stack Open](https://fullstackopen.com/) de la Universidad de Helsinki.  
> Además de los ejercicios, este README funciona como mi **guía de referencia personal** para construir una aplicación web full stack desde cero.

---

![Full Stack Open – University of Helsinki](./assets/home.png)

---

## 📋 Tabla de contenidos

1. [Estructura del proyecto](#️-estructura-del-proyecto)
2. [Frontend con React](#2-frontend-con-react)
3. [Backend con Node.js y Express](#3-backend-con-nodejs-y-express)

---

## 🗂️ Estructura del proyecto

La forma más ordenada de organizar una aplicación full stack es separar el frontend y el backend en carpetas independientes dentro del mismo repositorio.

```
my-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables (Button, Card, Modal...)
│   │   ├── pages/             # Vistas/páginas completas (Home, Login, Dashboard...)
│   │   ├── services/          # Lógica de comunicación con la API (axios)
│   │   ├── context/           # Contextos de React (AuthContext, ThemeContext...)
│   │   ├── hooks/             # Custom hooks (useAuth, useFetch...)
│   │   ├── assets/            # Imágenes, íconos, fuentes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                   # VITE_API_URL=http://localhost:3001
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # Modelos de la base de datos
│   ├── routes/                # Rutas por recurso (books.js, users.js...)
│   ├── middleware/            # Middlewares propios (auth.js, errorHandler.js...)
│   ├── controllers/           # Lógica de cada ruta (opcional, para mantener las rutas limpias)
│   ├── index.js               # Punto de entrada del servidor
│   ├── .env                   # DATABASE_URL, JWT_SECRET, PORT
│   └── package.json
│
├── .gitignore
└── README.md
```

> **Nota:** tanto `frontend/.env` como `backend/.env` deben estar en el `.gitignore`. Nunca se commitean.

### ¿Qué va en cada carpeta del frontend?

| Carpeta | Qué contiene |
|---|---|
| `components/` | Piezas de UI reutilizables que no son una página completa |
| `pages/` | Un componente por cada ruta de la app (lo que renderiza React Router) |
| `services/` | Funciones que llaman a la API, por ejemplo `bookService.getAll()` |
| `context/` | Estado global compartido entre componentes sin prop drilling |
| `hooks/` | Lógica reutilizable que usa hooks de React |

---

## 2. Frontend con React

El frontend es la parte de la aplicación que ve el usuario. Con React construimos interfaces a partir de **componentes**, que son funciones que devuelven JSX (HTML dentro de JavaScript).

### Crear el proyecto

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```
---

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

const LightSwitch = () => {
  const [isOn, setIsOn] = useState(false) // false es el valor inicial

  return (
    <button onClick={() => setIsOn(!isOn)}>
      La luz está {isOn ? 'encendida' : 'apagada'}
    </button>
  )
}
```

**`useEffect`** — ejecuta código como consecuencia de algo: que el componente se monte, que una variable cambie, etc. Se usa mucho para traer datos del backend al cargar la página.

```jsx
import { useState, useEffect } from 'react'

const BookList = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    // Esto se ejecuta una sola vez, cuando el componente aparece en pantalla
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
  }, []) // El array vacío [] significa "solo al montar"

  return (
    <ul>
      {books.map(book => <li key={book.id}>{book.title}</li>)}
    </ul>
  )
}
```

> Si en vez de `[]` ponés una variable dentro del array, el efecto se vuelve a ejecutar cada vez que esa variable cambia.

---

### Simular un backend con json-server

Antes de tener un backend real, `json-server` permite simular una API REST completa a partir de un archivo JSON. Es útil para desarrollar y testear el frontend de forma independiente, sin necesidad de escribir ningún código de servidor.

```bash
npm install -D json-server
```

Crear un archivo `db.json` en la raíz del proyecto:

```json
{
  "books": [
    { "id": 1, "title": "Dune", "author": "Herbert" },
    { "id": 2, "title": "1984", "author": "Orwell" }
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

Con esto, `json-server` expone automáticamente los endpoints `GET`, `POST`, `PUT` y `DELETE` en `http://localhost:3001/books`, sin escribir una sola línea de backend. El `bookService.js` de más abajo funciona igual contra este servidor simulado que contra uno real.

### Comunicación con el backend

En una aplicación full stack hay dos partes separadas: el **frontend** (React, corre en el navegador) y el **backend** (Node/Express, corre en un servidor). Para que se comuniquen, el frontend hace **peticiones HTTP** al backend usando `fetch` (nativo del navegador) o `axios` (una librería que simplifica la sintaxis y el manejo de errores).

El backend recibe esa petición, hace lo que tenga que hacer (consultar la base de datos, guardar algo, etc.) y le devuelve una respuesta en formato JSON que el frontend puede usar para actualizar la pantalla.

```bash
npm install axios
```

Para mantener el código ordenado, las llamadas al backend no se hacen directamente dentro de los componentes, sino en archivos separados dentro de la carpeta `services/`. Cada archivo agrupa las peticiones de un recurso en particular.

```js
// src/services/bookService.js
import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api/books' // desarrollo (json-server o backend local)
// const BASE_URL = '/api/books'                   // producción (mismo servidor que el frontend)

const getAll = () =>
  axios.get(BASE_URL).then(res => res.data)

const create = (newBook) =>
  axios.post(BASE_URL, newBook).then(res => res.data)

const update = (id, updatedBook) =>
  axios.put(`${BASE_URL}/${id}`, updatedBook).then(res => res.data)

const remove = (id) =>
  axios.delete(`${BASE_URL}/${id}`)

export default { getAll, create, update, remove }
```

Y desde el componente, simplemente se importa y se usa:

```jsx
import bookService from '../services/bookService'

useEffect(() => {
  bookService.getAll().then(data => setBooks(data))
}, [])
```



---

## 3. Backend con Node.js y Express

El backend expone una **API REST**: recibe peticiones HTTP del frontend, las procesa y devuelve datos (generalmente en JSON).

### Inicializar el proyecto

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm install --save-dev nodemon
```

En `package.json`, agregá el script de desarrollo:

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

### Estructura básica de un servidor

```js
// index.js
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json()) // Parsea el body de las peticiones como JSON

// Rutas
app.get('/api/books', (req, res) => {
  res.json({ message: 'Lista de libros' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
```

### Organización de rutas con Router

Separar las rutas en archivos propios mantiene el código ordenado.

```js
// routes/books.js
const router = require('express').Router()

router.get('/', (req, res) => { /* ... */ })
router.post('/', (req, res) => { /* ... */ })
router.put('/:id', (req, res) => { /* ... */ })
router.delete('/:id', (req, res) => { /* ... */ })

module.exports = router
```

```js
// index.js
const booksRouter = require('./routes/books')
app.use('/api/books', booksRouter)
```

### Middleware

Un middleware es una función que se ejecuta **entre** la petición y la respuesta. Se usa para logging, autenticación, manejo de errores, etc.

```js
// Middleware de manejo de errores (siempre al final)
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})
```

---

## 🛠️ Stack utilizado

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## 👤 Autor

Desarrollado con ❤️ por **Juan Bautista Malina**.

- 🌐 [Portfolio](https://juanbautistamalina.github.io/portfolio/)
- 💻 [GitHub](https://github.com/juanbautistamalina)
- 💼 [LinkedIn](https://www.linkedin.com/in/juan-bautista-malina/)