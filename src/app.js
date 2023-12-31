import express from 'express'
import cors from 'cors'

import db from './db/db.js'
import errorHandler from './middleware/error.handler.js'
import notFoundHandler from './middleware/404.handler.js'
import placeRouter from './api/places/place.router.js'
import userRouter from './api/users/user.router.js'

const app = express()

// Middleware to handle incoming JSON payloads
app.use(express.json())
// Middleware for url encoding
app.use(express.urlencoded({ extended: true }))
// Middleware for handling CORS policy
app.use(cors())

// Helper endpoints for service check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Service running OK' })
})

app.get('/ping', (req, res) => {
  res.status(200).send('Pong')
})

// Route handlers
app.use('/api/v1/places', placeRouter)
app.use('/api/v1/users', userRouter)

// 404 Handler
app.use(notFoundHandler)
// Error Handler
app.use(errorHandler)

// Connect to DB
db.connect()

export default app
