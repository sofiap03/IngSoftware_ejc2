const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

function sendEmailConfirmationHTML(customerName, orderNro){
  return `<!DOCTYPE html>
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

function getMessage(emailParams){
  return{
    from:'sofia.pinuelam@autonoma.edu.co',
    to:'sofia.pinuelam@autonoma.edu.co',
    subject:'Confirmación de orden',
    text: `Hola ${emailParams.customerName}. Te enviamos la imagen del producto comprado
    y la factura con número ${emailParams.orderNro}. Gracias por tu compra`,
    html: sendEmailConfirmationHTML(emailParams.customerName, emailParams.orderNro)

  }
}

async function sendOrder(emailParams){
  try{
    await sgMail.send(getMessage(emailParams))
    return {message: 'Confirmación de compra'}
  }catch(err){
    const message = 'No se pudo enviar la orden de compra. Valide los errores'
    console.error(message)
    console.error(err)
    if(err.response) console.error(err.response.body)
    return {message}
  }
}

module.exports={
  sendOrder
}