import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-game-codenames',
  styleUrl: 'app-game-codenames.css',
  scoped: true,
})
export class AppGameCodenames {

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="primary">
            <ion-buttons slot="start">
              <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <ion-title>Codenames</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          Still building...
        </ion-content>
      </Host>
    );
  }

}
