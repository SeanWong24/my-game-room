import { Component, Host, h, Prop, ComponentInterface } from '@stencil/core';

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
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">

        </ion-content>
      </Host>
    );
  }

}
