<script setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

const emit = defineEmits(["animation-complete"]);

const canvas = ref(null);
const containerRef = ref(null);
const showScrollInstruction = ref(false);
const showWelcomeText = ref(false);

let scene, camera, renderer, model, scrollTriggerInstance, scrollTimeline;
let textsHidden = false; // Controlar se os textos foram escondidos
let animationCompleted = false; // Prevenir múltiplas chamadas

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-0.5, 0, 4);
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(
    "/threejs/models/sci-fi_computer_room.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      setupScrollAnimation();
    },
    undefined,
    (error) => console.error("An error happened", error)
  );

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Garantir que o canvas não ultrapasse os limites
  canvas.value.style.maxWidth = "100vw";
  canvas.value.style.maxHeight = "100vh";

  animate();
}

function setupScrollAnimation() {
  // Mostrar texto de boas-vindas primeiro
  setTimeout(() => {
    showWelcomeText.value = true;

    nextTick(() => {
      gsap.fromTo(
        ".welcome-text",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
      );

      // Animar a seta de recomendação após o texto aparecer
      gsap.fromTo(
        ".fullscreen-recommendation",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    });
  }, 1000);

  // Mostrar instrução de scroll após o texto de boas-vindas
  setTimeout(() => {
    showScrollInstruction.value = true;

    nextTick(() => {
      // Agora o elemento .scroll-instruction com certeza existe!
      gsap.fromTo(
        ".scroll-instruction",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      gsap.to(".scroll-instruction", {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    });
  }, 3000);

  createScrollTrigger();
}

function createScrollTrigger() {
  // Destruir ScrollTrigger existente se houver
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
  if (scrollTimeline) {
    scrollTimeline.kill();
  }

  // Reset do estado dos textos
  textsHidden = false;

  // Detectar se é mobile para ajustar a distância de scroll
  const isMobile = window.innerWidth <= 768;
  const scrollDistance = isMobile ? window.innerHeight * 1.5 : window.innerHeight * 2;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: () => `+=${scrollDistance}`, // Ajustar altura baseado no dispositivo
      scrub: 1,
      pin: true,
      pinSpacing: true,
      refreshPriority: -1, // Prioridade para recalcular dimensões
      anticipatePin: 1, // Melhorar comportamento do pin no mobile
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Debug para mobile - pode remover depois
        if (self.progress > 0.9) {
       //   console.log('ScrollTrigger progress:', self.progress);
        }
        
        // Verificar se chegou ao final (melhor detecção para mobile)
        if (self.progress >= 0.98 && !animationCompleted) {
          animationCompleted = true;
          gsap.to(containerRef.value, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              emit("animation-complete");
              if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
              }
            },
          });
        }
        
        // Sistema bidirecional de animação dos textos
        if (self.progress > 0.02 && !textsHidden) {
          // Fazer fade-out quando scrollar para baixo
          textsHidden = true;

          // Fade-out do welcome-text
          if (showWelcomeText.value) {
            gsap.to(".welcome-text", {
              opacity: 0,
              y: -30,
              duration: 0.8,
              ease: "power2.out",
            });

            // Fade-out da seta de recomendação
            gsap.to(".fullscreen-recommendation", {
              opacity: 0,
              x: 50,
              duration: 0.6,
              ease: "power2.out",
            });
          }

          // Fade-out da scroll-instruction
          if (showScrollInstruction.value) {
            gsap.to(".scroll-instruction", {
              opacity: 0,
              y: 30,
              duration: 0.6,
              ease: "power2.out",
            });
          }
        } else if (self.progress <= 0.005 && textsHidden) {
          // Fazer fade-in quando voltar muito próximo do topo
          textsHidden = false;

          // Reaparecer welcome-text
          showWelcomeText.value = true;
          nextTick(() => {
            // Parar qualquer animação existente
            gsap.killTweensOf(".welcome-text");
            gsap.set(".welcome-text", { opacity: 0, y: -30 });

            gsap.to(".welcome-text", {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            });

            // Reaparecer seta de recomendação
            gsap.set(".fullscreen-recommendation", { opacity: 0, x: 50 });
            gsap.to(".fullscreen-recommendation", {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: 0.2,
            });
          });

          // Reaparecer scroll-instruction
          showScrollInstruction.value = true;
          nextTick(() => {
            // Parar qualquer animação existente
            gsap.killTweensOf(".scroll-instruction");
            gsap.set(".scroll-instruction", { opacity: 0, y: 30, scale: 1 });

            gsap.to(".scroll-instruction", {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                // Reativar animação de pulsação
                gsap.to(".scroll-instruction", {
                  scale: 1.1,
                  duration: 1.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "power2.inOut",
                });
              },
            });
          });
        }
      },
      onLeave: () => {
        // Fallback caso onUpdate não pegue
        completeAnimation();
      },
      onLeaveBack: () => {
        // Garantir que está visível ao voltar
        if (containerRef.value) {
          gsap.to(containerRef.value, {
            opacity: 1,
            duration: 0.3,
          });
        }
      },
    },
  });

  scrollTriggerInstance = tl.scrollTrigger;
  scrollTimeline = tl;

  // Forçar atualização das dimensões após criar o ScrollTrigger
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  tl.to(camera.position, {
    x: -0.475,
    y: 0.1,
    z: 0.2,
    duration: 2,
  }).to(
    camera.rotation,
    {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
    },
    "<"
  );

  // Adicionar callback no final da timeline para garantir conclusão
  tl.eventCallback("onComplete", () => {
    console.log('Timeline completed');
    // Pequeno delay e então completar a animação
    setTimeout(() => {
      if (containerRef.value && !animationCompleted) {
        animationCompleted = true;
        gsap.to(containerRef.value, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            emit("animation-complete");
          },
        });
      }
    }, 500);
  });
}

