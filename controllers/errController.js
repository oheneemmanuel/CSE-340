// controllers/errorController.js
const errorController = {}

errorController.triggerError = (req, res, next) => {
  try {
    // Throw a fake error on purpose
    throw new Error("This is an intentional 500 error for testing.")
  } catch (err) {
    next(err) // pass to middleware
  }
}

module.exports = errorController
