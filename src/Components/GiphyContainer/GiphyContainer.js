import React from 'react';

import Giphy from '../Giphy/Giphy';
import { Grid } from 'semantic-ui-react'

const GiphyContainer = ({ addToFavorites, removeFromFavorites, gifs }) => {

   const giphy = gifs.length ? gifs.map((gif, i) => {
      let gifUrl = gif.images.original.gif_url;
      return (
        <Giphy 
          toggleFavorite={gif.isFavorite ? removeFromFavorites : addToFavorites} 
          gifUrl={gifUrl} 
          title={gif.title} 
          key={`${gif.id} + ${i}`}
        />
      );
    }) : [];

  return (
      <Grid columns={4}>
        <Grid.Row  stretched>
          {giphy}
        </Grid.Row>
      </Grid>
  )
}

export default GiphyContainer;