describe('Post', () => {
  it('Entro con una cuenta existente y hago un post', () => {
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

    // Hago un post
    cy.get('input[name="postText"').type('Hello World!')
    cy.get('input[type="submit"]').click()

    // Compruebo que se haya subido correctamente
    cy.get('div[id="post-mr50"]')
      .find('p').should('have.text', 'Hello World!')
  })
})
