import React from 'react'
import { Grid, Dropdown } from 'semantic-ui-react'

const DropDownSort = props => {
  return (
    <Grid columns={5}>
      <Grid.Column></Grid.Column><Grid.Column></Grid.Column><Grid.Column></Grid.Column><Grid.Column></Grid.Column>
      <Grid.Column>
        <Dropdown text='Sort By' icon='filter' floating labeled button className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Ante: Low-High' value="ante-low-high" onClick={props.onClickSort} />
            <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Ante: High-Low' value="ante-high-low" onClick={props.onClickSort} />
            <Dropdown.Item label={{ color: 'red', empty: true, circular: true }} text='Pot Size: Low-High' value="pot-low-high" onClick={props.onClickSort} />
            <Dropdown.Item label={{ color: 'blue', empty: true, circular: true }} text='Pot Size: High-Low' value="pot-high-low" onClick={props.onClickSort} />
          </Dropdown.Menu>
        </Dropdown>
      </Grid.Column>
    </Grid>
  )
}

export default DropDownSort;