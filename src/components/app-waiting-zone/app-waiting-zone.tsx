import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';
import state from '../../utils/store';

@Component({
  tag: 'app-waiting-zone',
  styleUrl: 'app-waiting-zone.css',
  scoped: true,
})
export class AppWaitingZone implements ComponentInterface {

  @Prop() roomName: string;

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <ion-title>{this.roomName}</ion-title>
            <ion-buttons slot="end">
              <ion-menu-toggle>
                <ion-button title="Player List">
                  <ion-icon slot="icon-only" name="people"></ion-icon>
                </ion-button>
              </ion-menu-toggle>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-split-pane contentId="chat-pane">
          <ion-menu side="end" contentId="chat-pane">
            <ion-list>
              {
                state.players?.map(({ name, isHost }, index) => (
                  <ion-item>
                    <ion-badge slot="start" color="primary">{index + 1}</ion-badge>
                    <ion-label>{`${name}${isHost ? ' (Host)' : ''}`}</ion-label>
                    {isHost && <ion-badge color="secondary">Host</ion-badge>}
                  </ion-item>
                ))
              }
            </ion-list>
          </ion-menu>
          <ion-content id="chat-pane" class="ion-padding">
            Chat pane
          </ion-content>
        </ion-split-pane>
      </Host>
    );
  }

}
