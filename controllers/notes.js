const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

//ROUTE 1: GET ALL DATA
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })

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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

//ROUTE 3: MAKE NEW NOTE OBJECT
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)


  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  try {
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
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