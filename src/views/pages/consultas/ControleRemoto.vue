<script>
  import RFB from 'novnc-core/lib/rfb';
  
  export default {
    name: 'VNCViewer',
    mounted() {
      const container = this.$refs.vncContainer;
  
      // Create RFB object (Remote Frame Buffer protocol)
      const rfb = new RFB(container, `ws://${process.env.VUE_APP_BACKEND_URL}/vnc`, {
        credentials: { password: "YOUR_VNC_PASSWORD" }
      });
  
      // Optionally handle events
      rfb.addEventListener('connect', () => console.log('Connected to VNC server'));
      rfb.addEventListener('disconnect', () => console.log('Disconnected from VNC server'));
    }
  };
  </script>
  
<template>
    <div ref="vncContainer" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>
</style>
  