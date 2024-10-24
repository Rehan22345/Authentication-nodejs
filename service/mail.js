const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: "rehanpoudel2@gmail.com",
        pass: "phek sqfg vwui dwfr"
    }
});
const sendMail = async(from)=>{
    const mailOptions = {
        from: "rehanpoudel2@gmail.com",
        to: "abhayabikramshahiofficial@gmail.com",
        subject : "Account Creation..",
        text : "User have created account in your websites.."

    }
    try {
        const sendMailResponse = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", sendMailResponse);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = sendMail;