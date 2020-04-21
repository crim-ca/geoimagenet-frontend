// @flow strict

import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onclick: (Event) => Promise<void>
};

class ReleaseButton extends Component<Props> {
  render() {
    return <FontAwesomeIcon onClick={this.props.onclick} icon={faPaperPlane} className='fa-lg release' />;
  }
}

export { ReleaseButton };
