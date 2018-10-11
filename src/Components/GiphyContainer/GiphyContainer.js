import React from 'react';

import Giphy from '../Giphy/Giphy';
import { Grid } from 'semantic-ui-react'

const generateGiphy = (gifs, addToFavorites, removeFromFavorites) => {
  return gifs.length ? gifs.map((gif) => {
    let gifUrl = gif.images.original.gif_url;
    return (
      <Giphy 
        toggleFavorite={gif.isFavorite ? removeFromFavorites : addToFavorites}
        gif={gif} 
        gifUrl={gifUrl} 
        key={gif.id}
      />
    );
  }) : [];

}

const GiphyContainer = ({ 
  addToFavorites, 
  removeFromFavorites, 
  gifs 
}) => {
  return (
    <Grid stackable container>
      { generateGiphy(gifs, addToFavorites, removeFromFavorites) }
    </Grid>
  )
}

export default GiphyContainer;