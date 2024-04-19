import { defineNuxtPlugin } from '#app';
import translationPlugin from './translationPlugin';

export default defineNuxtPlugin((nuxtApp) => {
    const { app } = nuxtApp;
    const { $plugin } = app.config;

    $plugin(translationPlugin);
});
