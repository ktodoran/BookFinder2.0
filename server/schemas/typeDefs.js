const { gql } = require('apollo-server-express');

const typeDefs = gql `

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: savedBook): User
    removeBook(bookId: String!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input savedBook {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

`;

module.exports = typeDefs;