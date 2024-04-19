<script>
import { RESTAPI } from '../../../service/api.js';
import { useToast } from 'primevue/usetoast';

export default {
    props: {
        visible: Boolean,
        header: String
    },
    data() {
        return {
            name: '',
            email: '',
            message: '',
            toast: useToast()
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
        },
        async sendEmail() {
            const body = {
                name: this.name,
                email: this.email,
                message: this.message
            };

            RESTAPI.EnviarEmail(body)
                .then((response) => {
                    if (response.ok) {
                        this.toast.add('Email sent successfully');
                        this.name = '';
                        this.email = '';
                        this.message = '';
                    } else {
                        this.toast.add('Failed to send email');
                    }
                })
                .catch((error) => {
                    this.toast.add({
                        severity: 'error',
                        summary: error,
                        life: 3000
                    });
                });
        }
    }
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="onHide()" :modal="true">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">Contact Form</div>
        </template>
        <div class="popup-content" style="width: 100%">
            <form @submit.prevent="sendEmail">
                <div class="p-fluid">
                    <div class="p-field col">
                        <FloatLabel>
                            <InputText id="name" v-model="name" required />
                            <label for="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <FloatLabel>
                            <InputText id="email" type="email" v-model="email" required />
                            <label for="email">Email</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <FloatLabel>
                            <Textarea id="message" v-model="message" rows="5" required />
                            <label for="message">Message</label>
                        </FloatLabel>
                    </div>
                    <div class="p-field col">
                        <Button type="submit" label="Submit" />
                    </div>
                </div>
            </form>
        </div>
    </Dialog>
</template>
