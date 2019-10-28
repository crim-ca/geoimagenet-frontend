// @flow strict
import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { TFunction } from 'react-i18next';
import { GeoImageNetStore } from '../../../store/GeoImageNetStore';
import { StoreActions } from '../../../store/StoreActions';
import { withTranslation } from '../../../utils';
import type { AnnotationStatus } from '../../../Types';
import { FiltersPaper } from '../FiltersPaper';
import { FadingDialog } from '../FadingDialog';
import { CheckboxLineInput } from './CheckboxLineInput';

type Props = {
  state_proxy: GeoImageNetStore,
  store_actions: StoreActions,
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

  toggle_filter_container = (event) => {
    const { open } = this.state;
    this.setState({
      open: !open,
      anchor: event.currentTarget,
    });
  };

  toggle_status_filter = (annotation_status: AnnotationStatus) => (event) => {
    const { store_actions: { toggle_annotation_status_visibility } } = this.props;
    toggle_annotation_status_visibility(annotation_status, event.target.checked);
  };

  toggle_ownership_filter = (ownership: string) => (event) => {
    const { store_actions: { toggle_annotation_ownership_filter } } = this.props;
    toggle_annotation_ownership_filter(ownership, event.target.checked);
  };

  render() {
    const { anchor, open } = this.state;
    const { state_proxy, t } = this.props;
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={this.toggle_filter_container}
        >
          {t('annotations:filters')}
        </Button>
        <FadingDialog open={open} anchor={anchor}>
          <FiltersPaper>
            <ul>
              {
                Object.keys(state_proxy.annotation_status_filters)
                  .map((statusText: string, i: number) => {
                    const statusFilter = state_proxy.annotation_status_filters[statusText];
                    const uniqueInputId = `status_${statusText}`;
                    return (
                      <li key={i}>
                        <CheckboxLineInput
                          unique_id={uniqueInputId}
                          checked={statusFilter.activated}
                          change_handler={this.toggle_status_filter(statusFilter.text)}
                          label={t(`status:plural.${statusFilter.text}`)}
                        />
                      </li>
                    );
                  })
              }
            </ul>
            <ul>
              {
                Object.keys(state_proxy.annotation_ownership_filters)
                  .map((ownership: string, i: number) => {
                    const ownershipFilter = state_proxy.annotation_ownership_filters[ownership];
                    const uniqueInputId = `ownership_${ownership}`;
                    return (
                      <li key={i}>
                        <CheckboxLineInput
                          unique_id={uniqueInputId}
                          checked={ownershipFilter.activated}
                          change_handler={this.toggle_ownership_filter(ownershipFilter.text)}
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

const component = withTranslation()(Container);
export { component as Container };
