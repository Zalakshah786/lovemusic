// script.js
document.getElementById('signupBtn').addEventListener('click', function() {
  document.getElementById('signup').style.display = 'block';
  document.getElementById('playlist').style.display = 'none';
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simulate a sign-up process
  setTimeout(function() {
    document.getElementById('signupResponse').innerText = 'You have signed up successfully!';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('playlist').style.display = 'block';
  }, 1000);
});
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
