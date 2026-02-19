import type { WebSocketData } from "./utils/interfaces";
import { WsTypes } from "./utils/ws-types";
import { joinRoom } from "./ws-controllers/join-room";
import { leaveRoom } from "./ws-controllers/leave-room";

export const channels = new Map<string, Set<string>>() //channel2 ---> ["user1", "user8", "user11"]

const server = Bun.serve({
    port: process.env.PORT,

    fetch(req, server) {

        const url = new URL(req.url);

        if (url.pathname === "/ws") {

            const username = url.searchParams.get("username") || "Anonymous";
            const channelId = url.searchParams.get("channelId");

            if (!channelId) return;

            const success = server.upgrade(req, {
                data: {
                    channelId,
                    username,
                    userId: crypto.randomUUID(),
                    createdAt: Date.now(),
                }
            });

            if (success) return undefined;
            return new Response("upgrade failed", { status: 500 })
        }

        return new Response("server running")

    },
    websocket: {
        data: {} as WebSocketData,
        async open(ws) {
            const msg = `connected: ${ws.data.userId}`;
            ws.send(msg)
            console.log(msg);
        },
        async message(ws, message) {
            const parsedData = JSON.parse(message.toString())

            switch (parsedData.type) {
                case WsTypes.JOIN_CHANNEL:
                    joinRoom({
                        ws,
                        channelId: ws.data.channelId
                    })

                    break;

                case WsTypes.LEFT_CHANNEL:
                    leaveRoom({
                        ws,
                        channelId: ws.data.channelId
                    })
            }
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




