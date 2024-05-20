const express = require('express')
const crypto = require('node:crypto') // Creación de ID
const cors = require('cors')

const movies = require('./movies.json')
const { validacionMovies, validacionParcialMovies } = require('./schemas/movies-schemas')

// REST API -> Arquitectura de software

const puertoDeseado = process.env.PORT ?? 3000
const app = express()
app.use(express.json())
app.disable('x-powered-by')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:3000'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

// Recuperar todas las peliculas o todas las peliculas de un genero
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filtroGenero = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.status(200).json(filtroGenero)
  }
  res.status(200).json(movies)
})

// Recuperar una pelicula por id
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    return res.status(200).json(movie)
  } else {
    res.status(404).json({ mensaje: 'Movie not found' })
  }
})

// Crear una película
app.post('/movies', (req, res) => {
  const resultado = validacionMovies(req.body)
  if (resultado.error) {
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }

  const newMovies = {
    id: crypto.randomUUID(),
    ...resultado.data
  }
  movies.push(newMovies)
  res.status(201).json(newMovies)
})

// Actualizar una película
app.patch('/movies/:id', (req, res) => {
  const resultado = validacionParcialMovies(req.body)
  if (!resultado.success) {
    return res.status(400).json({ error: JSON.parse(resultado.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...resultado.data
  }
  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

// Borrar una película
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Película eliminada' })
})

app.listen(puertoDeseado, () => {
  console.log(`Servidor en el puerto http://localhost:${puertoDeseado}`)
})
