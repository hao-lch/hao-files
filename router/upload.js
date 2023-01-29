const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/', (req, res) => {
    const type = `--${req.headers['content-type'].split('boundary=')[1]}`

    let data = Buffer.alloc(0)
    req.on('data', (chunk) => {
        data = Buffer.concat([data, chunk])
    })
    req.on('end', () => {
        let isUploadFile = uploadFile(data, type)

        isUploadFile ? res.status(201).send("上传文件完成") : res.status(500).send("上传文件失败")
    })
})

Buffer.prototype.split = function (buffer, type) {
    const res = []
    let offset = 0;
    let index = buffer.indexOf(type, 0)
    while (index !== -1) {
        res.push(buffer.slice(offset, index))
        offset = index + type.length
        index = buffer.indexOf(type, index + type.length)
    }

    res.push(buffer.slice(offset))
    return res
}

function uploadFile(data, type) {
    console.log("--- start parsing file ---");

    try {
        const filesArr = data.split(data, type).slice(1, -1)
        filesArr.forEach((item, index) => {
            console.log(`start parsing the ${index + 1} file`);

            const [head, body] = getHeadAndBody(item)

            const CDispositionStr = head.split(head, '\r\n').slice(1)
            const CDispositionObj = parseHeader(CDispositionStr[0].toString())

            // 还有可能上传的是文本内容，不是一个文件
            if (CDispositionObj.filename) {
                fs.writeFile(path.resolve(__dirname, "../public/upload", CDispositionObj.filename), body.slice(0, -2), (err) => {
                    if (err) {
                        throw err
                    }
                })
            }
        })
    } catch (error) {
        console.log("upload error: \n", error);
        return false
    }

    console.log("--- parsing file stop ---");
    return true
}

function parseHeader(header) {
    const arr = header.split("; ")
    const CDispositionObj = {}
    arr.forEach(item => {
        let [name, val] = item.split("=")
        if (!val) {
            name = name.split(": ")[1]
            val = ""
        }
        val = (val[0] === '"' && val[val.length - 1] === '"') ? val.slice(1, val.length - 1) : val
        CDispositionObj[name] = val
    })
    return CDispositionObj
}

function getHeadAndBody(buffer) {
    const res = []
    let index = buffer.indexOf('\r\n\r\n')
    res.push(buffer.slice(0, index))
    res.push(buffer.slice(index + 4))
    return res
}

module.exports = router