const mongoose = require('mongoose')

const hobbySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

hobbySchema.index({ '$**': 'text' })

const Hobby = mongoose.model('Hobby', hobbySchema)

module.exports = Hobby
