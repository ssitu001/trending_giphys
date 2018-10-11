import React from 'react';
import { getRandomColor } from '../../Utils/utils';
import { Grid, Reveal, Rating, Image} from 'semantic-ui-react'

const Giphy = ({
  toggleFavorite, 
  gif, 
  gifUrl
}) => {
    return (
      <Grid.Column 
        mobile={16} 
        tablet={8} 
        computer={4} 
        color={getRandomColor()}
        textAlign='center'
        verticalAlign='middle'
      >
        <Reveal animated='small fade'>
          <Reveal.Content visible style={{pointerEvents: 'none'}}>
            <Image src={gifUrl} alt={gif.title} style={{height: '200px', width: '100%'}} centered fluid/>
          </Reveal.Content>
          <Reveal.Content hidden>
          <div style={{height: '200px'}}>
            <span>Add to favorites</span>
              <Rating 
                icon='heart' 
                defaultRating={gif.isFavorite ? 1 : 0} 
                maxRating={1} 
                onRate={() => toggleFavorite(gif)}
              />
            <div>
              {gif.title}
            </div>
          </div>
          </Reveal.Content>
        </Reveal>
      </Grid.Column>
    )
}

export default Giphy;
