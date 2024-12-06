<script>
  import RFB from 'novnc-core/lib/rfb';
  
  export default {
    name: 'VNCViewer',
    mounted() {
      const container = this.$refs.vncContainer;
  
      // Create RFB object (Remote Frame Buffer protocol)
      const rfb = new RFB(container, `ws://localhost/vnc`, {
        credentials: { password: "145638" }
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
  