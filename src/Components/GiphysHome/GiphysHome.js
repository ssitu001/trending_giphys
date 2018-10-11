import React, { Component } from 'react';
import _ from 'lodash';
import GphApiClient from 'giphy-js-sdk-core';
const client = new GphApiClient('njJKySvRX2tLcXayN5ep5vXmHoJ6h1It');

import GiphyContainer from '../GiphyContainer/GiphyContainer';
import Banner from '../Banner/Banner';

import { menuStyle, fixedMenuStyle } from '../../Styles/Home';
import { CONSTANTS } from '../../Constants/constants';

import { Container, Menu, Header, Visibility, Button, Input, Form, Icon } from 'semantic-ui-react'

class GiphysHome extends Component {
    state = {
      searchValue: '',
      currentSearchValue: '',
      loading: false,
      currentView: CONSTANTS.HOME,
      currentState: CONSTANTS.TRENDING,
      gifs: [],
      favorites: [],
      menuFixed: false,
    }

  componentDidMount() {
    window.addEventListener('scroll', _.throttle(this.handleScroll, 1000));
    this.fetchTrendingGifs();
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);    
  }

  fetchTrendingGifs = () => {
    const { gifs } = this.state;
    const offset = gifs.length ? gifs.length + 10 : 0;

    client.trending('gifs', {limit: 10, offset: offset})
      .then((newGifs) => {
        const storedFavorites = this.getStoredFavorites();
        this.setState({ 
          favorites: Object.values(storedFavorites), 
          gifs: [ ...gifs, ...this.isFavorite(newGifs.data) ],
        });
      })
      .catch((err) => {
        console.error(err);
      })
  }

  fetchAdditionalSearchedGifs = () => {
    const { currentSearchValue, gifs } = this.state;

    client.search('gifs', { "q": currentSearchValue, limit: 10, offset: gifs.length + 10 })
      .then((newGifs) => {
        const storedFavorites = this.getStoredFavorites();
        this.setState({ 
          favorites: Object.values(storedFavorites),
          gifs: [...gifs, ...this.isFavorite(newGifs.data) ],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleSubmit = () => {
    const { searchValue } = this.state;

    this.setState({ 
      loading: true, 
      currentState: CONSTANTS.USER_SEARCH, 
      currentSearchValue: searchValue 
    });

    client.search('gifs', { "q": searchValue, limit: 10, offset: 0 })
    .then((gifs) => {
      const storedFavorites = this.getStoredFavorites();
      this.setState({ 
        loading: false, 
        favorites: Object.values(storedFavorites), 
        gifs: gifs.data, 
        searchValue: '' 
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleScroll = () => {
    const { currentState } = this.state;
    const scrollNode = document.scrollingElement || document.documentElement;
    if (scrollNode.scrollHeight <= scrollNode.scrollTop + window.innerHeight) {
      return currentState === CONSTANTS.TRENDING 
        ? this.fetchTrendingGifs() 
        : this.fetchAdditionalSearchedGifs();
    }
  }

  handleChange = (e) => this.setState({ searchValue: e.target.value });
  
  getStoredFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || {};
  } 

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

  stickTopMenu = () => this.setState({ menuFixed: true });

  unStickTopMenu = () => this.setState({ menuFixed: false });

  get getCurrentState() {
    const { currentState, gifs, favorites } = this.state;
    return currentState !== CONSTANTS.FAVORITES
      ? gifs
      : favorites;
  }

  setCurrentState = () => {
    const { currentSearchValue } = this.state;
    if ( currentSearchValue && currentSearchValue.length ) {
      this.setState({ currentState: CONSTANTS.USER_SEARCH });
    } else {
      this.setState({ currentState: CONSTANTS.TRENDING });
    }
  }

  render() {
    const { 
      loading,
      searchValue, 
      currentState,
      menuFixed, 
      currentSearchValue
    } = this.state;

    return (
      <div>
        <Container style={{ marginTop: '2em'}}>
          <Header size='huge' color={'grey'}>
            <Icon size='huge' name='images outline'/>GIPHY ME
          </Header>
          <Header size='medium' color={'grey'}>Just for fun...</Header>
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
            <Container>
              <Menu.Item>
                <Form onSubmit={_.debounce(this.handleSubmit, 300)}>
                  <Input loading={loading} icon='search' placeholder="Search for all the gifs" onChange={this.handleChange} value={searchValue}/>
                </Form>
              </Menu.Item>

              <Menu.Menu position='right'>
                <Menu.Item>
                  <Button
                    active={ currentState !== CONSTANTS.FAVORITES } 
                    onClick={this.setCurrentState} 
                    circular 
                    icon='home' 
                  />
                  <Button 
                    active={ currentState === CONSTANTS.FAVORITES } 
                    onClick={() => {this.setState({ currentState: CONSTANTS.FAVORITES })}} 
                    circular 
                    icon='heart' 
                  /> 
                </Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>
        </Visibility>
        <Container>
          <Banner 
            currentSearchValue={currentSearchValue}
            currentState={currentState}
          />
          <GiphyContainer 
            gifs={this.getCurrentState}  
            style={{ overflowY: 'auto' }} 
            addToFavorites={this.addToFavorites}
            removeFromFavorites={this.removeFromFavorites}
          />
        </Container>
      </div>
    )
  }
}

export default GiphysHome;