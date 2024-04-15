import dotenv from "dotenv"
dotenv.config()
import nodemailer from "nodemailer"

let transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:"587",
    secure:false,
    requireTLS:true,
    auth:{
        user:"himanshusekhar836@gmail.com",
        pass:"gdee fnyh taqb mweo"
    }
})

export default transporter

