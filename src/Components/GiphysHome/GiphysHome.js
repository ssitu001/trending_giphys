import React, { Component } from 'react';
import _ from 'lodash';
import GphApiClient from 'giphy-js-sdk-core';
const client = new GphApiClient('njJKySvRX2tLcXayN5ep5vXmHoJ6h1It');

import GiphyContainer from '../GiphyContainer/GiphyContainer';

import { Container, Menu, Header, Visibility, Dropdown, Image, Input, Form } from 'semantic-ui-react'

class GiphysHome extends Component {
  state = {
    searchValue: '',
    loading: false,
    gifs: [],
    favorites: []
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

  addFavoriteToLocalStorage = newFavorite => {
    if (localStorage) {
      const storedFavorites = this.getStoredFavorites();

      localStorage.setItem('favorites', JSON.stringify({ ...storedFavorites, [newFavorite.id]: newFavorite }));
    }
  }

  removeFavoriteFromLocalStorage = (id) => {
    if (localStorage) {
      const storedFavorites = this.getStoredFavorites();
      if (storedFavorites.id) {
        delete storedFavorites.id;
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
        }
        return gif;
      });
    }
  }

  addToFavorites = (gif) => {
    this.setState({ favorites: [ ...this.state.favorites, gif ] }, () => {
     this.addFavoriteToLocalStorage(gif) 
    });
  }
  
  removeFromFavorites = (id) => {
    this.setState({ favorites: this.state.favorites.filter(favorite => favorite.id === id) }, () => {
      this.removeFavoriteFromLocalStorage(id);
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

  stickTopMenu = () => {
    console.log('stick')
  }

  unStickTopMenu = () => {
    console.log('unstick')
  }

  render() {
    let {gifs, loading} = this.state;

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
            // fixed={menuFixed && 'top'}
            // style={menuFixed ? fixedMenuStyle : menuStyle}
          >
            <Container text>
              <Menu.Item>
                <Form onSubmit={_.debounce(this.handleSubmit, 300)}>
                  <Input loading={loading} icon='user' placeholder="Search for your giphy" onChange={this.handleChange} value={this.state.searchValue}/>
                </Form>
              </Menu.Item>

              <Menu.Menu position='right'>
                <Dropdown text='Placeholder' pointing className='link item'>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Header>Header Item</Dropdown.Header>
                    <Dropdown.Item>
                      <i className='dropdown icon' />
                      <span className='text'>Submenu</span>
                      <Dropdown.Menu>
                        <Dropdown.Item>List Item</Dropdown.Item>
                        <Dropdown.Item>List Item</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Container>
          </Menu>
        </Visibility>
        <Container>
          <GiphyContainer 
            gifs={gifs}  
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