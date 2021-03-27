import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-game-who-is-the-spy',
  styleUrl: 'app-game-who-is-the-spy.css',
  scoped: true,
})
export class AppGameWhoIsTheSpy {

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
          Still building...
        </ion-content>
      </Host>
    );
  }

}
