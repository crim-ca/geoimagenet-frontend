// @flow strict

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { buttonStyle } from '../SharedStyles';
import { withTranslation } from '../../../utils';
import { GeoImageNetStore } from '../../../model/store/GeoImageNetStore';
import Owner from '../../../img/icons/owner.png';
import OwnerWhite from '../../../img/icons/owner_white.png';


type Props = {
  t: TFunction,
  geoImageNetStore: GeoImageNetStore,
};
type State = {};
const styles = {
  icon: {
    width: 40,
    height: 40,
    textAlign: 'center',
  },
};

@observer
class Container extends React.Component<Props, State> {
  receiveClickEvent = () => {
    this.props.geoImageNetStore.toggleAnnotationOwners();
  };

  render() {
    const { t, geoImageNetStore } = this.props;
    return (
      <React.Fragment>
        <IconButton
          color="primary"
          onClick={this.receiveClickEvent}
          style={buttonStyle}
        >
          <img
            style={styles.icon}
            src={geoImageNetStore.showAnnotatorsIdentifiers ? Owner : OwnerWhite}
          />
        </IconButton>
      </React.Fragment>
    );
  }
}

const component = withTranslation()(Container);

export {
  component as Container,
};
