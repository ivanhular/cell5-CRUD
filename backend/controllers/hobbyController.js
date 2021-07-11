const asyncHandler = require('express-async-handler')
const axios = require('axios')
const Hobby = require('../models/hobbyModel.js')

// @desc    list all hobby
// @route   GET /api/hobbies
// @access  Public
// @params  sort
const listHobby = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $text: {
          $search: req.query.keyword,
        },
      }
    : {}

  const hobbies = await Hobby.find({
    ...keyword,
  })

  if (req.query.sort === 'title') {
    return res.send({
      data: hobbies.sort((a, b) => {
        if (a.title.toLowerCase() === b.title.toLowerCase()) return 0
        return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1
      }),
    })
  }

  if (req.query.sort === 'description') {
    return res.send({
      data: hobbies.sort((a, b) => {
        if (a.description.toLowerCase() === b.description.toLowerCase())
          return 0
        return a.description.toLowerCase() < b.description.toLowerCase()
          ? -1
          : 1
      }),
    })
  }

  res.send({ data: hobbies })
})

// @desc    create a hobby
// @route   POST /api/hobbies
// @access  Public
const createHobby = asyncHandler(async (req, res) => {
  const hobby = new Hobby(req.body)

  const hobbyExist = await Hobby.findOne({ title: req.body.title })

  if (hobbyExist) {
    res.status(400)
    throw new Error('Hobby already exists')
  }

  await hobby.save()

  return res.status(201).send({ data: hobby })
})

// @desc    update a hobby
// @route   PATCH /api/hobbies
// @access  Public
// @params  id
const updateHobby = asyncHandler(async (req, res) => {
  const hobby = await Hobby.findById(req.params.id)
  const allowedUpdates = Object.keys(Hobby.schema.paths)
  const updates = Object.keys(req.body)
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  )
  const filterInvalidUpdate = updates.filter(
    (key) => !allowedUpdates.includes(key)
  )

  if (!hobby) {
    throw new Error('No Hobby found')
  }

  if (!isValidUpdate) {
    throw new Error(
      `Invalid field${
        filterInvalidUpdate.length > 1 ? `'s` : ``
      }: ${filterInvalidUpdate.join(', ')}`
    )
  }

  updates.forEach((update) => (hobby[update] = req.body[update]))

  await hobby.save()

  res.send({ data: hobby })
})

// @desc    delete a hobby
// @route   DELETE /api/hobbies
// @access  Public
// @params  id
const deleteHobby = asyncHandler(async (req, res) => {
  const hobby = await Hobby.findByIdAndDelete(req.params.id)

  res.send({ data: hobby })
})

// @desc    Hobby Description from Wiki
// @route   GET /api/hobbies/wiki?search=test
// @access  Public
// @params  search
const queryWiki = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${req.query.search}&prop=extracts&exintro=1&format=json`
  )
  if (Number(Object.keys(data.query.pages)[0]) !== -1) {
    return res.send({
      data: data.query.pages[Object.keys(data.query.pages)[0]]?.extract,
    })
  } else {
    throw new Error('No result Found!')
  }

  // console.log(data.query.pages[Object.keys(data.query.pages)[0]]?.extract)
})

module.exports = { createHobby, listHobby, updateHobby, deleteHobby, queryWiki }
