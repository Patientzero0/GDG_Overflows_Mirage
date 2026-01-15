const canvas = document.getElementById('avatar-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

function drawOrb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const baseRadius = 150;
  const pulse = Math.sin(time) * 15;

  ctx.beginPath();
  ctx.arc(centerX, centerY, baseRadius + pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(59,130,246,0.4)';
  ctx.shadowBlur = 80;
  ctx.shadowColor = '#3b82f6';
  ctx.fill();

  time += 0.05;
  requestAnimationFrame(drawOrb);
}

drawOrb();
