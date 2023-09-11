import express from 'express'

import { loginUser, registerUser } from './user.service.js'

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
