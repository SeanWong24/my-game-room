import { Component, h, Host, State } from '@stencil/core';
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
  private connections: Peer.DataConnection[] = [];

  private get isHost() {
    return this.peerId === this.hostId;
  }

  @State() roomName: string;
  @State() playerName: string;

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>My Game Room</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-grid>
            <ion-row>
              <ion-col></ion-col>
              <ion-col size="auto">
                {this.renderMainContent()}
              </ion-col>
              <ion-col></ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </Host>
    );
  }

  private renderMainContent() {
    return (
      <div id="main-content">
        <ion-item>
          <ion-label position="stacked">Room Name</ion-label>
          <ion-input
            type="text"
            placeholder="Please enter the room name"
            value={this.roomName}
            onIonChange={({ detail }) => this.roomName = detail.value}
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Player Name</ion-label>
          <ion-input
            type="text"
            placeholder="Please enter your player name"
            value={this.playerName}
            onIonChange={({ detail }) => this.playerName = detail.value}
          ></ion-input>
        </ion-item>
        <ion-button
          disabled={!this.roomName || !this.playerName}
          expand="block"
          onClick={() => this.createRoom()}
        >Create Room</ion-button>
        <ion-button
          disabled={!this.roomName || !this.playerName}
          expand="block"
          onClick={() => this.joinRoom()}
        >Join Room</ion-button>
      </div>
    );
  }

  private createRoom() {
    this.hostId = `mgr-${this.roomName}`;
    this.peer = this.createPeer(this.hostId);
  }

  private joinRoom() {
    this.hostId = `mgr-${this.roomName}`;
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
