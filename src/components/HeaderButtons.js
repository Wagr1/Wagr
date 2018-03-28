import "./App.css";
import React from 'react'
import { Grid, Header, Icon, Button } from 'semantic-ui-react'

const HeaderButtons = props => {
  return (
    <Grid columns={3} textAlign="center">
      <Grid.Column>
        <Header.Content>
          <Button className="primary button" circular onClick={props.logout}>
            Logout
              </Button>
        </Header.Content>
      </Grid.Column>
      <Grid.Column>
        <Header.Content>
          <Button className="primary button" circular onClick={props.createContract}>
            Create a new Contract
                </Button>
        </Header.Content>
      </Grid.Column>
      <Grid.Column>
        <Header.Content>
          <Button className="primary button" circular onClick={props.profilePage}>
            Profile Page
                </Button>
        </Header.Content>
      </Grid.Column>
    </Grid>
  )
}

export default HeaderButtons