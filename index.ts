// import h3 from "h3-js"

import type { BunRequest } from "bun";

// const server = Bun.serve({
//     port: process.env.PORT || 8080,
//     routes: {
//         "/": () => new Response("hello chads"),
//         "/ping": () => new Response("pong"),
//         "/h3-index": () => getH3Index()
//     }
// })

// function getH3Index() {
//     const h3Index = h3.latLngToCell(23.0301216, 88.5257018, 10)

//     return Response.json(h3Index);
// }

// console.debug(server.development)
// console.debug(server.hostname)
// console.debug(server.id)
// console.debug(server.pendingRequests)
// console.debug(server.port)
// console.debug(server.protocol)

// console.log("server running on " + server.url)

// // getCurrentLocation

// const options = {
//     enableHighAccuracy: true,
//     timeout: 3000,
//     maximumAge: 0
// }

// function currentLocation(pos: GeolocationPosition) {
//     const crds = pos.coords;
//     console.log("your location");
//     console.log("lat: " + crds.latitude);
//     console.log("long: " + crds.longitude);
//     console.log("accuracy: " + crds.accuracy);

//     const resObj = {
//         success: true,
//         locationData: {
//             lat: crds.latitude,
//             long: crds.longitude,
//             accuracy: crds.accuracy
//         }
//     }

//     return Response.json(resObj)
// }


// WEBSOCKETS

type WebSocketsData = {
    createdAt: number;
    username: string;
    channelId: string;
    userId: string
}

interface User {
    userId: string;
    imageUrl: string;
    username: string;
    createdAt: number;
}

interface Channel {
    channelId: string;
    channelName: string;
    createdAt: number;

}

const server = Bun.serve({
    port: process.env.PORT,

    fetch(req, server) {

        const url = new URL(req.url);

        if (url.pathname.startsWith("/channel/")) {
            const id = url.pathname.split("/")[2];



            const success = server.upgrade(req, {
                data: {
                    createdAt: Date.now(),
                    username: "someRandomShit",
                    channelId: id!,
                    userId: crypto.randomUUID(),
                }
            });

            if (success) return undefined;
            return new Response("upgrade failed", { status: 500 })
        }

        return new Response("server running")

    },
    websocket: {
        data: {} as WebSocketsData,
        async open(ws) {
            const msg = `${ws.data.userId} has joined the room`;

            ws.subscribe(ws.data.channelId)
            server.publish(ws.data.channelId, msg);
            // ws.send(`[${ws.data.userId}]: ${message}`)
        },
        async message(ws, message) {
            server.publish(ws.data.channelId, `[${ws.data.userId}]: ${message}`)
            console.log(`active subscribers: ${server.subscriberCount(ws.data.channelId)}`)
        },
        async close(ws, code, reason) {
            const msg = `${ws.data.userId} has left the channel, due to ${reason}. Status code: ${code}`
            ws.unsubscribe(ws.data.channelId)
            server.publish(ws.data.channelId, msg)
        },
        async drain(ws) {

        },
    }
})

console.debug("server listening on port: " + server.url);




