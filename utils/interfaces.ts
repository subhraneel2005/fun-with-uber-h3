import type { ServerWebSocket } from "bun";

interface ChannelData {
    username: string;
    userId: string;
    channels: Map<string, Set<string>>;
}

interface User {
    userId: string;
    username: string;
    imageUrl: string;
    createdAt: number;
}

interface WebSocketData {
    channelId: string;
    username: string;
    userId: string;
    createdAt: number;
}

interface WsControllerProps {
    ws: ServerWebSocket<WebSocketData>,
    channelId: string
}

export type { ChannelData, User, WebSocketData, WsControllerProps }