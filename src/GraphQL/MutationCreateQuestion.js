import gql from "graphql-tag";

export default gql(`
mutation($name: String!) {
  createQuestion(
    name: $name
  ) {
    id
    name
    comments {
      commentId
    }
  }
}`);
