require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {
    NODE_ENV
} = require('./config')
const errorHandler = require('./middlerware/error-handler')
const usersRouter = require('./users/users-router')
const authRouter = require("./auth/auth-router");
const vendorsRouter = require("./vendors/vendors-router");
const vendorsInventoryRouter = require('./vendorinventoryitems/vendor-inventory-router')


const app = express()

const morganOption = (NODE_ENV === 'production') ?
    'tiny' :
    'common';

app.use(morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

// app.use(express.static('public'))
//Load user login router
app.use("/api/auth", authRouter);
//Load user registration router
app.use("/api/users", usersRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/vendorinventoryitems", vendorsInventoryRouter)

app.use(errorHandler)

module.exports = app
