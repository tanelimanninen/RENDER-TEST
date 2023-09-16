require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')


//MIDDLEWARE 1: LOG INFO ABOUT REQUESTS COMING TO THE SERVER
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//MIDDLEWARE 2: SHOW MESSAGE IF ERROR HAPPENS
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//MIDDLEWARE 3: INFORM USER WHEN ID DOESN'T EXIST
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)


//ROUTE 1: GET SERVER ROOT
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//ROUTE 2: GET JSON DATA ROOT
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//ROUTE 3: GET SINGLE JSON DATA OBJECT
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    //CONDITION 1: IF NOTE EXISTS
    if (note) {
      response.json(note)
    } 
    //CONDITION 2: IF NOTE DOESN'T EXIST
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

//ROUTE 4: DELETE SINGLE JSON DATA OBJECT
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

//ROUTE 5: ADD NEW DATA
app.post('/api/notes', (request, response) => {
  const body = request.body
  //console.log(note)

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

//ROUTE 6: UPDATE EXISTING DATA
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


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
