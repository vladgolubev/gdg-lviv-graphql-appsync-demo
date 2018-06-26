import gql from "graphql-tag";

export default gql(`
query {
  listQuestions {
    id
    name
    comments {
      commentId
    }
  }
}`);
