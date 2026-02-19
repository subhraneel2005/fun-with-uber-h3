import { channels } from "..";
import type { WsControllerProps } from "../utils/interfaces";

export function joinRoom({ ws, channelId }: WsControllerProps) {
    ws.subscribe(channelId);

    if (channels.has(channelId)) {
        channels.get(channelId)!.add(ws.data.userId)
    } else {
        channels.set(channelId, new Set())
    }
}