const buttons = document.querySelectorAll('.magnetic-btn');

buttons.forEach(btn => {
  const strength = 0.4;

  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    });

    gsap.to(btn.querySelector('span'), {
      x: x * strength * 1.5,
      y: y * strength * 1.5,
      duration: 0.4,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to([btn, btn.querySelector('span')], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "expo.out"
    });
  });
});
