const CONFIG = require('./config.json')
const NodeMediaServer = require('node-media-server')
const NMS = new NodeMediaServer(CONFIG.NMS_CONFIG)

NMS.on('prePublish', (id, StreamPath, args) => {
	const streamKeys = Object.values(CONFIG.STREAM_KEYS)
	const session = NMS.getSession(id)
	var reject = true

	streamKeys.forEach((key) => {
		if (StreamPath === `/live/${key}`) reject = false
	})

	if (reject) {
		console.log('Connection refused.')
		session.reject()
	}
})

NMS.run()
