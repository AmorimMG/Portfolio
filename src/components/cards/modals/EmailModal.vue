<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { RESTAPI } from '../../../service/api.js';

export default {
    props: {
        header: String
    },
    data() {
        return {
            name: '',
            email: '',
            message: '',
            toast: useToast(),
            emailVisible: ref(false),
            isHoveredMail: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.emailVisible = false;
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
    <div class="col-4 lg:col-4 xl:col-3">
    <div class="card mb-0 center" style="padding: 0; background-color: #7225d6" @mouseenter="isHoveredMail = true" @mouseleave="isHoveredMail = false">
        <Button v-tooltip.top="'Send me a Email'" @click="emailVisible = true" style="width: 100%; height: 100%; background-color: #7225d6; border: none; justify-content: center">
            <img src="../../../assets/images/Mail.png" width="50%" :class="{ lights: isHoveredMail }" />
        </Button>
    </div>
    <Dialog :visible="emailVisible" @update:visible="onHide()" :modal="true" style="min-width: 50%">
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
</div>
</template>
