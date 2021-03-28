import { Component, Host, h, ComponentInterface } from '@stencil/core';
import { Message } from '../../utils/message';
import { state } from '../../utils/store';

@Component({
  tag: 'app-game-who-is-the-spy',
  styleUrl: 'app-game-who-is-the-spy.css',
  scoped: true,
})
export class AppGameWhoIsTheSpy implements ComponentInterface {

  private get isHost() {
    return state.peerId === state.hostId;
  }

  connectedCallback() {
    state.activeGameMessageHandler = message => this.gameMessageHandler(message);
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <ion-title>Who is the spy?</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-button onClick={() => {
            if (this.isHost) {
              const messageOut = {
                type: 'update-game-status',
                player: state.playerName,
                content: 'Clicked'
              } as Message;
              alert(`${messageOut.player} ${messageOut.content}.`);
              for (const connection of state.connections) {
                connection.send(messageOut);
              }
            } else {
              const message = {
                type: 'game-action',
                player: state.playerName,
                content: 'Clicked'
              } as Message;
              for (const connection of state.connections) {
                connection.send(message);
              }
            }
          }}>Test</ion-button>
        </ion-content>
      </Host>
    );
  }

  gameMessageHandler(message: Message) {
    switch (message.type) {
      case 'game-action':
        if (this.isHost) {
          alert(`${message.player} ${message.content}.`);
          const messageOut = {
            type: 'update-game-status',
            player: message.player,
            content: 'Clicked'
          } as Message;
          for (const connection of state.connections) {
            connection.send(messageOut);
          }
        }
        break;
      case 'update-game-status':
        if (!this.isHost) {
          alert(`${message.player} ${message.content}.`);
        }
        break;
    }
  }

}
