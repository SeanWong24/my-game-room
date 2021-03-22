import { Component, ComponentInterface, h, Host, State } from '@stencil/core';
import Peer from 'peerjs';
import { Message } from '../../utils/message';
import state from '../../utils/store';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome implements ComponentInterface {

  private readonly peerJSOptions: Peer.PeerJSOption = {
    debug: 3,
    config: {
      'iceServers': [
        { urls: ['stun:stun.l.google.com:19302'] },
      ]
    }
  };


  private get isHost() {
    return state.peerId === state.hostId;
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

        <ion-content class="ion-padding" scrollY={false}>
          <ion-grid>
            <ion-row>
              <ion-col></ion-col>
              <ion-col size="12" sizeSm="8" sizeMd="6" sizeLg="4" sizeXl="3">
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
    state.hostId = `mgr-${this.roomName}`;
    state.peer = this.createPeer(state.hostId);
  }

  private joinRoom() {
    state.hostId = `mgr-${this.roomName}`;
    state.peer = this.createPeer();
  }

  private createPeer(peerId?: string) {
    const peer = new Peer(peerId, this.peerJSOptions);
    peer.on(
      'open',
      id => {
        console.log('Peer opened.')
        state.peerId = id;
        if (this.isHost) {
          state.players = [
            {
              name: this.playerName,
              isHost: true
            }
          ];
          this.navigateToWaitingZone();
        } else {
          const connection = state.peer.connect(state.hostId, { label: this.playerName });
          connection.on(
            'open',
            () => {
              console.log('connection opend.');
              this.navigateToWaitingZone();
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
          state.connections.push(connection);
        }
      }
    );
    peer.on(
      'error',
      error => {
        if (error.type === 'unavailable-id') {
          state.hostId = undefined;
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
        state.connections.push(connection);
        if (this.isHost) {
          connection.on(
            'open',
            () => {
              state.players = [...state.players, { name: connection.label, isHost: false }];
              const message = {
                type: 'update-player-list',
                content: state.players
              } as Message;
              for (const conn of state.connections) {
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
          for (const conn of state.connections) {
            conn.send(JSON.stringify(message));
          }
        }
        break;
      case 'update-player-list':
        state.players = message.content;
        break;
    }
  }

  private navigateToWaitingZone() {
    const router = document.querySelector('ion-router');
    router.push(`/room/${this.roomName}`);
  }

}
