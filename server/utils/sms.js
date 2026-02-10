import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

async function sendSms(to, body) {
  try {
    const client = twilio(process.env.SID, process.env.AUTHTOKEN);
    await client.messages.create({
      body,
      from: process.env.PHONE,
      to,
    });
    console.log("SMS sent successfully");
  } catch (error) {
    console.log(error);
  }
}
export default sendSms;
