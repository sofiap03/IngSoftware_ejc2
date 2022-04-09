const { default: mongoose } = require('mongoose')
const express = require('express')
const sgMail = require('@sendgrid/mail')
const email = require('./src/email')
const { logErrors, errorHandler, boomErrorHandler } = require('./src/handlers/errors.handler')
const app = express()
const routerApi = require('./src/routes')
require('dotenv').config()
const port = 5000 || process.env.PORT;

mongoose
    .connect(process.env.MONGODB_STRING_CONNECTION)
    .then(() => console.log('Success connection'))
    .catch((error) => console.log(error))

//twilio SMS
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

//Postman
app.use(express.json)
app.use(express.urlencoded({extended:false}))

client.messages
  .create({
     body: 'Prueba Twilio, Ingenieria Software II',
     from: '+18644771390',
     to: '+573215172305'
   })
  .then(message => console.log(message.sid));

//WhatsApp
client.messages
  .create({
     body: 'Bienvenidos a la semana IV del ciclo Final',
     from: 'whatsapp:+14155238886',
     to: 'whatsapp:+573215172305'
   })
  .then(message => console.log(`Mensaje enviado ${message.sid}`));


app.listen(port, () => console.log('Active port: ', port))



app.post('/api/email/confirmacion', async(req,res,next)=>{
  try{
    res.json(await email.sendOrder(req.body))
  }catch(err){
    next(err)
  }
})

app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({'message': error.message})
  return
})

function getMessage(){
  const body = 'Mensaje enviado el 8/04/2022 07:01:00 a.m'
  return{
  from: 'sofia.pinuelam@autonoma.edu.co',
  to: 'sofia.pinuelam@autonoma.edu.co',
  subject: 'Prueba SendGrid 02, Ingenieria de software',
  text: body,
  html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
      <div class="container section">
          <label>PRoducto</label>
          <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gerencie.com%2Fhasta-cuando-tengo-plazo-para-devolver-un-articulo-que-compre.html&psig=AOvVaw1L5_E4qZi8XTjLT-TDpxY_&ust=1649540983252000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCMCB3Ji5hfcCFQAAAAAdAAAAABAD">
      </div>

  </body>
  </html>`
  }
}


async function sendEmail(){
  try{
    await sgMail.send(getMessage())
    console.log('Correo enviado')
  }catch(err){
    console.error('No se pudo enviar')
    console.error(err)
    if(err.response) console.error(err.response.body)
  }
}

(async()=>{
  console.log('Enviando correo electronico')
  await sendEmail()
})

/*SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'sopime06@hotmail.com', // Change to your recipient
  from: 'sofia.pinuelam@autonoma.edu.co', // Change to your verified sender
  subject: 'Prueba SendGrid, Ingenieria de software',
  html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <!-- Compiled and minified CSS -->
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <title>Document</title>
  </head>
  <body>
    <!-- Compiled and minified JavaScript -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <div class="row">
      <div class="col">
        <h3>SendGrid</h3>
        <table>
          <thead>
            <tr>
                <th>Name</th>
                <th>Item Name</th>
                <th>Item Price</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Alvin</td>
              <td>Eclair</td>
              <td>$0.87</td>
            </tr>
            <tr>
              <td>Alan</td>
              <td>Jellybean</td>
              <td>$3.76</td>
            </tr>
            <tr>
              <td>Jonathan</td>
              <td>Lollipop</td>
              <td>$7.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  <!-- Compiled and minified JavaScript -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  </body>
  </html>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
*/

/* REQUEST A SOLICITUDES HTTP EN FORMATO JSON */
app.use(express.json())
app.use(logErrors)
app.use(errorHandler)
app.use(boomErrorHandler)
/* permite llamado a los rest */
routerApi(app)
