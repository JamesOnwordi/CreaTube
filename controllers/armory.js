const express = require("express")
const router = express.Router()
const db = require("../models")
router.use(express.urlencoded({extended:false}))


router.get("/",(req,res)=>{
    res.render("armory/home")
})

// new model
router.get("/new",(req,res)=>{
    res.render("armory/new")
    
})

router.post("/new",(req,res)=>{
    // added
    console.log(req.body)
    // add new model to db
    res.redirect("/armory")
})


router.get("/update",(req,res)=>{
    res.render("armory/update")
    
})

router.post("/update",(req,res)=>{
    // added
    console.log(req.body)
    // add new model to db
    res.redirect("/updates")
})

module.exports = router