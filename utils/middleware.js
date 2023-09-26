const logger = require('./logger')

//MIDDLEWARE 1: LOG INFO ABOUT REQUESTS COMING TO THE SERVER
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

//MIDDLEWARE 2: SHOW MESSAGE IF TRYING TO GET WRONG ID
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//MIDDLEWARE 3: INFORM USER WHEN ID DOESN'T EXIST OR NEW NOTE HAS VALIDATION ERRORS
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  logger.error(error.name)

  //CONDITION 1: IF GIVEN ID CAN'T BE FOUND
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  //CONDITION 2: IF NEW NOTE VALIDATION HAS ERRORS
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}