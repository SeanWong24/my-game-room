import { Component, Host, h, Prop, ComponentInterface, State } from '@stencil/core';
import state from '../../utils/store';

@Component({
  tag: 'app-waiting-zone',
  styleUrl: 'app-waiting-zone.css',
  scoped: true,
})
export class AppWaitingZone implements ComponentInterface {

  @State() viewSelection: string = 'chats';

  @Prop() roomName: string;

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
        return <div>Chat View</div>;
      case 'games':
        return <div>Game List</div>;
    }
  }

}
