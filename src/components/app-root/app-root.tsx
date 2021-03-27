import { Component, ComponentInterface, h } from '@stencil/core';
import { games } from '../../utils/games';

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
          {
            games.map(game => (
              <ion-route url={`/room/:roomName/${game.name}`} component={`app-game-${game.name}`} />
            ))
          }
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
