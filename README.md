# Mekabois Server Application
This project was created for Mekabois Server Application with [NodeJS](https://nodejs.org/en/) and [Node-Media-Server](https://github.com/illuspas/Node-Media-Server)

**Live Demo:** [mekabois.cf](https://mekabois.cf/#/)

**Client-side Repo:** [mekabois-client](https://github.com/Closery/mekabois-client)
 
## Before You Go
Before running the project, edit `config.json`. Configure your web server host and socket server host and nms host.

## Stream Keys and Room Names
To configure stream keys and room names, first edit `ROOMS` (or `PRIVATE_ROOMS`) then add these rooms to `STREAM_KEYS` with keys in `config.json`.

**Example:**

    "ROOMS": ["room1", "room2", "room3"],
    "PRIVATE_ROOMS": ["room_p1_4d3fe3", "room_p2_5g3dw1"],
    
    "STREAM_KEYS": {
	    "room1": "5t89FVe2trj7h",
	    "room2": "room-stream-key",
	    "room3": "room-stream-key",
	    "room_p1_4d3fe3": "room-stream-key",
	    "room_p2_5g3dw1": "room-stream-key"
    },

## Run the Project
After configuring Stream Keys and Room Names you should run the App, Socket and NMS at the same time.
**Run these commands:**

1- `npm run start`

2- `npm run socket`

3- `npm run nms`

## Client Application
For client application you should place your application under `client/build` folder. Server application will serve build folder by default.

## Available Scripts
In the project directory, you can run:

### `npm run start`
Runs the App in the production mode on port **5000** by default. 
You can change the port via `config.json`
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

### `npm run dev`
Runs the App in the development mode on port **5000** by default. 
You can change the port via `config.json`
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.
**Application will reload if you make edits.**

### `npm run socket`
Runs the Socket Server in the production mode on port **4000** by default. 
You can change the port via `config.json`
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

### `npm run devSocket`
Runs the Socket Server in the development mode on port **4000** by default. 
You can change the port via `config.json`
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.
**Application will reload if you make edits.**

### `npm run nms`
Runs the Node-Media-Server in the production mode on ports **8000** and **1935** for RMTP by default. 
You can change the ports via `config.json`
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

### `npm run devNms`
Runs the Node-Media-Server in the development mode on ports **8000** and **1935** for RMTP by default. 
You can change the ports via `config.json`
**Application will reload if you make edits.**
