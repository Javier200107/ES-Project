describe('Delete accounts', () => {
  it('Delete mr50', () => {
    cy.visit('/')
    cy.contains('Log in').click()
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('mr50')
    cy.get('input[id="password"]').type('Mr345678')

    cy.wait(1000)

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click()

    cy.wait(1000)

    // Comprueba que se haya enviado correctamente
    cy.contains('Home')

    // Elimino la cuenta
    cy.get('strong[id="user-menu"]').click()
    cy.contains('Delete account').click()
    cy.contains('Yes').click()

    cy.contains('Log in')
  })

  it('Delete rinko', () => {
    cy.visit('/')
    cy.contains('Log in').click()
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('rinko')
    cy.get('input[id="password"]').type('Rinko678')

    cy.wait(1000)

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click()

    cy.wait(1000)

    // Comprueba que se haya entrado correctamente
    cy.contains('Home')

    // Elimino la cuenta
    cy.get('strong[id="user-menu"]').click()
    cy.contains('Delete account').click()
    cy.contains('Yes').click()

    cy.contains('Log in')
  })

  it('Delete epera', () => {
    cy.visit('/')
    cy.contains('Log in').click()
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('epera')
    cy.get('input[id="password"]').type('Epera678')

    cy.wait(1000)

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click()

    cy.wait(1000)

    // Comprueba que se haya entrado correctamente
    cy.contains('Home')

    // Elimino la cuenta
    cy.get('strong[id="user-menu"]').click()
    cy.contains('Delete account').click()
    cy.contains('Yes').click()

    cy.contains('Log in')
  })
})
