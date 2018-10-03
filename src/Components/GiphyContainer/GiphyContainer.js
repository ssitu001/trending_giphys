import React from 'react';

import Giphy from '../Giphy/Giphy';
import { Grid } from 'semantic-ui-react'

const GiphyContainer = ({gifs}) => {

   let img = gifs.length ? gifs.map((gif) => {
      let gifUrl = gif.images.original.gif_url;
      return <Giphy gifUrl={gifUrl} title={gif.title} key={gif.id}/>;
    }) : [];

  return (
      <Grid columns={4}>
        <Grid.Row  stretched>
          {img}
        </Grid.Row>
      </Grid>
  )
}

export default GiphyContainer;