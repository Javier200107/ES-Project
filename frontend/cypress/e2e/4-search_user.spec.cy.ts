describe('Search user', () => {
  it('Creo una cuenta nueva', () => {
    cy.visit('/')
    // Rellena el formulario con los 3 primeros datos del usuario
    cy.get('input[name="username"]').type('rinko');
    cy.get('input[name="email"]').type('rinko@gmail.com');
    cy.get('input[name="password"]').type('Rinko678');

    cy.wait(1000);

    // Haz clic en el boton de enviar
    cy.get('input[type="submit"]').click();

    // Rellena el formulario con los 3 seguientes datos del usuario
    cy.get('input[name="name"]').type('Ana');
    cy.get('input[name="surname"]').type('Costa');
    cy.get('input[name="birthdate"]').type('1999-07-24');

    cy.wait(1000);

    // Haz clic en el boton de register
    cy.get('input[type="submit"]').click();

    // Comprueba que se haya enviado correctamente
    cy.contains('Log in');

  })

  it('Entro con la cuenta creada y hago una busqueda de un usuario', () => {
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

    // En la navbar accedo al elemento Find Users
    cy.get('ul li').contains('Find Users').click();

    // Escribo el usuario que quiero buscar en el input
    cy.get('input[name="search-input"]').type('mr50');

    // Le doy al boton de buscar
    cy.get('div[id="search-btn"]').click();

    // Compruebo que se haya encontrado el usuario y accedo a su perfil
    cy.contains('@mr50').click();
    cy.contains('mr50');

  })

})
