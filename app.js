const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const uploadRouter = require('./router/upload.js')
const downloadRouter = require('./router/download.js')

const app = express()

app.use((req, res, next) => {
    try {
        let publicDir = path.resolve(__dirname, "public")
        let uploadDir = path.resolve(__dirname, "public/upload")
        let downloadDir = path.resolve(__dirname, "public/download")
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, (err) => {
                throw err
            })
        }
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, (err) => {
                throw err
            })
        }
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, (err) => {
                throw err
            })
        }
    } catch (error) {
        console.log("err");
    }

    next()
})
app.use(cors())

app.use('/upload', uploadRouter)
app.use('/download', downloadRouter)

app.listen(8080, () => {
    console.log("app listening on port http://127.0.0.1:8080");
})