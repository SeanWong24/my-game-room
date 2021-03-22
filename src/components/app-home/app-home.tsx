import { Component, h, Host } from '@stencil/core';
import Peer from 'peerjs';
import { Message } from '../../utils/message';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {

  private readonly peerJSOptions: Peer.PeerJSOption = {
    debug: 3,
    config: {
      'iceServers': [
        { urls: ['stun:stun.l.google.com:19302'] },
      ]
    }
  };

  private peer: Peer;
  private peerId: string;
  private hostId: string;
  private playerName: string;
  private connections: Peer.DataConnection[] = [];

  private get isHost() {
    return this.peerId === this.hostId;
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>My Game Room</ion-title>
          </ion-toolbar>
        </ion-header>,

        <ion-content class="ion-padding">
          <ion-button onClick={() => this.createRoom()}>Create Room</ion-button>
          <ion-button onClick={() => this.joinRoom()}>Join Room</ion-button>
        </ion-content>
      </Host>
    );
  }

  private createRoom() {
    const roomName = prompt('Room name?');
    this.playerName = prompt('Player name?');
    this.hostId = `mgr-${roomName}`;
    this.peer = this.createPeer(this.hostId);
  }

  private joinRoom() {
    const roomName = prompt('Room name?');
    this.playerName = prompt('Player name?');
    this.hostId = `mgr-${roomName}`;
    this.peer = this.createPeer();
  }

  private createPeer(peerId?: string) {
    const peer = new Peer(peerId, this.peerJSOptions);
    peer.on(
      'open',
      id => {
        console.log('Peer opened.')
        this.peerId = id;
        if (!this.isHost) {
          const connection = this.peer.connect(this.hostId, { label: this.playerName });
          connection.on(
            'open',
            () => {
              console.log('connection opend.');
            }
          );
          connection.on('error', (error) => {
            console.log(error);
          });
          connection.on(
            'data',
            data => {
              const message = JSON.parse(data) as Message;
              this.handleMessage(message, connection);
            }
          );
          this.connections.push(connection);
        }
      }
    );
    peer.on(
      'error',
      error => {
        if (error.type === 'unavailable-id') {
          this.hostId = undefined;
          alert('You cannot use this room name.');
        } else {
          alert(error.type);
        }
      }
    );
    peer.on(
      'connection',
      connection => {
        console.log(`${connection.label} connected.`);
        this.connections.push(connection);
        if (this.isHost) {
          connection.on(
            'open',
            () => {
              const message = {
                type: 'chat',
                player: connection.label,
                content: 'hi'
              } as Message;
              for (const conn of this.connections) {
                conn.send(JSON.stringify(message));
              }
            }
          );
        }
        connection.on(
          'data',
          data => {
            const message = JSON.parse(data) as Message;
            this.handleMessage(message, connection);
          }
        );
      }
    );

    return peer;
  }

  private handleMessage(message: Message, _connection: Peer.DataConnection) {
    switch (message.type) {
      case 'chat':
        console.log(`${message.player}: ${message.content}`);
        if (this.isHost) {
          for (const conn of this.connections) {
            conn.send(JSON.stringify(message));
          }
        }
    }
  }

}
