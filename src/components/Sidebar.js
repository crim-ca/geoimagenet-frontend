// @flow strict
import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Paper,
  withStyles,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { compose } from 'react-apollo';
import type { TFunction } from 'react-i18next';
import { Viewer } from './Taxonomy/Viewer';
import { Container as SettingsContainer } from './UserSettings/Container';
import { withTranslation } from '../utils';
import { Container as AnnotationBrowserContainer } from './AnnotationBrowser/Container';
import type { OpenLayersStore } from '../model/store/OpenLayersStore';
import type { GeoImageNetStore } from '../model/store/GeoImageNetStore';
import type { StoreActions } from '../model/StoreActions';
import type { UserInteractions } from '../domain';

type SidebarSectionData = {
  title: string,
  slug: string,
  content: {},
};

const makeSidebarSections: (
  UserInteractions,
  GeoImageNetStore,
  StoreActions,
  OpenLayersStore,
  TFunction
) => SidebarSectionData[] = (
  userInteractions,
  geoImageNetStore,
  storeActions,
  openLayersStore,
  t,
) => {
  const sections = [
    {
      title: 'Taxonomies and Classes',
      slug: 'taxonomies',
      content: (
        <Viewer
          refresh_source_by_status={userInteractions.refresh_source_by_status}
          geoImageNetStore={geoImageNetStore}
          userInteractions={userInteractions}
        />
      ),
    },
    {
      title: t('title:annotation_browser'),
      slug: 'annotation-browser',
      content: (
        <AnnotationBrowserContainer
          userInteractions={userInteractions}
          openLayersStore={openLayersStore}
          storeActions={storeActions}
          geoImageNetStore={geoImageNetStore}
        />
      ),
    },
    {
      // This part acts as a target for the layerswitcher, defined in MapContainer.js
      title: 'Basemaps and Images',
      slug: 'layers',
      content: (<div id="layer-switcher" className="layer-switcher-container" />),
    },
  ];
  if (geoImageNetStore.user.authenticated) {
    sections.push({
      title: 'Settings',
      slug: 'settings',
      content: (<SettingsContainer user={geoImageNetStore.user} userInteractions={userInteractions} />),
    });
  }
  return sections;
};

type Props = {
  geoImageNetStore: GeoImageNetStore,
  storeActions: StoreActions,
  userInteractions: UserInteractions,
  openLayersStore: OpenLayersStore,
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
    const {
      classes,
      userInteractions,
      geoImageNetStore,
      storeActions,
      openLayersStore,
      t,
    } = this.props;
    const sidebarSections = makeSidebarSections(
      userInteractions,
      geoImageNetStore,
      storeActions,
      openLayersStore,
      t,
    );
    return (
      <Paper className={classes.sidebar}>
        <div className={classes.bottom}>
          {
            sidebarSections.map((section, i) => (
              <ExpansionPanel
                key={i}
                expanded={opened_panel_title === section.slug}
                onChange={this.create_open_panel_handler(section.slug)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}
                >
                  {section.title}
                </ExpansionPanelSummary>
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
