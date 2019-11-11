// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { TFunction } from 'react-i18next';
import { compose } from 'react-apollo';
import type{ GeoImageNetStore } from '../../../model/store/GeoImageNetStore';
import { StoreActions } from '../../../model/StoreActions';
import { withTranslation } from '../../../utils';
import type { AnnotationStatus } from '../../../Types';
import { FiltersPaper } from '../FiltersPaper';
import { FadingDialog } from '../FadingDialog';
import { CheckboxLineInput } from './CheckboxLineInput';
import { withUserInterfaceStore } from '../../../model/HOCs';
import type { UserInterfaceStore } from '../../../model/store/UserInterfaceStore';

type Props = {
  geoImageNetStore: GeoImageNetStore,
  storeActions: StoreActions,
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

  toggleStatusFilter = (annotationStatus: AnnotationStatus) => (event) => {
    const { storeActions: { toggle_annotation_status_visibility } } = this.props;
    toggle_annotation_status_visibility(annotationStatus, event.target.checked);
  };

  toggleOwnershipFilter = (ownership: string) => (event) => {
    const { storeActions: { toggle_annotation_ownership_filter } } = this.props;
    toggle_annotation_ownership_filter(ownership, event.target.checked);
  };

  render() {
    const { anchor, open } = this.state;
    const { geoImageNetStore: {annotationStatusFilters, annotationOwnershipFilters}, t } = this.props;
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={this.toggleContainer}
        >
          {t('annotations:filters')}
        </Button>
        <FadingDialog open={open} anchor={anchor}>
          <FiltersPaper>
            <ul>
              {
                Object.keys(annotationStatusFilters)
                  .map((statusText: string) => {
                    const statusFilter = annotationStatusFilters[statusText];
                    const uniqueInputId = `status_${statusText}`;
                    return (
                      <li key={uniqueInputId}>
                        <CheckboxLineInput
                          uniqueId={uniqueInputId}
                          checked={statusFilter.activated}
                          changeHandler={this.toggleStatusFilter(statusFilter.text)}
                          label={t(`status:plural.${statusFilter.text}`)}
                        />
                      </li>
                    );
                  })
              }
            </ul>
            <ul>
              {
                Object.keys(annotationOwnershipFilters)
                  .map((ownership: string) => {
                    const ownershipFilter = annotationOwnershipFilters[ownership];
                    const uniqueInputId = `ownership_${ownership}`;
                    return (
                      <li key={uniqueInputId}>
                        <CheckboxLineInput
                          uniqueId={uniqueInputId}
                          checked={ownershipFilter.activated}
                          changeHandler={this.toggleOwnershipFilter(ownershipFilter.text)}
                          label={t(`annotations:ownership.${ownershipFilter.text}`)}
                        />
                      </li>
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
