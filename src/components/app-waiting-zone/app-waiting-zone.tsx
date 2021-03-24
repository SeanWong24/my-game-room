import { Component, Host, h, Prop, ComponentInterface, State } from '@stencil/core';
import { ChatMessage, Message } from '../../utils/message';
import state from '../../utils/store';

@Component({
  tag: 'app-waiting-zone',
  styleUrl: 'app-waiting-zone.css',
  scoped: true,
})
export class AppWaitingZone implements ComponentInterface {

  private get isHost() {
    return state.peerId === state.hostId;
  }

  @State() viewSelection: string = 'chats';
  @State() chatMessageToBeSent: string;
  @State() chatMassages: ChatMessage[] = [];

  @Prop() roomName: string;

  connectedCallback() {
    state.displayChatMessageHandler = message => this.displayChatMessage(message);
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <ion-title>{this.roomName} - {state.players.length} player(s)</ion-title>
            <ion-buttons slot="end">
              <ion-menu-toggle>
                <ion-button title="Player List">
                  <ion-icon slot="icon-only" name="people"></ion-icon>
                </ion-button>
              </ion-menu-toggle>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-split-pane contentId="main-view-container">
          <ion-menu side="end" contentId="main-view-container">
            <ion-list>
              {
                state.players?.map(({ name, isHost }, index) => (
                  <ion-item>
                    <ion-badge slot="start" color="primary">{index + 1}</ion-badge>
                    <ion-label>{name}</ion-label>
                    {isHost && <ion-badge color="secondary">Host</ion-badge>}
                  </ion-item>
                ))
              }
            </ion-list>
          </ion-menu>
          <ion-content id="main-view-container" class="ion-padding">
            <ion-segment value={this.viewSelection} onIonChange={({ detail }) => this.viewSelection = detail.value}>
              <ion-segment-button value="chats">
                <ion-label>Chats</ion-label>
              </ion-segment-button>
              <ion-segment-button value="games">
                <ion-label>Games</ion-label>
              </ion-segment-button>
            </ion-segment>
            {this.renderMainView()}
          </ion-content>
        </ion-split-pane>
      </Host>
    );
  }

  private renderMainView() {
    switch (this.viewSelection) {
      case 'chats':
        return (
          <ion-grid style={{ height: 'calc(100% - 50px)' }}>
            <ion-row style={{ height: 'calc(100% - 50px)' }}>
              <ion-col>
                <ion-content>
                  <ion-list>
                    {
                      this.chatMassages?.map(message => (
                        <ion-card>
                          <ion-card-header>
                            <ion-card-subtitle>{message.player}</ion-card-subtitle>
                          </ion-card-header>
                          <ion-card-content>
                            {message.content}
                          </ion-card-content>
                        </ion-card>
                      ))
                    }
                  </ion-list>
                </ion-content>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-input
                    placeholder="Enter your message here..."
                    value={this.chatMessageToBeSent}
                    onIonChange={({ detail }) => this.chatMessageToBeSent = detail.value}
                  ></ion-input>
                  <ion-button slot="end" fill="clear" onClick={() => this.sendChatMessage()}>
                    <ion-icon slot="icon-only" name="send"></ion-icon>
                  </ion-button>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        );
      case 'games':
        return (
          <ion-content style={{ height: 'calc(100% - 50px)' }}>
            <ion-list>
              <ion-card button>
                <ion-card-header>
                  <ion-card-title>Mock Game 1</ion-card-title>
                  <ion-card-subtitle>2 - 5 players</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  Mock discription...
                </ion-card-content>
              </ion-card>
              <ion-card button>
                <ion-card-header>
                  <ion-card-title>Mock Game 2</ion-card-title>
                  <ion-card-subtitle>3 - 5 players</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  Mock discription...
                </ion-card-content>
              </ion-card>
              <ion-card button>
                <ion-card-header>
                  <ion-card-title>Mock Game 3</ion-card-title>
                  <ion-card-subtitle>3 - 9 players</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  Mock discription...
                </ion-card-content>
              </ion-card>
            </ion-list>
          </ion-content>
        );
    }
  }

  private displayChatMessage(message: ChatMessage) {
    this.chatMassages = [...this.chatMassages, message];
  }

  private sendChatMessage() {
    // TODO maybe use a general method to send messages
    const message = {
      type: 'chat',
      player: state.playerName,
      content: this.chatMessageToBeSent
    } as Message;
    for (const connection of state.connections) {
      connection.send(JSON.stringify(message));
    }
    if (this.isHost) {
      this.displayChatMessage(message as ChatMessage);
    }
    this.chatMessageToBeSent = undefined;
  }

}
