describe('template spec', () => {
    let user;

    before(() => {
        user = Cypress.env('USER')
      })

  it.only('passes', () => {
    cy.visit('http://localhost:5173/');

    cy.wait(3000);

    cy.get('a.layout-topbar-logo').click();

    cy.url().should('include', '/login');
    
    it.only('can be accessed within test.', () => {
        cy.log(user)
    })

    cy.get('input[placeholder="User"]').type(user);
    cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
    
    cy.get('input[placeholder="Password"]').focus().blur();
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
  })
})
