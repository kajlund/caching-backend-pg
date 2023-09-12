import express from 'express'

import { statusCodes } from '../../utils/statuscodes.js'
import { findPlaces, getPlaceById, createPlace, updatePlace, deletePlace } from './place.service.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await findPlaces(req.query)
    res.status(statusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const result = await getPlaceById(id)
    res.status(statusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const result = await createPlace(req.body)
    res.status(statusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const result = await updatePlace(id, req.body)
    res.status(statusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const result = await deletePlace(id)
    res.status(statusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
