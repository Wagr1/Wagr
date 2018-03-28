import React from "react";
import { Segment, Header, Icon } from 'semantic-ui-react'

const NavBar = ({ message }) => {
  return (
    <Header inverted as="h2" icon textAlign="center">
      <i className="ethereum icon circular"></i>
      <Header.Content>
        <h1 className="ui blue header">
          WEIJR
        </h1>
      </Header.Content>
      <Header.Content>
        <h2 className="ui blue header">
          {message}
        </h2>
      </Header.Content>
    </Header>
  )
}

export default NavBar