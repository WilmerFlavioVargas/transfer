const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
        seedDatabase(data) {
          // Implementar la lógica para sembrar la base de datos de prueba
          return null
        }
      })

      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--disable-dev-shm-usage')
        }
        return launchOptions
      })

      // Configuración específica para entorno de desarrollo local
      if (config.env.environment === 'local') {
        config.baseUrl = 'http://localhost:3000'
      }

      return config
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});

