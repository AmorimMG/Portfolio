<script>
export default {
    name: 'Introduction',
    props: {
        translations: Object,
        isGlitchActive: Boolean
    },
    data() {
        return {
            showImage: false
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
        <div class="mb-3" style="text-align: start; position: relative">
            <div class="flex" style="padding: 20px">
                <div>
                    <img class="profile-picture" src="/src/assets/images/profilePic.png" alt="Image" />
                </div>
                <div class="mb-3">
                    <h5 :class="{ glitch: isGlitchActive }" class="center">{{ translations.gblHi }}</h5>
                    <br />
                    <p :class="{ glitch: isGlitchActive }">
                        {{ translations.gblAboutMe }}
                        <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggle" @mouseleave="toggle">FIAP</a>
                    </p>
                    <br />
                    <p :class="{ glitch: isGlitchActive }">
                        {{ translations.gblInterests }}
                    </p>
                </div>
            </div>
            <div class="flex flex-column" style="padding: 20px">
                <div>
                    <h5>Titulo</h5>
                </div>
                <p>Texto</p>
            </div>
            <div class="flex flex-column" style="padding: 20px">
                <div>
                    <h5>Titulo</h5>
                </div>
                <p>Texto</p>
            </div>
            <div class="flex flex-column" style="padding: 20px">
                <div>
                    <h5>Titulo</h5>
                </div>
                <p>Texto</p>
            </div>
            <div class="flex flex-column" style="padding: 20px">
                <div>
                    <h5>Titulo</h5>
                </div>
                <p>Texto</p>
            </div>
            <div class="flex flex-column" style="padding: 20px">
                <div>
                    <h5>Titulo</h5>
                </div>
                <p>Texto</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    height: 100% !important;
    aspect-ratio: 2 / 1;
    padding: 0;
    max-height: none;
    background-color: #260d3d;
}

p {
    font-size: 1.2em;
    text-align: justify;
    margin: 0;
}

h5 {
    font-size: 1.5em;
    margin: 0;
}

.profile-picture {
    width: 180px;
    border: solid 1px purple;
    margin-right: 10px;
}
</style>
