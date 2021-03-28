import { createStore } from "@stencil/store";
import Peer from "peerjs";
import { ChatMessage, Message } from "./message";

declare type StoreState = {
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

const { state, onChange: onStoreStateChange } = createStore({
    connections: [],
    players: [],
    votedGameNameAndPlayerNamesDict: {}
} as StoreState);

export { state, onStoreStateChange };