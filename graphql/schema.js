import pool from "../config/database.js";
import { ApolloServer } from "@apollo/server";
import { gql } from "apollo-server-express";
import {
  categoryServices,
  productServices,
  userServices,
} from "../services/index.js";
import { productController } from "../controller/index.js";
import { getProducts } from "../services/product.services.js";
import * as utils from "../utils/services.js";
// Define your GraphQL schema using gql tag
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Categories {
    id: ID!
    categoryName: String!
  }
    
  input CategoryInput {
    categoryName: String!
  }

  type Query {
    hello: String
    showUsers: [User!]!
    getUser(id: ID!): User
    showCategories: [Categories!]!
    getCategory(id: ID!): Categories
  }

  type Mutation {
    createCategory(input: CategoryInput!): Categories
    updateCategory(id: ID!, input: CategoryInput!): Categories
    deleteCategory(id: ID!): String
  }
`;

// Define resolvers for the schema
const resolvers = {
  Query: {
    hello: () => "Hello, world!",
    showUsers: async () => {
      try {
        const users = await userServices.getusers();
        return users;
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
    showCategories: async () => {
      try {
        const categories = await categoryServices.getCategories();
        return categories;
      } catch (error) {
        throw new Error("Failed to fetch categories");
      }
    },
    getCategory: async (_, { id }) => {
      try {
        const category = await categoryServices.getCategory(id);
        if (!category) {
          throw new Error("Category not found");
        }
        return category;
      } catch (error) {
        throw new Error("Failed to fetch category");
      }
    },
    getUser: async (_, { id }) => {
      try {
        const [user] = await userServices.getusers({ id: id }, "and");
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    createCategory: async (_, { input }) => {
      try {
        const {categoryName} = input;
        const newCategory = await categoryServices.createCategory(categoryName);
        console.log(newCategory)
        return newCategory;
      } catch (error) {
        throw new Error("Failed to create category");
      }
    },  
    updateCategory: async (_, { id, input }) => {
      try {
        const updatedCategory = await categoryServices.updateCategory(
          id,
          input
        );
        if (!updatedCategory) {
          throw new Error("Category not found");
        }
        return updatedCategory;
      } catch (error) {
        throw new Error("Failed to update category");
      }
    },
    deleteCategory: async (_, { id }) => {
      try {
        const deleteResult = await categoryServices.deleteCategory(id);
        if (!deleteResult) {
          throw new Error("Category not found");
        }
        return "Category successfully deleted";
      } catch (error) {
        throw new Error("Failed to delete category");
      }
    },
  },
};

// Create an Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
