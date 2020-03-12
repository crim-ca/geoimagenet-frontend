// @flow strict
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import { FilterIcon } from './FilterIcon';
import { withTranslation } from '../../../utils';
import { FiltersPaper } from '../FiltersPaper';
import { FadingDialog } from '../FadingDialog';
import { withUserInterfaceStore } from '../../../model/HOCs';
import type { UserInterfaceStore } from '../../../model/store/UserInterfaceStore';
import type { AnnotationFilter as AnnotationFilterEntity } from '../../../model/AnnotationFilter';
import { AnnotationFilter as AnnotationFilterComponent } from './AnnotationFilter';

const styles = {
  button: {
    width: 64,
    height: 64,
    padding: 0,
  },
};

type Props = {
  uiStore: UserInterfaceStore,
  t: TFunction,
};
type State = {
  anchor: HTMLElement | null,
  open: boolean,
};

@observer
class Container extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      open: false,
      anchor: null,
    };
  }

  toggleContainer = (event) => {
    const { open } = this.state;
    this.setState({
      open: !open,
      anchor: event.currentTarget,
    });
  };

  render() {
    const { anchor, open } = this.state;
    const { uiStore, t } = this.props;
    return (
      <>
        <IconButton
          color="primary"
          onClick={this.toggleContainer}
          style={styles.button}
        >
          <FilterIcon />
        </IconButton>
        <FadingDialog open={open} anchor={anchor}>
          <FiltersPaper>
            <ul>
              {
                Object.keys(uiStore.annotationStatusFilters)
                  .map((statusText: string, i) => {
                    const statusFilter: AnnotationFilterEntity = uiStore.annotationStatusFilters[statusText];
                    return (
                      <AnnotationFilterComponent key={i} filter={statusFilter} />
                    );
                  })
              }
            </ul>
            <ul>
              {
                Object.keys(uiStore.annotationOwnershipFilters)
                  .map((ownership: string, i) => {
                    const ownershipFilter = uiStore.annotationOwnershipFilters[ownership];
                    return (
                      <AnnotationFilterComponent key={i} filter={ownershipFilter} />
                    );
                  })
              }
            </ul>
          </FiltersPaper>
        </FadingDialog>
      </>
    );
  }
}

const component = compose(
  withTranslation(),
  withUserInterfaceStore,
)(Container);
export { component as Container };
