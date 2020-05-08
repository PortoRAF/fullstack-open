// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('addUser', (name, username, password) => {
  cy.request({
    url: 'http://localhost:3001/api/users',
    method: 'POST',
    body: { name, username, password }
  })
})

Cypress.Commands.add('addBlog', (title, author, url) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('BloglistLoggedUser')).token}`
    }
  })
})

Cypress.Commands.add('login', (username, password) => {
  cy
    .request({
      url: 'http://localhost:3001/api/login',
      method: 'POST',
      body: { username, password }
    })
    .then((response) => {
      localStorage.setItem('BloglistLoggedUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
})

Cypress.Commands.add('generateLikes', () => {
  cy
    .request({
      url: 'http://localhost:3001/api/blogs',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('BloglistLoggedUser')).token}`
      }
    })
    .then((response) => {
      let likes = 1
      response.body.forEach(blog => {
        cy.request({
          url: `http://localhost:3001/api/blogs/${blog.id}`,
          method: 'PUT',
          body: { likes: likes++ },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('BloglistLoggedUser')).token}`
          }
        })
      })
      cy.visit('http://localhost:3000')
    })
})
