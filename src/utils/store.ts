import { createStore } from "@stencil/store";
import Peer from "peerjs";
import { ChatMessage, Message } from "./message";

const { state } = createStore({
    connections: [],
    players: [],
    votedGameNameAndPlayerNamesDict: {}
});

export default state as {
    peer: Peer,
    peerId: string,
    hostId: string,
    playerName: string,
    connections: Peer.DataConnection[],
    players: { name: string, isHost: boolean }[];
    displayChatMessageHandler: (message: ChatMessage) => void;
    votedGameNameAndPlayerNamesDict: { [gameName: string]: string[] };
    activeGameMessageHandler: (message: Message) => void;
};