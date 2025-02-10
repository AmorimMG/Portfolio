import { defineStore } from "pinia";

export const useConfigModalStore = defineStore("configModal", {
	state: () => ({
		visible: false,
		background: "https://primefaces.org/cdn/primevue/images/dock/window.jpg",
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
		},
	},
});
