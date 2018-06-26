import React, { Component } from "react";
import { graphql } from "react-apollo";
import QueryGetQuestion from "../GraphQL/QueryGetQuestion";
import SubsriptionQuestionComments from "../GraphQL/SubsriptionQuestionComments";
import NewComment from "./NewComment";

class QuestionComments extends Component {
  subscription;

  componentDidMount() {
    this.subscription = this.props.subscribeToComments();
  }

  componentWillUnmount() {
    this.subscription();
  }

  renderComment = comment => {
    return (
      <div className="comment" key={comment.commentId}>
        <div className="avatar">
          <i className="icon user circular" />
        </div>
        <div className="content">
          <div className="text">{comment.content}</div>
          <div className="metadata">
            {new Date(comment.createdAt).toGMTString()}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { comments, questionId } = this.props;

    return (
      <div className="ui items">
        <div className="item">
          <div className="ui comments">
            <h4 className="ui dividing header">Comments</h4>
            {[]
              .concat(comments)
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
              .map(this.renderComment)}
            <NewComment questionId={questionId} />
          </div>
        </div>
      </div>
    );
  }
}

const QuestionCommentsWithData = graphql(QueryGetQuestion, {
  options: ({ questionId: id }) => ({
    fetchPolicy: "cache-first",
    variables: { id }
  }),
  props: props => {
    return {
      comments: props.data.getQuestion ? props.data.getQuestion.comments : [],
      subscribeToComments: () =>
        props.data.subscribeToMore({
          document: SubsriptionQuestionComments,
          variables: {
            questionId: props.ownProps.questionId
          },
          updateQuery: (
            prev,
            {
              subscriptionData: {
                data: { subscribeToQuestionComments }
              }
            }
          ) => {
            return {
              ...prev,
              getQuestion: {
                ...prev.getQuestion,
                comments: [
                  ...prev.getQuestion.comments.filter(
                    c => c.commentId !== subscribeToQuestionComments.commentId
                  ),
                  subscribeToQuestionComments
                ]
              }
            };
          }
        })
    };
  }
})(QuestionComments);

export default QuestionCommentsWithData;
