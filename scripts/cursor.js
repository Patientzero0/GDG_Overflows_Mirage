const cursor = document.querySelector('.custom-cursor');
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  gsap.to(cursor, {
    x: mouseX - 10,
    y: mouseY - 10,
    duration: 0.3,
    ease: 'power3.out'
  });
});

document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    gsap.to('.custom-cursor', {
      scale: 2,
      duration: 0.3,
      ease: "power3.out"
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to('.custom-cursor', {
      scale: 1,
      duration: 0.3,
      ease: "power3.out"
    });
  });
});
