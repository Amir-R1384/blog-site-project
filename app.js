// Loading our env files, if in development
if (process.env.NODE_ENV !== "production") require("dotenv").config()

// Dependecies
const express = require("express")
const path = require("path")
const fs = require("fs")
const expressEjsLayouts = require("express-ejs-layouts")
const methodOverride = require("method-override")

// Initializing our app
const app = express()

// Setting up our templating engine
app.set("layout", path.join(__dirname, "views/layouts/layout"))
app.set("view engine", "ejs")
app.use(expressEjsLayouts)

// Setting up our middlewears
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

// setting up the routers
const blogRouter = require(path.join(__dirname, "routes/blog"))

// blog route
app.use("/blog", blogRouter)

// index route
app.get('/', (req, res) => {
    try {
        fs.readFile(path.join(__dirname, "database/blogs.json"), (err, raw) => {
            if (err) {
                console.error(err)
                res.status(500).end()
            }
            const blogs = JSON.parse(raw)
            res.render("index", {blogs})
        })

    } catch(error) {
        console.error(error)
        res.render("error", {error})
    }
})

// listening for requests
app.listen(process.env.PORT, () => console.log("server is live"))