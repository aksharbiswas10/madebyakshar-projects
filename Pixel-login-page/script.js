/*
  🎨 Stylesheet: Login Page UI
  👨‍💻 Author: MadeByAkshar
  🌐 Website: https://madebyakshar.netlify.app
  📷 Instagram: https://instagram.com/ig.madebyakshar
  💻 GitHub: https://github.com/MadeByAkshar

  License: MIT License

  🌟 Features: Glowing forms, animated background, responsive UI
  🙌 Follow us for more: tools, launchers, UI kits, and creative login systems

  © 2025 MadeByAkshar. All rights reserved.
*/


const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const launcher = document.getElementById('launcher');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');


const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ⭐ Floating Star Particle System
const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2,
  dx: 0,
  dy: 0.2 + Math.random() * 0.5
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.dy;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// 🌠 Shooting Star every 10 seconds
setInterval(() => {
  let sx = Math.random() * canvas.width;
  let sy = 0;
  let length = 150;
  let speed = 4;
  let alpha = 1;

  function shoot() {
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + length, sy + length);
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    sx += speed;
    sy += speed;
    alpha -= 0.02;
    if (alpha > 0) requestAnimationFrame(shoot);
  }
  shoot();
}, 10000);

// ✅ Music Autoplay
window.addEventListener('load', () => {
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
});

// 🔊 Music Toggle
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.textContent = '🔊';
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔈';
  }
});

// ✨ Click Sound
document.addEventListener('click', () => {
  clickSound.volume = 0.4; // Lowered volume
  clickSound.currentTime = 0;
  clickSound.play();
});

// 🧩 Login & Signup flow
loginBtn.addEventListener('click', () => {
  launcher.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
  launcher.classList.add('hidden');
  signupForm.classList.remove('hidden');
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    launcher.classList.remove('hidden');
  });
});
/*
  🎨 Stylesheet: Login Page UI
  👨‍💻 Author: MadeByAkshar
  🌐 Website: https://madebyakshar.netlify.app
  📷 Instagram: https://instagram.com/ig.madebyakshar
  💻 GitHub: https://github.com/MadeByAkshar

  License: MIT License

  🌟 Features: Glowing forms, animated background, responsive UI
  🙌 Follow us for more: tools, launchers, UI kits, and creative login systems

  © 2025 MadeByAkshar. All rights reserved.
*/
