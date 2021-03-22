import { createStore } from "@stencil/store";
import Peer from "peerjs";

const { state } = createStore({
    connections: [],
    players: []
});

export default state as {
    peer: Peer,
    peerId: string,
    hostId: string,
    connections: Peer.DataConnection[],
    players: { name: string, isHost: boolean }[];
};