import { Component, ComponentInterface, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  scoped: true,
})
export class AppRoot implements ComponentInterface {
  render() {
    return (
      <ion-app>
        <ion-router useHash={true}>
          <ion-route url="/" component="app-home" />
          <ion-route url="/room/:roomName" component="app-waiting-zone" />
          <ion-route url="/room/:roomName/who-is-the-spy" component="app-game-who-is-the-spy" />
          <ion-route url="/room/:roomName/codenames" component="app-game-codenames" />
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
