<script>
import { ref } from 'vue';
import Photos from '../cards/Photos.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import Popover from 'primevue/popover';

export default {
    name: 'Introduction',
    props: {
        isGlitchActive: Boolean
    },
    components: {
        Photos,
        VueNeonLight,
        Popover
    },
    data() {
        return {
            showImage: false,
            op: ref()
        };
    },
    methods: {
        toggle(event) {
            this.$emit('toggle', event);
        }
        
    }
};
</script>

<template>
    <div class="page" style="user-select: text" @mouseenter="showImage = true" @mouseleave="showImage = false">
        <div class="flex flex-column justify-content-between m-3" style="text-align: start; position: relative">
            <div class="upper">
                <div class="flex flex-row justify-content-between m-3">
                    <div class="center flex-row gap-2"><i class="pi pi-comment"></i> About Me</div>
                    <div class="flex gap-3">
                        <i class="pi pi-discord zoom"></i>
                        <i class="pi pi-github zoom"></i>
                        <i class="pi pi-linkedin zoom"></i>
                    </div>
                </div>
                <div class="mt-3 center">
                    <VueNeonLight color="#ff00ff" size="25px" :flash="false"> {{ $t('Hi') }} </VueNeonLight>
                </div>
                <div class="text-image-container">
                    <div class="center">
                        <img class="profile-picture" src="/src/assets/images/profilePic.png" alt="Image" />
                    </div>
                    <div class="center wrap" style="max-height: 100px">
                        <p style="font-size: 14px" :class="{ glitch: isGlitchActive }">
                            {{ $t('AboutMe') }}
                            <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggle" @mouseleave="toggle">FIAP.</a>
                        </p>
                        <br />
                        <p style="font-size: 14px" :class="{ glitch: isGlitchActive }">
                            {{ $t('Interests') }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <!-- <Photos /> -->
                <div class="flex flex-row justify-content-between m-3">
                    <div class="center flex-row gap-2"><i class="pi pi-phone"></i> Contact</div>
                </div>
                <div class="flex flex-column" style="padding: 20px">
                    <p style="font-size: 14px">
                        If you want to chat, feel free to reach out to me on Twitter, or join my Discord server. You can also email me at
                        <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline">gabriel@amorim.pro</a>.
                    </p>
                </div>
                <Button type="button" icon="pi pi-exclamation-triangle" label="Report a Bug" @click="toggle" />
            </div>
        </div>
    </div>
    <Popover ref="op">
        <div class="flex flex-col gap-4 w-[25rem]">
            <h5>Report a Bug</h5>
            <p>If you find a bug on my website, please report it to me. I will do my best to fix it as soon as possible. Thank you for your help!</p>
            <InputTextarea v-model="bug" rows="5" placeholder="Please describe the bug you found..." />
            <Button type="button" label="Send" @click="sendBugReport" />
        </div>
    </Popover>
</template>

<style scoped>
p {
    font-size: 1.2em;
    text-align: justify;
    margin: 0;
}

h5 {
    font-size: 1.5em;
    margin: 0;
}

.zoom:hover {
    opacity: 1 !important;
    animation: none;
    cursor: pointer;
    transform: scale(2);
    color: #ff00ff;
}

.page {
    width: 100%;
    height: 100vh !important;
    aspect-ratio: 2 / 1;
    padding: 0;
    max-height: none;
    background-color: #260d3d;
    border: 2px solid transparent;
    box-shadow: 0 0 5px #ff00ff;
}

.text-image-container {
    display: flex;
    padding: 20px;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.profile-picture {
    border: 2px solid transparent;
    box-shadow: 0 0 5px #ff00ff;
    margin-right: 10px;
    max-width: 120px;
    height: auto;
    width: 120px;
}

@media (max-width: 400px) {
    .text-image-container {
        flex-direction: column;
        align-items: center;
    }

    .wrap {
        max-height: none;
        text-align: center;
    }

    .profile-picture {
        margin-bottom: 20px;
    }
}
</style>
