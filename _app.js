const CONFIG = require('./config.json')
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})

app.get('/stream/:roomName', function (req, res) {
	const roomName = req.params.roomName
	const HOST = CONFIG.DEV_MODE ? CONFIG.DEV_NMS_HOST : CONFIG.NMS_HOST
	const URL = `${HOST}/live/${CONFIG.STREAM_KEYS[roomName]}.flv`

	axios
		.get(URL, { responseType: 'stream', timeout: 3000 })
		.then((stream) => {
			res.writeHead(stream.status, stream.headers)
			stream.data.pipe(res)
		})
		.catch((err) => {
			res.status(404)
			res.send({ error: 'Stream not found.' })
		})
})

app.listen(CONFIG.PORTS.API, function () {
	console.log(`Web server ready on port ${CONFIG.PORTS.API}!`)
})
