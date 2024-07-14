<template>
  <div id="particles-container"></div>
</template>

<script setup>
import { onMounted } from 'vue';

const initParticles = (isDarkMode) => {
  // const color = isDarkMode ? "#000000" : "#ffffff";
  // const lineColor = isDarkMode ? "#1d1d1d" : "#ffffff";
  const color = isDarkMode ? "#ffffff" : "#000000";
  const lineColor = isDarkMode ? "#ffffff" : "#1d1d1d";

  window.particlesJS('particles-container', {
    particles: {
      number: { value: 150, density: { enable: true, value_area: 800 } },
      color: { value: color },
      shape: {
        type: "triangle",
        stroke: { width: 0, color: color },
        polygon: { nb_sides: 5 },
        image: { src: "img/github.svg", width: 100, height: 100 }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: lineColor,
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 }
      }
    },
    retina_detect: true
  });
};

onMounted(() => {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const setParticles = () => {
    initParticles(prefersDarkScheme.matches);
  };

  setParticles();

  prefersDarkScheme.addEventListener("change", setParticles);
});
</script>

<style scoped>
#particles-container {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: -1; 
}

@media (prefers-color-scheme: dark) {
  #particles-container {
    background-color: #ffffff;
  }
}

canvas {
  display: block;
}
</style>
