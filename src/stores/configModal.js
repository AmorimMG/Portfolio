import macOSbackground from '@/assets/images/dock/macOSbackground.jpg';
import { defineStore } from 'pinia';

export const useConfigModalStore = defineStore('configModal', {
    state: () => ({
        visible: false,
        background: macOSbackground
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
