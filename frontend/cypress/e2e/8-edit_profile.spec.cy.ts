describe('Edit profile', () => {
  it('Entro con una cuenta existente y edito el perfil', () => {
    cy.visit('/')
    cy.contains('Log in').click();
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('lolita');
    cy.get('input[id="password"]').type('Lolita78');

    cy.wait(1000);

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click();

    cy.wait(1000);

    // Comprueba que se haya entrado correctamente
    cy.contains('Home');

    // Voy a la pagina de perfil
    cy.get('strong[id="user-menu"]').click();
    cy.contains('Profile').click();

    // le damos al boton de editar perfil
    cy.get('p-button').click();

    // cargamos una foto de perfil
    cy.get('p-dialog')
      .get('input[type="file"]')

    // cambiamos username
    cy.get('p-dialog')
      .find('input[id="username"]').type('epera');

    // cambiamos password
    cy.get('p-dialog')
      .find('input[id="password"]').type('Epera678');

    // cambiamos email
    cy.get('p-dialog')
      .find('input[id="email"]').type('epera@gmail.com');

    // cambiamos name
    cy.get('p-dialog')
      .find('input[id="name"]').type('Estela');

    // cambiamos surname
    cy.get('p-dialog')
      .find('input[id="surname"]').type('Pera');

    // cambiamos birthdate
    cy.get('p-dialog')
      .find('input[id="birthdate"]').type('2000-10-31');

    cy.wait(1000);

    cy.get('p-button[label="Apply"]').click();

    cy.contains('Yes').click();

    cy.wait(1000);

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click();

    // Comprueba que se haya entrado correctamente
    cy.contains('Home');

    // Voy a la pagina de perfil
    cy.get('strong[id="user-menu"]').click();
    cy.contains('Profile').click();

    // le damos al boton de editar perfil
    cy.get('p-button').click();

    // cambiamos username
    cy.get('p-dialog')
      .find('input[id="username"]').should('have.attr', 'placeholder', 'epera');

    // cambiamos email
    cy.get('p-dialog')
      .find('input[id="email"]').should('have.attr', 'placeholder', 'epera@gmail.com');

    // cambiamos name
    cy.get('p-dialog')
      .find('input[id="name"]').should('have.attr', 'placeholder', 'Estela');

    // cambiamos surname
    cy.get('p-dialog')
      .find('input[id="surname"]').should('have.attr', 'placeholder', 'Pera');

    // cambiamos birthdate
    cy.get('p-dialog')
      .find('p[id="birthdate-saved"]').should('have.text', ': 2000-10-31');

  })

})
