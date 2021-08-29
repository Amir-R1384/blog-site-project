if (process.env.NODE_ENV === "development") require("dotenv").config()
const express = require("express")
const app = express()

const indexRouter = require("./routes/index.js")

app.set("view engine", "pug")
app.use(express.static("src"))


app.use("/", indexRouter)

app.listen(process.env.PORT || 3000, () => console.log("server is live"))