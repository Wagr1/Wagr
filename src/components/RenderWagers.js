import React from 'react'
import { Grid, Card, Image } from 'semantic-ui-react'
import basketball from "./basketball.png";
import web3 from "../ether/web3";
import { Link } from "react-router-dom";

const RenderWagers = props => {
  return (
    <Grid columns={props.columns} centered>
      {props.wagerList.map(wager =>
        wager.complete ? null :
          <Grid.Column width="4">
            <Card key={wager.address} className="ui segment centered">
              <Image src={basketball} />
              <Card.Header />
              <Link to={`/wagers/${wager.address}`} value={wager.address}>
                Click here to bet on
                <br />
                {wager.title}
              </Link>
              Ante: {wager.ante} Ether
              <br />
              Current Pot Size: {web3.utils.fromWei(wager.pot, 'ether')} Ether
            </Card>
          </Grid.Column>
      )}
    </Grid>
  )
}

export default RenderWagers;