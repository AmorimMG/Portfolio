<script>
import Dialog from 'primevue/dialog';
import ModalHeader from '../Modals/ModalHeader.vue';

export default {
    name: 'CustomDialog',
    components: {
        Dialog,
        ModalHeader
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        style: {
            type: Object,
            default: () => ({})
        },
        contentStyle: {
            type: Object,
            default: () => ({})
        },
        modal: {
            type: Boolean,
            default: true
        },
        closable: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        header: {
            type: String,
            default: ''
        },
        footer: {
            type: String,
            default: ''
        },
        maximized: {
            type: Boolean,
            default: true
        },
        breakpoints: {
            type: Object,
            default: () => ({ '1199px': '75vw', '575px': '90vw' })
        },
        unstyled: {
            type: Boolean,
            default: true
        },
        class: {
            type: String,
            default: 'dialog-terminal'
        }
    },
    emits: ['update:visible'],
    computed: {
        dialogClass() {
            return this.maximized ? `${this.class} p-dialog-maximized` : this.class;
        },
        mergedStyle() {
            const defaultStyle = {
                width: '80%',
                height: '80%',
                overflowY: 'none',
                backgroundColor: 'var(--surface-ground)'
            };
            return {
                ...defaultStyle,
                ...this.style
            };
        },
        mergedContentStyle() {
            const defaultContentStyle = {
                width: '100%',
                height: '100%',
                overflowY: 'auto'
            };

            return {
                ...defaultContentStyle,
                ...this.contentStyle
            };
        }
    },
    methods: {
        handleVisibilityChange(newVisibility) {
            this.$emit('update:visible', newVisibility);
        },
        onMaximize() {
            const dialogElement = document.querySelector('.dialog-terminal');
            if (dialogElement.classList.contains('p-dialog-maximized')) {
                dialogElement.classList.remove('p-dialog-maximized');
            } else {
                dialogElement.classList.add('p-dialog-maximized');
            }
        },
        closeModal() {
            this.$emit('update:visible', false);
        }
    }
};
</script>

<template>
    <Dialog v-if="visible" v-bind="$props" :style="mergedStyle" :contentStyle="mergedContentStyle" :visible="visible"
        @update:visible="handleVisibilityChange" @hide="closeModal">
        <template #header>
            <ModalHeader @maximize="onMaximize" @close="closeModal" />
        </template>
        <slot></slot>
    </Dialog>
</template>

<style></style>
