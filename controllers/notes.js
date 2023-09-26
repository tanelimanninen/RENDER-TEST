const notesRouter = require('express').Router()
const Note = require('../models/note')

//ROUTE 1: GET ALL DATA
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

//ROUTE 2: GET SINGLE DATA OBJECT
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  //CONDITION 1: IF NOTE EXISTS
  if (note) {
    response.json(note)
  }
  //CONDITION 2: IF NOTE DOESN'T EXIST
  else {
    response.status(404).end()
  }
})

//ROUTE 3: ADD NEW DATA
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  const savedNote = await note.save()
  response.json(savedNote)
})

//ROUTE 4: DELETE SINGLE DATA OBJECT
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//ROUTE 6: UPDATE EXISTING SINGLE DATA
notesRouter.put('/:id', (request, response, next) => {
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

module.exports = notesRouter