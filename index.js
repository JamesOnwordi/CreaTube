const express = require("express")
const axios = require("axios")
const expressEjsLayouts = require("express-ejs-layouts")
const db = require("./models")
const app = express()
const PORT = 3000
app.set("view engine","ejs")
app.use(expressEjsLayouts)

app.get("/",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{
        // console.log(response)
        // res.render("home",{guns:response.data.data})
        res.send(response.data.data)
    })
})
app.get("/1",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{
        // console.log(response)
        res.render("show",{guns:response.data.data})
    })
})


app.listen(PORT,()=>{
    console.log("Listening to the sweet sound of port:"+ PORT)
})