import { defineConfig } from 'cypress'

export default defineConfig({

  e2e: {
    'baseUrl': 'https://enginyeriadelsoftware-f3.azurewebsites.net',
    supportFile: false
  },


  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }

})
