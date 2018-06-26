import gql from "graphql-tag";

export default gql(`
mutation($questionId: ID! $content: String! $createdAt: String!) {
  commentOnQuestion(
    questionId: $questionId
    content: $content
    createdAt: $createdAt
  ) {
    questionId
    commentId
    content
    createdAt
  }
}`);
