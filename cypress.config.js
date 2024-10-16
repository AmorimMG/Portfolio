const { defineConfig } = require("cypress");
require('dotenv').config(); 

module.exports = defineConfig({
  projectId: '1vbejw',
  env: {
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
