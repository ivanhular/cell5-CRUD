const mongoose = require('mongoose')
const Hobby = require('../../models/hobbyModel')

const hobbyOneId = new mongoose.Types.ObjectId()

const hobbyOne = {
  _id: hobbyOneId,
  title: 'basketball',
}

const setUpDatabase = async () => {
  try {
    await Hobby.deleteMany()
    const hobby1 = new Hobby(hobbyOne)
    await hobby1.save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = { hobbyOne, setUpDatabase }
