import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();



async function sendMail(to,subject,text){
    try {
        const transporter = mailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL,
                pass : process.env.PASS
            }
        })
        await transporter.sendMail({
            from : process.env.EMAIL,
            to,
            subject,
            text
        })
        console.log("Mail sent successfully")
    } catch (error) {
        console.log(error)
    }
}

export default sendMail;