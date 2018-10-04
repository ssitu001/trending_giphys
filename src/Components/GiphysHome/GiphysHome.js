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
    gifs: []
  }

  componentDidMount() {
    client.trending('gifs', {})
      .then((gifs) => {
        this.setState({gifs: gifs.data});
      })
      .catch((err) => {
        console.err(err);
      })
  }

  handleChange = (e) => {
    this.setState({searchValue: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading: true});
    client.search('gifs', {"q": this.state.searchValue})
    .then((gifs) => {
      this.setState({loading: false, gifs: gifs.data, searchValue: ''});
    })
    .catch((err) => {
      console.err(err);
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
                <Form onSubmit={_.debounce(this.handleSubmit, 1000, {leading: true})}>
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
          <GiphyContainer gifs={gifs}/>
        </Container>
      </div>
    )
  }
}

export default GiphysHome;