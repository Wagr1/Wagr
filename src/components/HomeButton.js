import "./App.css";
import React from 'react'
import { Header, Button } from 'semantic-ui-react'

const HomeButton = props => {
  return (
    <Header.Content>
      <Button className="primary button" circular onClick={props.goHome}>
        Home
      </Button>
    </Header.Content>

  )
}

export default HomeButton