import { createStore } from "@stencil/store";
import Peer from "peerjs";
import { ChatMessage } from "./message";

const { state } = createStore({
    connections: [],
    players: []
});

export default state as {
    peer: Peer,
    peerId: string,
    hostId: string,
    playerName: string,
    connections: Peer.DataConnection[],
    players: { name: string, isHost: boolean }[];
    displayChatMessageHandler: (message: ChatMessage) => void;
};