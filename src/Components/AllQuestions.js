import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import QueryAllQuestions from "../GraphQL/QueryAllQuestions";
import SubsriptionQuestions from "../GraphQL/SubsriptionQuestions";
import NewQuestion from "./NewQuestion";

class AllQuestions extends Component {
  subscription;

  static defaultProps = {
    questions: []
  };

  componentDidMount() {
    this.subscription = this.props.subscribeToQuestions();
  }

  componentWillUnmount() {
    this.subscription();
  }

  renderQuestion = question => (
    <Link to={`/questions/${question.id}`} className="card" key={question.id}>
      <div className="content">
        <div className="header">{question.name}</div>
      </div>
      <div className="extra content">
        <i className="icon comment" /> {question.comments.length} comments
      </div>
    </Link>
  );

  render() {
    const { questions } = this.props;

    return (
      <div>
        <div className="ui clearing basic segment">
          <h1 className="ui header left floated">GDG Lviv: All Questions</h1>
        </div>
        <NewQuestion />
        <div className="ui link cards">
          {[]
            .concat(questions)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(this.renderQuestion)}
        </div>
      </div>
    );
  }
}

export default graphql(QueryAllQuestions, {
  options: {
    fetchPolicy: "network-only"
  },
  props: props => {
    const { data } = props;
    const { listQuestions  } = data;

    return {
      questions: listQuestions,
      subscribeToQuestions: () => {
        return props.data.subscribeToMore({
          document: SubsriptionQuestions,
          updateQuery: (
            prev,
            {
              subscriptionData: {
                data: { subscribeToQuestions: newQuestionFromSubscription }
              }
            }
          ) => {
            return {
              ...prev,
              listQuestions: [
                ...prev.listQuestions.filter(
                  e => e.id !== newQuestionFromSubscription.id
                ),
                newQuestionFromSubscription
              ]
            };
          }
        });
      }
    };
  }
})(AllQuestions);
