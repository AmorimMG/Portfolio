<script>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import CardEffect from '../../CardEffect.vue';
import Projects from '../../Projects.vue';

import Portfolio from '../../../assets/images/projects/Portfolio.png';
import PortfolioAPI from '../../../assets/images/projects/PortfolioAPI.png';
import WhatsappClone from '../../../assets/images/projects/WhatsappClone.png';
import Ecommerce from '../../../assets/images/projects/Ecommerce.png';
import Snake from '../../../assets/images/projects/Snake.png';
import InstagramClone from '../../../assets/images/projects/InstagramClone.png';
import DinoClone from '../../../assets/images/projects/DinoClone.png';
import NetflixClone from '../../../assets/images/projects/NetflixClone.png';
import RAWG from '../../../assets/images/projects/RAWG.png';
import DiscordAwards from '../../../assets/images/projects/DiscordAwards2.png';
import RPG from '../../../assets/images/projects/RPG.png';
import JogoDaVelha from '../../../assets/images/projects/JogoDaVelha.png';

export default {
    components: {
        CardEffect,
        Projects,
        draggable
    },
    data() {
        return {
            projectsVisible: ref(false),
            projects: ref([
                {
                    id: 1,
                    img: Portfolio,
                    title: 'Creative Tim',
                    subtitle: 'Creative Tim',
                    description: 'Creative Tim is a design agency specialized in creating beautiful UI/UX design and themes.'
                },
                {
                    id: 2,
                    img: PortfolioAPI,
                    title: 'PrimeVue',
                    subtitle: 'PrimeTek',
                    description: 'PrimeVue is a popular UI Component Suite for Vue featuring 80+ components.'
                },
                {
                    id: 3,
                    img: WhatsappClone,
                    title: 'PrimeFaces',
                    subtitle: 'PrimeTek',
                    description: 'PrimeFaces is a popular UI Component Suite for JSF featuring 100+ components.'
                },
                {
                    id: 4,
                    img: Ecommerce,
                    title: 'PrimeFlex',
                    subtitle: 'PrimeTek',
                    description: 'PrimeFlex is a lightweight responsive CSS utility library.'
                },
                {
                    id: 5,
                    img: Snake,
                    title: 'Serenity',
                    subtitle: 'PrimeTek',
                    description: 'Serenity is a premium application template.'
                },
                {
                    id: 6,
                    img: InstagramClone,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 7,
                    img: DinoClone,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 8,
                    img: NetflixClone,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 9,
                    img: RAWG,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 10,
                    img: DiscordAwards,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 11,
                    img: RPG,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                },
                {
                    id: 12,
                    img: JogoDaVelha,
                    title: 'Modern',
                    subtitle: 'PrimeTek',
                    description: 'Modern is a premium application template.'
                }
            ])
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.projectsVisible = false;
        }
    }
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button @click="projectsVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <h2 :class="{ glitch: isGlitchActive }" style="color: white">Projects</h2>
                </Button>
            </div>
        </CardEffect>
        <Dialog :visible="projectsVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">AmorimMG</div>
            </template>
            <div class="popup-content">
                <draggable class="grid" v-model="projects" item-key="id" group="projects" animation="200">
                    <template #item="{ element }">
                        <Projects class="center col-4" :img="element.img" :title="element.title" :subtitle="element.subtitle" :description="element.description" />
                    </template>
                </draggable>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.zoom-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    gap: 10px;
}

.iframe-container {
    width: 100%;
    height: 100%;
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
}

.popup-content {
    overflow-x: hidden;
}

.p-dialog-content {
    padding: 0;
    overflow-x: hidden;
}

.grid {
    padding: 50px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
