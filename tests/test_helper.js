const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'Kalja on itse asiassa hyvää',
    important: false,
  },
  {
    content: 'Liverpool voittaa valioliigan kaudella 23/24',
    important: true,
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  //await note.save()
  //await note.remove()
  const savedNote = await note.save()
  await Note.deleteOne({ _id: savedNote._id })

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb
}