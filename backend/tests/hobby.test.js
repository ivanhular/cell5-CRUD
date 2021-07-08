const request = require('supertest')
const app = require('../app')
const Hobby = require('../models/hobbyModel')
const { setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase, 20000)

test('should list hobbies', async () => {
  const response = await request(app).get('/api/hobbies').expect(200)
  const hobbies = await Hobby.find({})
  //   console.log(response.body.data)
  //   console.log(hobbies)
  // expect(task).not.toBeNull()
  expect(response.body.data.length).toEqual(hobbies.length)
})

test('should create a hobby', async () => {
  const response = await request(app)
    .post('/api/hobbies')
    .send({ title: 'chess' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)

  expect(response.body.data.title).toBe('chess')
})

test('should update a hobby', async () => {
  const hobby = await Hobby.findOne({ title: 'basketball' })
  const response = await request(app)
    .patch(`/api/hobbies/${hobby._id}`)
    .send({ title: 'tennis' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  expect(response.body.data._id).toBe(hobby._id.toString())
  expect(response.body.data.title).toBe('tennis')
})

test('should delete a hobby', async () => {
  const hobby = await Hobby.findOne({ title: 'basketball' })
  const response = await request(app)
    .delete(`/api/hobbies/${hobby._id}`)
    .expect('Content-Type', /json/)
    .expect(200)
  const hobbyExist = await Hobby.findById(response.body.data._id)
  expect(hobbyExist).toBeNull()
})
