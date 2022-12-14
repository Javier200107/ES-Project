describe('Follow & Unfollow', () => {
  it.skip('Creo una cuenta nueva', () => {
    cy.visit('/')
    // Rellena el formulario con los 3 primeros datos del usuario
    cy.get('input[name="username"]').type('lolita');
    cy.get('input[name="email"]').type('lolita@gmail.com');
    cy.get('input[name="password"]').type('Lolita78');

    // Haz clic en el boton de enviar
    cy.get('input[type="submit"]').click();

    // Rellena el formulario con los 3 seguientes datos del usuario
    cy.get('input[name="name"]').type('Lola');
    cy.get('input[name="surname"]').type('Lolita');
    cy.get('input[name="birthdate"]').type('1997-02-09');

    // Haz clic en el boton de register
    cy.get('input[type="submit"]').click();

    // Comprueba que se haya enviado correctamente
    cy.contains('Sign in');

  })

  it('Entro con la cuenta creada, busco un usuario, lo sigo y lo dejo de seguir', () => {
    cy.visit('/login');
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('lolita');
    cy.get('input[id="password"]').type('Lolita78');

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click();

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
    cy.get('h1').should('have.text', 'mr50');

    // le doy al boton de follow
    cy.get('button[id="follow-btn"]').click();
    cy.get('button[id="follow-btn"]').should('have.text', 'unFollow');

    // compruebo que este en su lista de seguidores
    cy.get('p').contains('Followers').click();
    cy.get('span[id="username-follow"]').should('have.text', 'lolita').click();

    // compruebo que este en mi lista de seguidos
    cy.get('p').contains('Followings').click();
    cy.get('span[id="username-follow"]').should('have.text', 'mr50').click();

    // lo dejo de seguir y hago la comprobacion
    cy.get('button[id="follow-btn"]').click();
    cy.get('button[id="follow-btn"]').should('have.text', 'Follow');

  })

})
