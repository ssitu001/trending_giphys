import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react'


const Giphy = ({gifUrl, title}) => {
  return (
    <Grid.Column>
      <Image src={gifUrl} alt={title} size="medium"/>
    </Grid.Column>
  )
}

export default Giphy;