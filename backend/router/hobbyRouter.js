const express = require('express')
const router = express.Router()
const checkObjectId = require('../middleware/checkObjectId.js')
const {
  createHobby,
  listHobby,
  updateHobby,
  deleteHobby,
  queryWiki,
} = require('../controllers/hobbyController.js')

router.route('/').post(createHobby).get(listHobby)
router
  .route('/:id')
  .patch(checkObjectId('id'), updateHobby)
  .delete(checkObjectId('id'), deleteHobby)

router.route('/wiki').get(queryWiki)

module.exports = router
