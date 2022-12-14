describe('Post', () => {
  it('Entro con una cuenta existente y hago un post', () => {
    cy.visit('/')
    cy.contains('Log in').click()
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('rinko')
    cy.get('input[id="password"]').type('Rinko678')

    cy.wait(1000)

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click()

    cy.wait(1000)

    // Comprueba que se haya enviado correctamente
    cy.contains('Home')

    // le damos al boton de like
    cy.get('div[id="post-mr50"]')
      .find('div[id="like"]').click()

    // Voy a la pagina de perfil
    cy.get('strong[id="user-menu"]').click()
    cy.contains('Profile').click()

    // Compruebo que esté en la lista de archivados
    cy.contains('Liked posts').click()
    cy.get('div[id="post-mr50"]')
      .find('p').should('have.text', 'Hello World!')
  })
})
