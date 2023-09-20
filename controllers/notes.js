const notesRouter = require('express').Router()
const Note = require('../models/note')

//ROUTE 1: GET ALL DATA
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//ROUTE 2: GET SINGLE DATA OBJECT
notesRouter.get('/:id', (request, response, next) => {
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

//ROUTE 3: ADD NEW DATA
notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

//ROUTE 4: DELETE SINGLE DATA OBJECT
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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