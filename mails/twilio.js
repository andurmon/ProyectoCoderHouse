const accountSid = 'ssssssssssssssssssssssssssssssssss';
const authToken = 'tttttttttttttttttttttttttttttttt';

import twilio from 'twilio'

const client = twilio(accountSid, authToken)

export const enviarSMS = async (mensaje,numero) => {
    try {    
        let rta = await client.messages.create({
            body: mensaje,
            from: '+19714071392',
            to: numero
        })
        return rta
    }
    catch(error) {
        return error
    }
}