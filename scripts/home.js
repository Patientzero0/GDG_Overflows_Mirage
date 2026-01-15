document.querySelectorAll('.magnetic-card').forEach(card => {
    const strength = 0.25;
  
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
  
      gsap.to(card, {
        x: x * strength,
        y: y * strength,
        duration: 0.6,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)"
      });
    });
  
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "expo.out"
      });
    });
  });

  gsap.from(".home-hero h1", {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)"
  });
  
  gsap.from(".mode-card", {
    y: 100,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: "expo.out",
    delay: 0.2
  });
  
  const teacherLottie = lottie.loadAnimation({
  container: document.getElementById('teacher-lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/teacher-lottie.json' // 🔁 replace with your file name
});

const customerLottie = lottie.loadAnimation({
  container: document.getElementById('customer-lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/customer-lottie.json' // 🔁 replace with your file name
});

function lottieHover(cardId, animation) {
  const card = document.getElementById(cardId);

  card.addEventListener('mouseenter', () => {
    animation.setSpeed(1.2);
    animation.goToAndPlay(0, true);

    gsap.to(card.querySelector('.lottie-box'), {
      scale: 1.08,
      duration: 0.6,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    });
  });

  card.addEventListener('mouseleave', () => {
    animation.setSpeed(1);

    gsap.to(card.querySelector('.lottie-box'), {
      scale: 1,
      duration: 0.6,
      ease: "expo.out"
    });
  });
}

lottieHover('teacher-card', teacherLottie);
lottieHover('customer-card', customerLottie);

document.getElementById('teacher-card').addEventListener('click', () => {
    window.location.href = 'teacher.html';
});

document.getElementById('customer-card').addEventListener('click', () => {
    window.location.href = 'customer.html';
});

const themeSwitcher = document.getElementById('theme-switcher');

themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

