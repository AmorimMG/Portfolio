<template>
    <div class="status-bar">
      <span>UTF-8</span>
      <span>Spaces: 2</span>
      <span>JavaScript</span>
    </div>
  </template>
  
  <style scoped>
  .status-bar {
    display: flex;
    justify-content: space-between;
    background-color: #007acc;
    color: white;
    padding: 5px;
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
  </style>
  