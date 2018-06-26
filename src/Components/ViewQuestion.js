import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import QueryGetQuestion from "../GraphQL/QueryGetQuestion";
import QuestionComments from "./QuestionComments";

class ViewQuestion extends Component {
  render() {
    const { question, loading } = this.props;

    return (
      <div
        className={`ui container raised very padded segment ${
          loading ? "loading" : ""
        }`}
      >
        <Link to="/" className="ui button">
          Back to the questions
        </Link>
        <div className="ui items">
          <div className="item">
            {question && (
              <div className="content">
                <div className="header">{question.name}</div>
                <div className="extra">
                  <QuestionComments questionId={question.id} comments={question.comments} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const ViewQuestionWithData = graphql(QueryGetQuestion, {
  options: ({
    match: {
      params: { id }
    }
  }) => ({
    variables: { id },
    fetchPolicy: "cache-and-network"
  }),
  props: ({ data: { getQuestion: question, loading } }) => ({
    question,
    loading
  })
})(ViewQuestion);

export default ViewQuestionWithData;
