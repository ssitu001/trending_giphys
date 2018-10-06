import React, { Component } from 'react';
import { Grid, Card, Reveal, Rating} from 'semantic-ui-react'


class Giphy extends Component {
  state = {
    imageSrc: `https://media0.giphy.com/media/3oKIPvbc4P1bORkLzq/giphy.gif`,
    imageLoaded: false,
  }

  componentWillMount() {
    const originalSrc = this.props.gifUrl;
    const originalImage = new Image();
    originalImage.onload = () => {
      this.setState({imageSrc: originalSrc, imageLoaded: true})
    }
    originalImage.onerror = () => {
      //handle error later
    }
    originalImage.src = originalSrc;
  }

  toggleFavorites = () => {
    const { toggleFavorite, gif } = this.props;
    toggleFavorite(gif);
  }

  render() {
    const { gifUrl, title, gif } = this.props;
    const { imageSrc, imageLoaded } = this.state;
    return (
      <Grid.Column>
        <Reveal animated='small fade'>
          <Reveal.Content visible style={{pointerEvents: 'none'}}>
            <img src={imageSrc} alt={title} style={{height: '250px'}}/>
          </Reveal.Content>
          <Reveal.Content hidden>
            {
              imageLoaded 
              ? (<div style={{height: '250px', width: '250px'}}>
                  <span>Add to favorites</span>
                  <Rating icon='heart' defaultRating={gif.isFavorite ? 1 : 0} maxRating={1} onRate={this.toggleFavorites}/>
                </div>)
              : null  
            }
          </Reveal.Content>
        </Reveal>
      </Grid.Column>
    )
  }
}




export default Giphy;
