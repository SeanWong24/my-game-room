import { alertController } from '@ionic/core';
import { Component, Host, h, Prop, ComponentInterface, State } from '@stencil/core';
import { games } from '../../utils/games';
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
              {
                this.isHost &&
                <ion-button title="Start game" onClick={() => this.startGame()}>
                  <ion-icon slot="icon-only" name="play"></ion-icon>
                </ion-button>
              }
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
                      !(this.chatMassages?.length > 0) &&
                      <ion-card>
                        <ion-card-header>
                          <ion-card-title>No Message Yet</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                          Sending a message to start the chat
                        </ion-card-content>
                      </ion-card>
                    }
                    {
                      this.chatMassages?.length > 0 && this.chatMassages.map(message => (
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
              {
                games.map(game => (
                  <ion-card button onClick={() => this.sendGameVoting(game.name)}>
                    <ion-card-header>
                      <ion-card-title>{game.displayName}</ion-card-title>
                      {state.votedGameNameAndPlayerNamesDict[game.name]?.map(playerName => <ion-badge>{playerName}</ion-badge>)}
                      <ion-card-subtitle>{game.minPlayers} - {game.maxPlayers} players</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                      {game.description}
                    </ion-card-content>
                  </ion-card>
                ))
              }
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
      connection.send(message);
    }
    if (this.isHost) {
      this.displayChatMessage(message as ChatMessage);
    }
    this.chatMessageToBeSent = undefined;
  }

  private sendGameVoting(gameName: string) {
    if (this.isHost) {
      // TODO could be repeated codes 
      const previousPlayerList = Object.values(state.votedGameNameAndPlayerNamesDict).find(playerList => playerList.find(p => p === state.playerName));
      previousPlayerList?.splice(previousPlayerList.indexOf(state.playerName), 1);
      let newPlayerList = state.votedGameNameAndPlayerNamesDict[gameName];
      if (!newPlayerList) {
        state.votedGameNameAndPlayerNamesDict[gameName] = [];
        newPlayerList = state.votedGameNameAndPlayerNamesDict[gameName];
      }
      newPlayerList.push(state.playerName);
      state.votedGameNameAndPlayerNamesDict = Object.assign({}, state.votedGameNameAndPlayerNamesDict);

      const messageOut = {
        type: 'update-voted-game-list',
        content: state.votedGameNameAndPlayerNamesDict
      } as Message;
      for (const connection of state.connections) {
        connection.send(messageOut);
      }
    } else {
      const message = {
        type: 'vote-game',
        player: state.playerName,
        content: gameName
      } as Message;
      for (const connection of state.connections) {
        connection.send(message);
      }
    }
  }

  private async startGame() {
    const gameVotes = Object.entries(state.votedGameNameAndPlayerNamesDict).map(([gameName, players]) => ({ gameName, voteCount: players.length }));
    const highestGameVote = gameVotes?.sort((a, b) => b.voteCount - a.voteCount)[0];
    const votedGame = games.find(game => game.name === highestGameVote.gameName);

    const router = document.querySelector('ion-router');
    const alert = await alertController.create({
      header: 'Starting game...',
      message: `Your are going to start ${votedGame.displayName}. Are you sure?`,
      buttons: [
        {
          text: 'Yep',
          handler: () => {
            router.push(`/room/${this.roomName}/${votedGame.name}`);
            
            const message = {
              type: 'update-game-selection',
              content: votedGame.name
            } as Message;
            for (const connection of state.connections) {
              connection.send(message);
            }
          }
        },
        'Nay'
      ]
    });
    await alert.present();
  }

}
