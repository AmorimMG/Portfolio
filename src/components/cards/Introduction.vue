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
   <div class="col-12 lg:col-12 xl:col-6"> 
    <div class="card page" style="user-select: text" @mouseenter="showImage = true" @mouseleave="showImage = false">
        <div class="mb-3" style="text-align: start; position: relative">
            <div style="padding: 20px;">
            <h5 :class="{ glitch: isGlitchActive }" class="center">{{ translations.gblHi }}</h5>
            <br />
            <p :class="{ glitch: isGlitchActive }" style="font-size: 15px">
                {{ translations.gblAboutMe }}
                <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggle" @mouseleave="toggle">FIAP</a>
            </p>
            <br />
            <p :class="{ glitch: isGlitchActive }" style="font-size: 14px">
                {{ translations.gblInterests }}
            </p>
            <img :class="{ 'animated-image': true, show: showImage, 'animated-image-hide': !showImage }" src="/src/assets/images/profilePic.png" alt="Image" />
        </div>
    </div>
    </div>
</div> 
</template>

<style scoped>

.page{
    width: 100%;
    height: 100% !important;
    aspect-ratio: 2 / 1;
    padding: 0;
}

p{
    font-size: 0.5em;
    text-align: justify;
    margin: 0;
}

h5{
    font-size: 1.5em;
    margin: 0;
}
</style>
