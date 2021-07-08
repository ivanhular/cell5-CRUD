const express = require('express')
// const dotenv = require( 'dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./db/db.js')
const hobbyRoutes = require('./router/hobbyRouter.js')
const { errorHandler } = require('./middleware/errorMiddleware')
// dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(cookieParser())
app.use(express.json())

app.use('/api/hobbies', hobbyRoutes)

app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

module.exports = app
