import { Component, ComponentInterface, h } from '@stencil/core';
import { games } from '../../utils/games';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  scoped: true,
})
export class AppRoot implements ComponentInterface {

  connectedCallback() {
    this.toggleDarkMode();
  }

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

  private toggleDarkMode() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    toggleDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => toggleDarkTheme(mediaQuery.matches));

    // Add or remove the "dark" class based on if the media query matches
    function toggleDarkTheme(shouldAdd) {
      document.body.classList.toggle('dark', shouldAdd);
    }
  }

}
