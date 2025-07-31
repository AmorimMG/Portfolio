<template>
  <div ref="blocker" class="blocker">
    <div class="stars-background">
      <div class="star" v-for="n in 50" :key="n" :style="getStarStyle()"></div>
    </div>

    <div ref="instructions" class="instructions">
      <div class="game-title">
        <h1>COSMIC EXPLORER</h1>
        <div class="title-underline"></div>
        <p class="subtitle">Portfolio Space Adventure</p>
      </div>

      <div class="menu-content">
        <div class="play-button">
          <div class="button-glow"></div>
          <span class="button-text">ENTER SPACE</span>
          <div class="button-particles">
            <div class="particle" v-for="n in 8" :key="n"></div>
          </div>
        </div>

        <div class="controls-section">
          <h3>MISSION CONTROLS</h3>
          <div class="controls-grid">
            <div class="control-item">
              <span class="key">W A S D</span>
              <span class="action">Navigate</span>
            </div>
            <div class="control-item">
              <span class="key">SPACE</span>
              <span class="action">Jump</span>
            </div>
            <div class="control-item">
              <span class="key">MOUSE</span>
              <span class="action">Look Around</span>
            </div>
            <div class="control-item">
              <span class="key">SHIFT</span>
              <span class="action">Run</span>
            </div>
            <div class="control-item">
              <span class="key">R</span>
              <span class="action">Switch View</span>
            </div>
            <div class="control-item">
              <span class="key">ESC</span>
              <span class="action">Exit</span>
            </div>
          </div>
        </div>

        <div class="mission-info">
          <div class="info-panel">
            <h4>MISSION OBJECTIVES</h4>
            <ul>
              <li>🌟 Collect 15 Energy Crystals</li>
              <li>🚀 Explore Space Totems</li>
              <li>🌌 Navigate the Cosmic Landscape</li>
              <li>📱 Discover Portfolio Projects</li>
            </ul>
          </div>
        </div>

        <div class="version-info">
          <span>ALPHA BUILD v1.0</span>
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span>SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const blocker = ref(null);
const instructions = ref(null);

// Generate random star positions and animations
const getStarStyle = () => {
  return {
    left: Math.random() * 100 + "%",
    top: Math.random() * 100 + "%",
    animationDelay: Math.random() * 3 + "s",
    animationDuration: Math.random() * 3 + 2 + "s",
  };
};

// Expose refs to parent component
defineExpose({
  blocker,
  instructions,
});

onMounted(() => {
  // Any initialization logic specific to instructions overlay
});
</script>

<style scoped>
.blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0a2e 0%, #2d1650 50%, #3d1a78 100%);
  z-index: 1000;
  pointer-events: auto;
  overflow: hidden;
}

.stars-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.instructions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Orbitron", "Arial", sans-serif;
  cursor: pointer;
  color: white;
  pointer-events: auto;
  position: relative;
  z-index: 10;
}

.game-title h1 {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #cc99ff, #9966ff, #6633ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(204, 153, 255, 0.5);
  animation: titleGlow 2s ease-in-out infinite alternate;
  letter-spacing: 0.2em;
}

@keyframes titleGlow {
  0% {
    filter: brightness(1) drop-shadow(0 0 10px rgba(204, 153, 255, 0.3));
  }
  100% {
    filter: brightness(1.2) drop-shadow(0 0 20px rgba(204, 153, 255, 0.6));
  }
}

.title-underline {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #cc99ff, transparent);
  margin: 10px auto 20px;
  animation: underlineGlow 3s ease-in-out infinite;
}

@keyframes underlineGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

.subtitle {
  font-size: 1.2rem;
  color: #bb99ff;
  margin: 0 0 3rem 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  width: 100%;
}

.play-button {
  position: relative;
  padding: 20px 60px;
  background: linear-gradient(45deg, #2d1650, #4a2c7a);
  border: 2px solid #9966ff;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 1rem;
}

.play-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(153, 102, 255, 0.6);
  border-color: #cc99ff;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(204, 153, 255, 0.1),
    transparent
  );
  animation: buttonSweep 3s linear infinite;
}

@keyframes buttonSweep {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.button-text {
  position: relative;
  z-index: 2;
  font-size: 1.5rem;
  font-weight: bold;
  color: #cc99ff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.button-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #cc99ff;
  border-radius: 50%;
  animation: particleFloat 2s ease-in-out infinite;
}

.particle:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  top: 20%;
  right: 10%;
  animation-delay: 0.25s;
}
.particle:nth-child(3) {
  bottom: 10%;
  left: 20%;
  animation-delay: 0.5s;
}
.particle:nth-child(4) {
  bottom: 20%;
  right: 20%;
  animation-delay: 0.75s;
}
.particle:nth-child(5) {
  top: 50%;
  left: 5%;
  animation-delay: 1s;
}
.particle:nth-child(6) {
  top: 50%;
  right: 5%;
  animation-delay: 1.25s;
}
.particle:nth-child(7) {
  bottom: 50%;
  left: 15%;
  animation-delay: 1.5s;
}
.particle:nth-child(8) {
  bottom: 50%;
  right: 15%;
  animation-delay: 1.75s;
}

@keyframes particleFloat {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(0px) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateY(-10px) scale(1.2);
  }
}

.controls-section {
  background: rgba(45, 22, 80, 0.7);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(153, 102, 255, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 600px;
}

.controls-section h3 {
  color: #cc99ff;
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.control-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(61, 26, 120, 0.5);
  border-radius: 8px;
  border-left: 3px solid #9966ff;
  transition: all 0.3s ease;
}

.control-item:hover {
  background: rgba(74, 44, 122, 0.7);
  border-left-color: #cc99ff;
  transform: translateX(5px);
}

.key {
  background: linear-gradient(45deg, #4a2c7a, #6642a6);
  color: #cc99ff;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  border: 1px solid #7d4cdb;
  letter-spacing: 0.1em;
}

.action {
  color: #ddccff;
  font-size: 0.95rem;
}

.mission-info {
  width: 100%;
  max-width: 500px;
}

.info-panel {
  background: rgba(45, 22, 80, 0.8);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(204, 153, 255, 0.2);
  backdrop-filter: blur(5px);
}

.info-panel h4 {
  color: #cc99ff;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.info-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-panel li {
  padding: 0.5rem 0;
  color: #bbaaee;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(153, 102, 255, 0.1);
}

.info-panel li:last-child {
  border-bottom: none;
}

.version-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
  font-size: 0.8rem;
  color: #9977cc;
  margin-top: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #cc99ff;
  border-radius: 50%;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .game-title h1 {
    font-size: 2.5rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .menu-content {
    padding: 0 1rem;
  }

  .version-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .game-title h1 {
    font-size: 2rem;
  }

  .button-text {
    font-size: 1.2rem;
  }

  .controls-section,
  .info-panel {
    padding: 1rem;
  }
}
</style>
