const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/a', (req, res) => {
    let filepath = path.resolve(__dirname, "../public/download")
    let filename = req.query.filename

    let file = path.resolve(filepath, filename)
    res.sendFile(file)
})

module.exports = router