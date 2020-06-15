const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const authenticate = require('../auth/restricted-middleware.js')
const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')
const server = express()


const sessionConfig = {
  name: 'authsess',
  secret: 'sourgoatmilk',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore(
    {
      knex: require("../data/dbConfig.js"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60
    }
  )
}


server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session(sessionConfig))
server.use('/api/auth', authRouter)
server.use('/api/users', authenticate, usersRouter)

module.exports = server