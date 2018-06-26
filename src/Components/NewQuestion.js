import React, { Component } from "react";
import { v4 as uuid } from "uuid";
import { graphql } from "react-apollo";
import QueryAllQuestions from "../GraphQL/QueryAllQuestions";
import QueryGetQuestion from "../GraphQL/QueryGetQuestion";
import MutationCreateQuestion from "../GraphQL/MutationCreateQuestion";

class NewQuestion extends Component {
  static defaultProps = {
    createQuestion: () => null
  };

  state = {
    question: {
      name: ""
    }
  };

  handleChange(
    field,
    {
      target: { value }
    }
  ) {
    const { question } = this.state;

    question[field] = value;

    this.setState({ question });
  }

  handleSave = async e => {
    e.stopPropagation();
    e.preventDefault();

    const { createQuestion } = this.props;
    const { question } = this.state;

    await createQuestion({ ...question });
    this.setState({ question: { name: "" } });
  };

  render() {
    const { question } = this.state;

    return (
      <div className="ui container raised very padded segment">
        <h1 className="ui header">New Question</h1>
        <div className="ui form">
          <div className="field required eight">
            <label htmlFor="name">Title</label>
            <input
              type="text"
              id="name"
              value={question.name}
              onChange={this.handleChange.bind(this, "name")}
            />
          </div>
          <div className="ui buttons">
            <button className="ui positive button" onClick={this.handleSave}>
              Post
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(MutationCreateQuestion, {
  options: {
    fetchPolicy: "network-only"
  },
  props: props => ({
    createQuestion: question => {
      return props.mutate({
        update: (proxy, { data: { createQuestion } }) => {
          // Update QueryAllQuestions
          const query = QueryAllQuestions;
          const data = proxy.readQuery({ query });

          data.listQuestions = [
            ...data.listQuestions.filter(e => e.id !== createQuestion.id),
            createQuestion
          ];

          proxy.writeQuery({ query, data });

          // Create cache entry for QueryGetQuestion
          const query2 = QueryGetQuestion;
          const variables = { id: createQuestion.id };
          const data2 = { getQuestion: { ...createQuestion } };

          proxy.writeQuery({ query: query2, variables, data: data2 });
        },
        variables: question,
        optimisticResponse: () => ({
          createQuestion: {
            ...question,
            id: uuid(),
            __typename: "Question",
            comments: []
          }
        })
      });
    }
  })
})(NewQuestion);
