require('dotenv').config()
const express = require("express")
const axios = require("axios")
const expressEjsLayouts = require("express-ejs-layouts")
const cookieParser = require('cookie-parser')
const db = require("./models")
const crypto = require('crypto-js')
const app = express()
const PORT = process.env.PORT || 3000
app.set("view engine","ejs")
app.use(expressEjsLayouts)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// our custom auth middleware
app.use(async (req, res, next) => {
    // console.log('hello from a middleware 👋')
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        // decrypt the user id before we look up the user in the db
        const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
        // look up the user in the db
        const user = await db.user.findByPk(decryptedIdString)
        // mount the user on the res.locals
        res.locals.user = user
    // if there is no cookie -- set the user to be null in the res.locals
    } else {
        res.locals.user = null
    }
    // move on to the next route or middleware in the chain
    next()
})

app.get("/",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{
        // console.log(response)
        res.render("home",{guns:response.data.data})
        res.send()
    })
    console.log('the currently logged in user is:', res.locals.user)
})

// Controllers
app.use("/guns",require("./controllers/guns"))
app.use("/users",require("./controllers/users"))


app.listen(PORT,()=>{
    console.log("Listening to the sweet sound of port:"+ PORT)
})