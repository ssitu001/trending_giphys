import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

import { CONSTANTS } from '../../Constants/constants';
import { iconTypes } from '../../Utils/utils';

const Banner = ({
  currentSearchValue, 
  currentState
}) => {
  return (
    <Message size='small' color={'black'}>
      <Icon size='large' name={iconTypes(currentState)} />
      { 
        currentSearchValue && currentSearchValue.length && currentState !== CONSTANTS.FAVORITES
        ? currentSearchValue
        : currentState
      }
    </Message>
  )
}

export default Banner;