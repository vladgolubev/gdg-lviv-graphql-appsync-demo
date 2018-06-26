import gql from "graphql-tag";

export default gql(`
subscription($questionId: String!) {
  subscribeToQuestionComments(questionId: $questionId) {
    questionId
    commentId
  }
}`);
