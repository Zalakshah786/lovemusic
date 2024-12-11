// script.js

document.addEventListener('DOMContentLoaded', () => {
  const audioPlayers = document.querySelectorAll('audio');
  
  audioPlayers.forEach((player) => {
    player.addEventListener('play', () => {
      // Pause other players when one starts playing
      audioPlayers.forEach((otherPlayer) => {
        if (otherPlayer !== player) {
          otherPlayer.pause();
        }
      });
    });
  });
});
