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
    <div class="card mb-0" style="user-select: text" @mouseenter="showImage = true" @mouseleave="showImage = false">
        <div class="mb-3" style="text-align: start; position: relative">
            <h3 :class="{ glitch: isGlitchActive }" class="center">{{ translations.gblHi }}</h3>
            <br />
            <p :class="{ glitch: isGlitchActive }" style="font-size: 18px">
                {{ translations.gblAboutMe }}
                <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggle" @mouseleave="toggle">FIAP</a>
            </p>
            <br />
            <p :class="{ glitch: isGlitchActive }" style="font-size: 15px">
                {{ translations.gblInterests }}
            </p>
            <img :class="{ 'animated-image': true, show: showImage, 'animated-image-hide': !showImage }" src="/src/assets/images/profilePic.png" alt="Image" />
        </div>
    </div>
</template>

<style scoped>
p{
    font-size: 1.2em;
    text-align: justify;
    margin: 0;
}

h3{
    font-size: 2em;
    margin: 0;
}
</style>