// Função auxiliar para completar animação (fallback)
function completeAnimation() {
  if (!animationCompleted && containerRef.value) {
    console.log('Completing animation via fallback');
    animationCompleted = true;
    gsap.to(containerRef.value, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        emit("animation-complete");
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
        }
      },
    });
  }
}

function animate() {
  if (!renderer) return;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  // Garantir que o canvas mantenha as dimensões corretas
  canvas.value.style.maxWidth = "100vw";
  canvas.value.style.maxHeight = "100vh";

  // Recriar ScrollTrigger após redimensionamento
  if (model && containerRef.value) {
    ScrollTrigger.refresh();
  }
}

onMounted(() => {
  // Garantir que o body permita scroll
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  
  init();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  
  // Restaurar overflow
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
  }
  if (scrollTimeline) {
    scrollTimeline.kill();
  }
  gsap.killTweensOf([
    camera.position,
    camera.rotation,
    containerRef.value,
    ".scroll-instruction",
    ".welcome-text",
    ".fullscreen-recommendation",
  ]);

  // Reset do estado dos textos e animação no cleanup
  textsHidden = false;
  animationCompleted = false;

  if (renderer) {
    renderer.dispose();
  }

  if (scene) {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }
});
</script>

<template>
  <div class="intro-container" ref="containerRef">
    <canvas ref="canvas"></canvas>
    <!-- Instrução de scroll -->
    <div v-if="showScrollInstruction" class="scroll-instruction">
      <div class="scroll-text">
        <p>Role para entrar e me conhecer</p>
        <div class="scroll-icon">
          <div class="scroll-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  /* Melhorar scroll no mobile */
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  outline: none;
  display: block;
}

/* Garantir funcionamento correto em tela cheia */
:fullscreen .intro-container,
:-webkit-full-screen .intro-container,
:-moz-full-screen .intro-container {
  width: 100vw;
  height: 100vh;
}

:fullscreen canvas,
:-webkit-full-screen canvas,
:-moz-full-screen canvas {
  width: 100vw;
  height: 100vh;
}

/* Prevenir scroll horizontal */
.intro-container * {
  box-sizing: border-box;
}

/* Texto de boas-vindas */
.welcome-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  color: white;
  text-align: center;
  pointer-events: none;
  max-width: 90%;
}

.welcome-text h1 {
  margin: 0 0 15px 0;
  font-size: 2.5rem;
  font-weight: 300;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
  letter-spacing: 1px;
  background: linear-gradient(45deg, #4a90e2, #7b68ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text p {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  opacity: 0.9;
  letter-spacing: 0.5px;
}

/* Recomendação de fullscreen com seta */
.fullscreen-recommendation {
  position: fixed;
  bottom: 45px;
  right: 40px;
  z-index: 100;
  color: white;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 250px;
}

.hand-drawn-arrow {
  font-size: 8rem;
  margin-top: -30px;
  margin-bottom: -60px;
  transform: rotate(90deg);
  opacity: 0.9;
  margin-left: 110px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.recommendation-text {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 300;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  opacity: 0.85;
  letter-spacing: 0.3px;
  line-height: 1.3;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scroll-instruction {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  color: white;
  text-align: center;
  pointer-events: none;
}

.scroll-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.scroll-text p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.scroll-icon {
  width: 30px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.scroll-indicator {
  width: 4px;
  height: 8px;
  background: white;
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollBounce 2s infinite;
}

@keyframes scrollBounce {
  0%,
  20% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
  .welcome-text h1 {
    font-size: 2rem;
  }

  .welcome-text p {
    font-size: 1.1rem;
  }

  .scroll-instruction {
    bottom: 30px;
  }

  .scroll-text p {
    font-size: 1rem;
  }

  .scroll-icon {
    width: 25px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .welcome-text h1 {
    font-size: 1.8rem;
  }

  .welcome-text p {
    font-size: 1rem;
  }

  .fullscreen-recommendation {
    bottom: 80px;
    right: 20px;
    max-width: 160px;
  }

  .hand-drawn-arrow {
    width: 110px;
    height: 55px;
    transform: rotate(-5deg);
  }

  .recommendation-text {
    font-size: 0.75rem;
    padding: 6px 8px;
  }
}

/* Responsividade para tablets */
@media (max-width: 768px) and (min-width: 481px) {
  .fullscreen-recommendation {
    bottom: 85px;
    right: 40px;
    max-width: 190px;
  }

  .hand-drawn-arrow {
    width: 125px;
    height: 60px;
    transform: rotate(-6deg);
  }

  .recommendation-text {
    font-size: 0.85rem;
    padding: 7px 10px;
  }
}
</style>
