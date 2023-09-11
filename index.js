const express = require('express')
const app = express()
const cors = require('cors')


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

app.use(cors())
app.use(express.json())
app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },

  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//ROUTE 1: GET SERVER ROOT
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//ROUTE 2: GET JSON DATA ROOT
app.get('/api/notes', (req, res) => {
  res.json(notes)
})

//ROUTE 3: GET SINGLE JSON DATA OBJECT
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log(id)
  const note = notes.find(note => note.id === id)
  //console.log(note)

  if (note) {
     response.json(note)
  } else {
    response.status(404).end()
  }
    
})

//ROUTE 4: DELETE SINGLE JSON DATA OBJECT
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//ROUTE 5: ADD NEW DATA
app.post('/api/notes', (request, response) => {
  const body = request.body
  //console.log(note)

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})


app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
