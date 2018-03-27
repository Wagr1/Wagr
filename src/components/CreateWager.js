
import React, { Component } from 'react';
import factory from '../ether/factory';
import web3 from '../ether/web3';
import { Router } from './routes';
import { withRouter } from 'react-router-dom';
import { db, auth, userById } from "../fire/firestore";
import "./App.css";


import {
  Header,
  Icon,
  Image,
  Segment,
  Grid,
  Button,
  Card,
  Label,
  Form,
  Input,
  Message
} from "semantic-ui-react";

class CreateWager extends Component {
  state = {
    minimumBet: '',
    errorMessage: '',
    loading: false,
    leftSide: '',
    rightSide: '',
    description: ''
  }

  componentDidMount(){
    if (this.props.location.state){
      let arr = []
      const dateCode = this.props.location.state.date.toString()
      arr.push(dateCode.slice(0, 4))
      arr.push(dateCode.slice(4, 6))
      arr.push(dateCode.slice(6))
      const dateStr = Date(arr.join('-'))
      const desc = 'Game between ' + this.props.location.state.away + ' at ' + this.props.location.state.home + ' to be played on ' + dateStr.slice(0, 15) + ' at ' + this.props.location.state.time
      this.setState({
        leftSide: this.props.location.state.away,
        rightSide: this.props.location.state.home,
        description: desc
      })
    }
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createWager(this.state.minimumBet, (this.state.leftSide + " vs. " + this.state.rightSide), this.state.description)
        .send({
          from: accounts[0]
        });
      const createdContract = await factory.methods.getDeployedwagers().call()
      console.log("new-new: ", createdContract.slice(-1))
      this.props.history.push('/wagers');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  }

  render() {
    let desc = ''
    let arr = []
    return (
      <div className="App">
        <Segment inverted>
          <Header inverted as="h2" icon textAlign="center">
          <i className="ethereum icon circular"></i>
            <Header.Content>
            <Grid columns= {3}>
            <Grid.Column>
            <Button className= "ui left floated primary button" circular onClick={this.onClick}>
              <Icon name="home" circular />
            </Button>
            </Grid.Column>
            <Grid.Column>
              <h2 className ="ui blue text header">Create a Wagr For All
              </h2>
            </Grid.Column>
            </Grid>
            </Header.Content>
          </Header>
        </Segment>
        <div classname='borderFix' centered>
          <Grid className="segment centered">

              <Form className= "createWager" onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                <label>What's The Name Of Your Wagr</label>
                <div className="fields">
                    <div className="nine wide field">
                      <Input
                        value={this.state.leftSide}
                        onChange={event => this.setState({ leftSide: event.target.value })}
                        label="Side One"
                        labelPosition="right"
                      />
                    </div>
                    <label className="large text">Vs.</label>
                    <div className="nine wide field">
                      <Input
                        value={this.state.rightSide}
                        onChange={event => this.setState({ rightSide: event.target.value })}
                        label="Side Two"
                        labelPosition="right"
                      />
                    </div>
                  </div>
                </Form.Field>
                <Form.Field>
                  <label>How much do you want the buy in to be?</label>
                  <Input
                    value={this.state.minimumBet}
                    onChange={event => this.setState({ minimumBet: event.target.value })}
                    label="ether"
                    labelPosition="right"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Describe What Your Wagr Is Going To Be Below!</label>
                  <textarea
                    rows="2"
                    value={desc || this.state.description}
                    onChange={event => this.setState({ description: event.target.value })}
                    label="description"
                    labelPosition="right"
                  >
                  </textarea>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>
                  Create!
                </Button>
              </Form>

          </Grid>
        </div>
      </div>
    )
  }
}
export default withRouter(CreateWager);
