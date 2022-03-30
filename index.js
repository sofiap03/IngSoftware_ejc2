const { default: mongoose } = require('mongoose')
const express = require('express')
const { logErrors, errorHandler, boomErrorHandler } = require('./src/handlers/errors.handler')
const app = express()
const routerApi = require('./src/routes')
require('dotenv').config()
const port = process.env.PORT

app.listen(port, () => console.log('Active port: ', port))

mongoose
    .connect(process.env.MONGODB_STRING_CONNECTION)
    .then(() => console.log('Success connection'))
    .catch((error) => console.log(error))

/* REQUEST A SOLICITUDES HTTP EN FORMATO JSON */
app.use(express.json())
app.use(logErrors)
app.use(errorHandler)
app.use(boomErrorHandler)
/* permite llamado a los rest */
routerApi(app)
