import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function getTemplate(subject, content) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #4F46E5; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GetFurniture</h1>
        </div>
        <div class="content">
            <h2 style="color: #111827; margin-top: 0;">${subject}</h2>
            <div style="font-size: 16px; color: #4b5563;">
                ${content}
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} GetFurniture. All rights reserved.</p>
            <p>123 Furniture Street, Design City, DC 56789</p>
        </div>
    </div>
</body>
</html>
    `;
}

async function sendMail(to, subject, text, isHtml = false) {
    try {
        const transporter = mailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.EMAIL,
                pass : process.env.PASS
            }
        });

        const mailOptions = {
            from : process.env.EMAIL,
            to,
            subject,
        };

        if (isHtml) {
            mailOptions.html = getTemplate(subject, text);
        } else {
            mailOptions.text = text;
        }

        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully")
    } catch (error) {
        console.log(error)
    }
}

export default sendMail;