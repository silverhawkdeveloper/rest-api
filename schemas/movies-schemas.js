const z = require('zod') // Validaciones de los tipos de datos

const anio = new Date().getFullYear()

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El título de la película debe ser un string.',
    required_error: 'Se requiere el título de la película.'
  }),
  year: z.number().int().min(1900).max(anio),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'El póster debe ser una URL válida.'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Se requiere el género de la película.',
      invalid_type_error: 'El género de la película debe ser un Array de enum Genre'
    }
  ),
  rate: z.number().min(0).max(10).default(3)
})

function validacionMovies (object) {
  return movieSchema.safeParse(object)
}

function validacionParcialMovies (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = { validacionMovies, validacionParcialMovies }
