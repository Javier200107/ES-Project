describe('Comment post', () => {
  it('Entro con una cuenta existente y comento un post', () => {
    cy.visit('/login');
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('rinko');
    cy.get('input[id="password"]').type('Rinko678');

    cy.wait(1000);

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click();

    cy.wait(1000);

    // Comprueba que se haya entrado correctamente
    cy.contains('Home');

    // le damos al boton de comentar
    cy.get('div[id="post-mr501"]')
      .find('div[id="comment-post"]').click();

    // publicamos un comentario
    cy.get('div[id="add-comment"]')
      .find('input[id="comment-input"]').type('Bye World!');
    cy.get('div[id="add-comment"]')
      .find('input[type="submit"]').click();

    // comprobamos que se ha publicado
    cy.get('div[id="comment-rinko2"]')
      .find('p').should('have.text', 'Bye World!');

  })

})
