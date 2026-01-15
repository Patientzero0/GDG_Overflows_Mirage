const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  multiplier: 1,
  lerp: 0.06
});

// Update ScrollTrigger when Locomotive Scroll updates
scroll.on('scroll', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.update();
  }
});

// Refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
  scroll.update();
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});