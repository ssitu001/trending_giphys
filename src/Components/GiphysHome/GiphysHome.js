import React, { Component } from 'react';
import _ from 'lodash';
import GphApiClient from 'giphy-js-sdk-core';
const client = new GphApiClient('njJKySvRX2tLcXayN5ep5vXmHoJ6h1It');

import GiphyContainer from '../GiphyContainer/GiphyContainer';

import { Container, Menu, Header, Visibility, Button, Input, Form } from 'semantic-ui-react'

const CONSTANTS = {
  HOME: 'Home',
  FAVORITES: 'Favorites'
};

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '4em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
}

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

class GiphysHome extends Component {
  state = {
    searchValue: '',
    loading: false,
    currentView: CONSTANTS.HOME,
    gifs: [],
    favorites: [],
    menuFixed: false,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.fetchGifs();
  }

  fetchGifs = () => {
    const { gifs } = this.state;
    const offset = gifs.length || 20;
    client.trending('gifs', {offset})
      .then((gifs) => {
        const storedFavorites = this.getStoredFavorites();
        this.setState({ favorites: Object.values(storedFavorites), gifs: [ ...this.state.gifs, ...this.isFavorite(gifs.data) ]})
      })
      .catch((err) => {
        console.error(err);
      })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);    
  }

  handleScroll = (e) => {
    const scrollNode = document.scrollingElement || document.documentElement;
    if (scrollNode.scrollHeight <= scrollNode.scrollTop + window.innerHeight) {
      // _.throttle(this.fetchGifs, 100);
      this.fetchGifs();
    }
  }

  handleChange = (e) => {
    this.setState({searchValue: e.target.value});
  }

  getStoredFavorites = () => JSON.parse(localStorage.getItem('favorites')) || {};

  addFavoriteToLocalStorage = (newFavorite) => {
    if (localStorage) {
      const storedFavorites = this.getStoredFavorites();

      localStorage.setItem('favorites', JSON.stringify({ ...storedFavorites, [newFavorite.id]: newFavorite }));
    }
  }

  removeFavoriteFromLocalStorage = (id) => {
    if (localStorage) {
      const storedFavorites = this.getStoredFavorites();
      if (storedFavorites[id]) {
        delete storedFavorites[id];
      }

      localStorage.setItem('favorites', JSON.stringify(storedFavorites));
    }
  }

  isFavorite = (gifs) => {
    if (localStorage) {
      const storedFavorites = this.getStoredFavorites();

      return gifs.map(gif => {
        if (storedFavorites[gif.id]) {
          gif.isFavorite = true;
        } else {
          gif.isFavorite = false;
        }
        return gif;
      });
    }
  }

  addToFavorites = (gif) => {
    gif.isFavorite = true;
    this.setState({ favorites: [ ...this.state.favorites, gif ] }, () => {
      this.addFavoriteToLocalStorage(gif); 
    });
  }
  
  removeFromFavorites = (gif) => {
    gif.isFavorite = false;
    this.setState({ favorites: this.state.favorites.filter(favorite => favorite.id === gif.id) }, () => {
      this.removeFavoriteFromLocalStorage(gif.id);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    client.search('gifs', { "q": this.state.searchValue })
    .then((gifs) => {
      this.setState({ loading: false, gifs: gifs.data, searchValue: '' });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  stickTopMenu = () => this.setState({ menuFixed: true });

  unStickTopMenu = () => this.setState({ menuFixed: false });

  get currentView() {
    console.log('calld')
    return this.state.currentView === CONSTANTS.HOME
    ? this.state.gifs
    : this.state.favorites
  }

  render() {
    let {gifs, favorites, loading, currentView, menuFixed} = this.state;

    return (

      <div>
        <Container text style={{ marginTop: '2em' }}>
          <Header as='h1'>Giphy Me</Header>
          <p>
            Lorem isum something something
          </p>
        </Container>
        <Visibility
          onBottomPassed={this.stickTopMenu}
          onBottomVisible={this.unStickTopMenu}
          once={false}
        >
          <Menu
            borderless
            fixed={menuFixed ? 'top' : null}
            style={menuFixed ? fixedMenuStyle : menuStyle}
          >
            <Container text>
              <Menu.Item>
                <Form onSubmit={_.debounce(this.handleSubmit, 300)}>
                  <Input loading={loading} icon='search' placeholder="Search for your giphy" onChange={this.handleChange} value={this.state.searchValue}/>
                </Form>
              </Menu.Item>

              <Menu.Menu position='right'>
              <div>
                <Button 
                  active={true} 
                  onClick={() => {this.setState({ currentView: CONSTANTS.HOME })}} 
                  circular 
                  icon='home' 
                /> 
                <Button 
                  active={false} 
                  onClick={() => {this.setState({ currentView: CONSTANTS.FAVORITES })}} 
                  circular 
                  icon='heart' 
                /> 
              </div>
              </Menu.Menu>
            </Container>
          </Menu>
        </Visibility>
        <Container>
          <GiphyContainer 
            gifs={this.currentView}  
            style={{ overflowY: 'auto' }} 
            onScroll={this.handleScroll}
            addToFavorites={this.addToFavorites}
            removeFromFavorites={this.removeFromFavorites}
          />
        </Container>
      </div>
    )
  }
}

export default GiphysHome;