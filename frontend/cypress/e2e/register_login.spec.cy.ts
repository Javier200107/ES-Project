describe('Register and login', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Join Share.It today')
  })

  it('Deberia poder registrarme', () => {
    cy.visit('/')
    // Rellena el formulario con los 3 primeros datos del usuario
    cy.get('input[name="username"]').type('mr50');
    cy.get('input[name="email"]').type('mr50@gmail.com');
    cy.get('input[name="password"]').type('Mr345678');

    // Haz clic en el boton de enviar
    cy.get('input[type="submit"]').click();

    // Rellena el formulario con los 3 seguientes datos del usuario
    cy.get('input[name="name"]').type('Marc');
    cy.get('input[name="surname"]').type('Ramirez');
    cy.get('input[name="birthdate"]').type('2000-05-12');

    // Haz clic en el boton de register
    cy.get('input[type="submit"]').click();

    // Comprueba que se haya enviado correctamente
    cy.contains('Sign in');

  })

  it('Deberia poder hacer login', () => {
    cy.visit('/login')
    // Rellena el formulario con los datos necesarios
    cy.get('input[id="usuari"]').type('mr50');
    cy.get('input[id="password"]').type('Mr345678');

    // Haz clic en el boton de login
    cy.get('button[id="login-btn"]').click();

    // Comprueba que se haya enviado correctamente
    cy.contains('Home');

  })
})
