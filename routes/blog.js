/* Routes

    GET /blog/view/:id
    GET /create/
    GET /edit
    POST /:id?
    DELETE /:id

*/

const express = require("express")
const fs = require("fs")
const path = require("path")

const router = new express.Router()

// VIEW A BLOG
router.get("/view/:id", (req, res) => {
    const blogId = parseInt(req.params.id)

    fs.readFile(path.join(__dirname, "../database/blogs.json"), (err, raw) => {
        if (err) {
            console.error(err)
            res.status(500).end()
        }
        const blogs = JSON.parse(raw)
        const blog = blogs.find(el => el.id === blogId)
        if (blog) {
            res.render("blog", {blog})
        } else {
            res.status(500).send("blog not found")
        }
    })
})

// CREATING A BLOG
router.get("/create", (req, res) => {
    res.render("new", {editing:false})
})

// EDIT A BLOG
router.get("/edit/:id", (req, res) => {
    const blogId = parseInt(req.params.id)
    

    fs.readFile(path.join(__dirname, "../database/blogs.json"), (err, raw) => {
        if (err) {
            console.error(err)
            res.status(500).end()
        }
        const blogs = JSON.parse(raw)
        const blog = blogs.find(el => el.id === blogId)
        if (blog) {
            res.render("edit", {blog, editing:true})
        } else {
            res.status(500).send("blog not found")
        }
    })
})

// SAVING A BLOG
router.post("/:id?", (req, res) => {
    const {title, description, content} = req.body
    const reqId = req.params.id

    fs.readFile(path.join(__dirname, "../database/blogs.json"), (err, raw) => {
        if (err) {
            console.error(err)
            res.status(500).end()
        }
        const blogs = JSON.parse(raw)

        if (reqId) {
            const sameBlog = blogs.find(blog => blog.id == reqId)
            if (!sameBlog) {
                res.status(400).send("There is not blog with this id")
            }
            sameBlog.title = title
            sameBlog.description = description
            sameBlog.content = content

            fs.writeFile(path.join(__dirname, "../database/blogs.json"), JSON.stringify(blogs, null, 2), err => {
                if (err) {
                    console.error(err)
                    res.status(500).end()
                }
                res.render("index", {blogs})
            })
            return
        }

        const blogId = blogs[blogs.length-1]?.id+1

        if (!blogId && blogs.length) {
            console.error("MISSING DATA PROPERTY IN BLOGS.JSON")
            res.status(500).end()
        }  

        blogs.push({
            id: blogId || 0,
            title,
            description,
            content
        })

        fs.writeFile(path.join(__dirname, "../database/blogs.json"), JSON.stringify(blogs, null, 2), (err) => {
            if (err) {
                console.error(err)
                res.status(500).end()
            }
            res.render("index", {blogs})
        })
    })
})


// DELETE A BLOG
router.delete("/:id", (req, res) => {
    const blogId = parseInt(req.params.id)

    fs.readFile(path.join(__dirname, "../database/blogs.json"), (err, raw) => {
        if (err) {
            console.error(err)
            res.status(500).end()
        }
        const blogs = JSON.parse(raw)
        const blog = blogs.find(el => el.id === blogId)

        if (!blog) res.status(500).send("blog not found")

        blogs.splice(blogId,1)

        for (let i=blogId; i<blogs.length; i++) {
            blogs[i].id--
        }

        fs.writeFile(path.join(__dirname, "../database/blogs.json"), JSON.stringify(blogs, null, 2), (err) => {
            if (err) {
                console.error(err)
                res.status(500).end()
            }
            res.render("index", {blogs})
        })
    })
})

module.exports = router