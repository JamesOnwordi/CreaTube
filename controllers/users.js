const express = require('express')
const router = express.Router()
const db = require('../models')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios =require("axios")


router.use("/armory",require("./armory"))
router.use("/video",require("./video"))
router.use("/images",require("./images"))
router.use("/favorite",require("./favorite"))

// GET /users/new -- render a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

router.get("/",(req,res)=>{
    const url = "https://valorant-api.com/v1/weapons"

    axios.get(url)
    .then(response=>{
        // console.log(response)
        // res.send(response.data.data)
        res.render("users/profile",{armories:response.data.data})
        
    })
    // console.log('the currently logged in user is:', res.locals.user)
})

// POST /users -- create a new user in the db
router.post('/', async (req, res) => {
    try {
        // has the password from the req.body
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)        
        // create a new user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }, 
            defaults: {
                password: hashedPassword
            }
        })

        // if the user was found...send them to the login form
        console.log('created is:',  created)
        if (!created) {
            console.log('user exists already')
            res.redirect('/users/login?message=Please log into your account to continue.')
        } else {
            // store that new user's id as a cookie in the browser
            const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            // redirect to the homepage
            res.redirect('/users/profile')
        }

    } catch(err) {
        console.log(err,'1')
        res.send('server error')
    }
})

//http://127.0.0.1:3000/users/login?message=Incorrect%20username%20or%20password
// GET /users/login -- show a login form to the user
router.get('/login', (req, res) => {
    console.log(req.query)
    res.render('users/login.ejs', {
        // if the req.query.message exists, pass it is as the message, otherwise pass in null
        // ternary operator
        // condition ? expression if truthy : expression if falsy
        message: req.query.message ? req.query.message : null
    })
})

// POST /users/login -- accept a payload of form data and use it log a user in 
router.post('/login', async (req, res) => {
    try {
        // look up the user in the db using the supplied email
        const user = await db.user.findOne({ 
            where: {
                email: req.body.email
            } 
        })
        const noLoginMessage = 'Incorrect username or password'

        // if the user is not found -- send the user back to the login form
        if (!user) {
            console.log('user not found')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found but has given the wrong password -- send them back to the login form
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            console.log('wrong password')
            res.redirect('/users/login?message=' + noLoginMessage)
        // if the user is found and the supplied password matches what is in the database -- log them in
        } else {
            const encryptedUserId = crypto.AES.encrypt(user.id.toString(), process.env.ENC_SECRET)
            const encryptedUserIdString = encryptedUserId.toString()
            res.cookie('userId', encryptedUserIdString)
            res.redirect('/users/profile')
        }
    } catch(err) {
        console.log(err)
        res.send('server error')
    }
})

// GET /users/logout -- log out a user by clearing the stored cookie
router.get('/logout', (req, res) => {
    // clear the cookie
    res.clearCookie('userId')
    // redirect to the homepage
    res.redirect('/')
})

// Route to leave a note profile page
router.post('/comment',async (req,res)=>{
    const note = await db.note.create({
        note:req.body.note,
        userId:res.locals.user.id
    })
    res.redirect("/")
})

// Route to profiles page
router.get('/profile', (req, res) => {
    // if the user is not logged ... we need to redirect to the login form
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource.')
    // otherwise, show them their profile
    } else {
            const url = `https://valorant-api.com/v1/weapons/skinchromas`
    
            axios.get(url)
             .then(response=>{
                let store =[]
                    response.data.data.forEach(chroma=>{  
                        // console.log("CHROMA",chroma)
                            if(chroma.displayIcon){  
                                store.push({
                                    uuid:chroma.uuid,  
                                    displayName:chroma.displayName,             
                                    swatch:chroma.swatch,    
                                    displayIcon:chroma.displayIcon  
                                })     
                            }else if(chroma.fullRender){
                                store.push({
                                    uuid:chroma.uuid,
                                    displayName:chroma.displayName,            
                                    swatch:chroma.swatch,    
                                    displayIcon:chroma.fullRender
                                })
                                }
                    }) 
    
                 res.render("armory/detail",{armory:response.data.data,images:store})
            

        res.render('users/profile.ejs', {
            user: res.locals.user,images:store
        })
    }).catch(err=>{
                console.log(err)
             })
    }
})

module.exports = router