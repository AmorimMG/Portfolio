import { defineStore } from 'pinia';

export const useWallpaperStore = defineStore('wallpaper', {
    state: () => ({
        visible: false,
        background: 'https://raw.githubusercontent.com/AmorimMG/cdn/main/uploads/wallpaper5.png'
    }),
    actions: {
        toggle() {
            this.visible = !this.visible;
        },
        setVisible(value) {
            this.visible = value;
        },
        setBackground(value) {
            this.background = value;
        },
        getBackground() {
            return this.background;
        }
    }
});
