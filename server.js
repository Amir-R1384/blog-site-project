if (process.env.NODE_ENV !== "production") require("dotenv").config()

const express = require("express")
const path = require("path")

const app = express()


app.set("view engine", "ejs")
app.use(express.static("src"))


app.get('/', (req, res) => {
    try {
        res.render('index')

    } catch(error) {

        console.error(error)
        res.render("error", {error})
        
    }
    
})

app.listen(process.env.PORT, () => console.log("server is live"))