// @flow strict
import React from 'react';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Paper, withStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { compose } from 'react-apollo';

import { Viewer } from './Taxonomy/Viewer';
import { Container as SettingsContainer } from './UserSettings/Container';
import { withTranslation } from '../utils';
import { Container as AnnotationBrowserContainer } from './AnnotationBrowser/Container';

import type { OpenLayersStore } from '../store/OpenLayersStore';
import type { GeoImageNetStore } from '../store/GeoImageNetStore';
import type { StoreActions } from '../store/StoreActions';
import type { UserInteractions } from '../domain';
import type { TFunction } from 'react-i18next';

type SidebarSectionData = {
  title: string,
  slug: string,
  content: {},
};

const make_sidebar_sections: (UserInteractions, GeoImageNetStore, StoreActions, OpenLayersStore, TFunction) => SidebarSectionData[] = (
  user_interactions,
  state_proxy,
  store_actions,
  open_layers_store,
  t,
) => {
  const sections = [
    {
      title: 'Taxonomies and Classes',
      slug: 'taxonomies',
      content: (
        <Viewer
          refresh_source_by_status={user_interactions.refresh_source_by_status}
          state_proxy={state_proxy}
          user_interactions={user_interactions} />
      ),
    },
    {
      title: t('title:annotation_browser'),
      slug: 'annotation-browser',
      content: (
        <AnnotationBrowserContainer
          user_interactions={user_interactions}
          open_layers_store={open_layers_store}
          store_actions={store_actions}
          state_proxy={state_proxy} />
      ),
    },
    {
      title: 'Basemaps, Images and Filters',
      slug: 'layers',
      content: (<div id='layer-switcher' className='layer-switcher-container' />),
    },
  ];
  if (state_proxy.logged_user !== null) {
    sections.push({
      title: 'Settings',
      slug: 'settings',
      content: (<SettingsContainer user={state_proxy.logged_user} user_interactions={user_interactions} />),
    });
  }
  return sections;
};

type Props = {
  state_proxy: GeoImageNetStore,
  store_actions: StoreActions,
  user_interactions: UserInteractions,
  open_layers_store: OpenLayersStore,
  classes: {
    sidebar: {},
    bottom: {},
    details: {},
  },
  t: TFunction,
};
type State = {
  opened_panel_title: string,
};
const style = {
  sidebar: {
    gridRow: '1/3',
    gridColumn: '3/4',
    padding: 0,
  },
  bottom: {
    height: '100%',
    overflowY: 'scroll',
  },
  details: {
    flexDirection: 'column',
  },
};

class Sidebar extends React.Component<Props, State> {

  state = {
    opened_panel_title: '',
  };

  create_open_panel_handler = (panel_title: string) => (event: Event, panel_should_open: boolean) => {
    this.setState({
      opened_panel_title: panel_should_open ? panel_title : '',
    });
  };

  render() {
    const { opened_panel_title } = this.state;
    const { classes } = this.props;
    const sidebar_sections = make_sidebar_sections(
      this.props.user_interactions,
      this.props.state_proxy,
      this.props.store_actions,
      this.props.open_layers_store,
      this.props.t);
    return (
      <Paper className={classes.sidebar}>
        <div className={classes.bottom}>
          {
            sidebar_sections.map((section, i) => (
              <ExpansionPanel key={i}
                              expanded={opened_panel_title === section.slug}
                              onChange={this.create_open_panel_handler(section.slug)}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}>{section.title}</ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>{section.content}</ExpansionPanelDetails>
              </ExpansionPanel>
            ))
          }
        </div>
      </Paper>
    );
  }
}

const component = compose(
  withTranslation(),
  withStyles(style),
)(Sidebar);

export { component as Sidebar };
