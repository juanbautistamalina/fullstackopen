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

### Simular un backend con json-server

Antes de tener un backend real, `json-server` permite simular una API REST completa a partir de un archivo JSON. Útil para desarrollar y testear el frontend de forma independiente.

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

Con esto, `json-server` expone automáticamente los endpoints `GET`, `POST`, `PUT` y `DELETE` en `http://localhost:3001/books`, sin escribir una sola línea de backend.

---

### Componentes

Un componente es una función que recibe `props` y devuelve JSX. La regla principal: si un dato puede cambiar y debe reflejarse en la pantalla, usá `useState`.

```jsx
// Componente con props y estado local
import { useState } from 'react'

const Counter = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue)

  return (
    <div>
      <p>Valor: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  )
}

export default Counter
```

### Hooks esenciales

| Hook | Para qué sirve |
|---|---|
| `useState` | Estado local del componente |
| `useEffect` | Efectos secundarios (fetch, suscripciones) |
| `useContext` | Compartir estado global sin prop drilling |
| `useRef` | Referencia a un elemento del DOM |

```jsx
// useEffect para traer datos al montar el componente
useEffect(() => {
  fetch('/api/items')
    .then(res => res.json())
    .then(data => setItems(data))
}, []) // [] = solo se ejecuta una vez, al montar
```

### Comunicación con el backend

Usá `axios` o `fetch` para hacer peticiones HTTP al backend.

```bash
npm install axios
```

```jsx
import axios from 'axios'

// GET
const { data } = await axios.get('/api/books')

// POST
const { data } = await axios.post('/api/books', { title: 'Dune', author: 'Herbert' })

// PUT
await axios.put(`/api/books/${id}`, updatedBook)

// DELETE
await axios.delete(`/api/books/${id}`)
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