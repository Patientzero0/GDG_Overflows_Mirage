// Register ScrollTrigger plugin
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 1. Initialize Locomotive Scroll FIRST
const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  multiplier: 1,
  lerp: 0.06
});

// 2. Fixed Navbar Animation (Safe Entrance)
// We use a timeline to ensure it doesn't get lost
const navTl = gsap.timeline();
navTl.from(".fixed-nav", {
  y: -20,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out",
  delay: 0.2
});

// 3. Hero Animations
gsap.from(".hero h1", {
  y: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power4.out",
  delay: 0.4
});

// 4. Update ScrollTrigger when Locomotive Scroll updates
scroll.on('scroll', (instance) => {
  ScrollTrigger.update();
  
  // NAV EFFECT ON SCROLL:
  // If we scroll down more than 50px, make the glass slightly more solid
  if (instance.scroll.y > 50) {
    gsap.to(".glass-nav", {
      backgroundColor: "rgba(15, 15, 15, 0.7)",
      padding: "8px 0", // Shrink slightly
      duration: 0.4
    });
  } else {
    gsap.to(".glass-nav", {
      backgroundColor: "rgba(40, 40, 40, 0.35)",
      padding: "14px 0",
      duration: 0.4
    });
  }
});

// 5. ScrollTrigger Proxy (Essential for Locomotive + ScrollTrigger)
ScrollTrigger.scrollerProxy('[data-scroll-container]', {
  scrollTop(value) {
    return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  pinType: document.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
});

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = document.getElementById('theme-switcher');
  
  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      
      // Animate the icons using GSAP for a smooth transition
      if (isLight) {
        gsap.to(".moon-icon", { opacity: 0, duration: 0.3 });
        gsap.to(".sun-icon", { opacity: 1, display: "block", duration: 0.3 });
      } else {
        gsap.to(".moon-icon", { opacity: 1, duration: 0.3 });
        gsap.to(".sun-icon", { opacity: 0, display: "none", duration: 0.3 });
      }
    });
  }
});

// Refresh everything
ScrollTrigger.addEventListener("refresh", () => scroll.update());
ScrollTrigger.refresh();