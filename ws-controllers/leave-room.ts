import { channels } from "..";
import type { WsControllerProps } from "../utils/interfaces";

export function leaveRoom({ ws, channelId }: WsControllerProps) {
    ws.unsubscribe(channelId);

    channels.get(channelId)?.delete(ws.data.userId);

    // if size of this channel is 0, that means this was the last user, so delete the room
    if (channels.get(channelId)?.size === 0) {
        channels.delete(channelId)
    }
}