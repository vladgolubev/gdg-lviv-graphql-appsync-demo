import React, { Component } from "react";
import { graphql } from "react-apollo";
import { v4 as uuid } from "uuid";
import MutationCommentOnQuestion from "../GraphQL/MutationCommentOnQuestion";
import QueryGetQuestion from "../GraphQL/QueryGetQuestion";

class NewComment extends Component {
  static defaultProps = {
    createComment: () => null
  };

  static defaultState = {
    comment: {
      content: ""
    },
    loading: false
  };

  state = NewComment.defaultState;

  handleSubmit = async e => {
    e.stopPropagation();
    e.preventDefault();
    const { comment } = this.state;
    const { questionId, createComment } = this.props;

    this.setState({ loading: true });

    await createComment({
      ...comment,
      questionId,
      createdAt: new Date().toISOString()
    });

    this.setState(NewComment.defaultState);
  };

  handleChange = ({ target: { value: content } }) => {
    this.setState({ comment: { content } });
  };

  render() {
    const { comment, loading } = this.state;
    return (
      <form className="ui reply form">
        <div className="field">
          <textarea
            value={comment.content}
            onChange={this.handleChange}
            disabled={loading}
          />
        </div>
        <button
          className={`ui blue labeled submit icon button ${
            loading ? "loading" : ""
          }`}
          disabled={loading}
          onClick={this.handleSubmit}
        >
          <i className="icon edit" />
          Add Comment
        </button>
      </form>
    );
  }
}

const NewCommentWithData = graphql(MutationCommentOnQuestion, {
  options: props => ({
    update: (proxy, { data: { commentOnQuestion } }) => {
      const query = QueryGetQuestion;
      const variables = { id: commentOnQuestion.questionId };
      const data = proxy.readQuery({ query, variables });

      data.getQuestion = {
        ...data.getQuestion,
        comments: [
          ...data.getQuestion.comments.filter(
            c => c.commentId !== commentOnQuestion.commentId
          ),
          commentOnQuestion
        ]
      };

      proxy.writeQuery({ query, data });
    }
  }),
  props: props => ({
    createComment: comment => {
      return props.mutate({
        variables: { ...comment },
        optimisticResponse: {
          commentOnQuestion: {
            ...comment,
            __typename: "Comment",
            commentId: uuid()
          }
        }
      });
    }
  })
})(NewComment);

export default NewCommentWithData;
