describe('Blog List app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    cy.addUser('Renato Porto', 'rporto', '1q2w3e$')
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function () {
    cy.contains('login').click()

    cy.contains('application login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()

      cy.get('input#username')
        .type('rporto')

      cy.get('input#password')
        .type('1q2w3e$')

      cy.get('#user-login-btn')
        .click()

      cy.contains('Renato Porto logged in')
      cy.contains('logout')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()

      cy.get('input#username')
        .type('rporto')

      cy.get('input#password')
        .type('wrong')

      cy.get('#user-login-btn')
        .click()

      cy.get('.error')
        .should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.contains('wrong username or password')
      cy.contains('application login')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login('rporto', '1q2w3e$')
    })

    it('new blog form appears', function () {
      cy.contains('add blog').click()

      cy.contains('title')
      cy.contains('author')
      cy.contains('url')
      cy.contains('submit')
    })

    it('a blog can be created', function () {
      cy.contains('add blog').click()

      cy.get('#title')
        .type('Cypress blog title')

      cy.get('#author')
        .type('Cypress blog author')

      cy.get('#url')
        .type('Cypress blog url')

      cy.contains('submit')
        .click()

      cy.contains('blog Cypress blog title by Cypress blog author added')
    })

    describe('when there are already blogs added', function () {
      beforeEach(function () {
        cy.addBlog('First title', 'First author', 'First url')
        cy.addBlog('Second title', 'Second author', 'Second url')
        cy.addBlog('Third title', 'Third author', 'Third url')
        cy.visit('http://localhost:3000')
      })

      it('user can like a blog', function () {
        cy.contains('Second title')
          .contains('view')
          .click()
          .parent()
          .contains('like')
          .click()
      })

      it('user can delete a blog', function () {
        cy.contains('Second title')
          .contains('view')
          .click()
          .parent()
          .contains('remove')
          .click()

        cy.get('.success')
          .should('have.css', 'color', 'rgb(0, 128, 0)')

        cy.contains('removed blog')
      })

      it.only('blogs are displayed ordered by their like count', function () {
        cy.generateLikes()

        cy
          .get('.blog')
          .first()
          .should('contain', 'Third title')
          .next()
          .should('contain', 'Second title')
          .next()
          .should('contain', 'First title')
      })
    })
  })

})
