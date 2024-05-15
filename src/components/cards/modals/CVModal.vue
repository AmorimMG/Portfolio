<script>
export default {
    props: {
        visible: Boolean,
        header: String
    },
    methods: {
        onHide() {
            this.$emit('close');
        },
        downloadIframeContent(iframeId) {
            var iframe = document.getElementById(iframeId);

            if (!iframe) {
                console.error('Iframe not found');
                return;
            }

            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            if (!iframeDoc) {
                console.error('Cannot access iframe document');
                return;
            }

            var blob = new Blob([iframeDoc.documentElement.outerHTML], { type: 'text/html' });

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'iframe_content.html';

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                {{ header }}
            </div>
            <Button @click="downloadIframeContent('iframe')">Download PDF</Button>
        </template>
        <div class="popup-content" style="height: 100%">
            <iframe id="iframe" class="iframe" :ref="iframe" src="https://www.amorim.pro/cv" scrolling="auto"></iframe>
        </div>
    </Dialog>
</template>
