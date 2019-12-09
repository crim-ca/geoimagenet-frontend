// @flow strict
import { MuiThemeProvider } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import { UserInteractions } from '../../domain/index';
import { ANNOTATIONS_COUNTS_RESPONSE, TAXONOMY_CLASSES_RESPONSE, TAXONOMY_RESPONSE } from '../api_responses';
import { theme } from '../../utils/react';
import { ANNOTATION } from '../../Types';
import { StoreActions } from '../../model/StoreActions';

const React = require('react');
const { mount } = require('enzyme');
const { Viewer } = require('../../components/Taxonomy/Viewer');
const { Classes } = require('../../components/Taxonomy/Classes');
const { SpacedChip } = require('../../components/Taxonomy/AnnotationCounts');
const { PresentationListElement } = require('../../components/Taxonomy/PresentationListElement');
const { i18n } = require('../../utils/index');
const { wait } = require('../utils');
const { TaxonomyPresentation } = require('../../components/Presentation/TaxonomyPresentation');
const {
  geoImageNetStore,
  taxonomyStore,
  uiStore,
  dataQueries,
} = require('../../model/instance_cache');
require('./define_global_jsdom');

type Props = {};

dataQueries.fetch_taxonomies = jest.fn(() => TAXONOMY_RESPONSE);
dataQueries.fetch_taxonomy_classes = jest.fn(() => TAXONOMY_CLASSES_RESPONSE);
dataQueries.flat_taxonomy_classes_counts = jest.fn(() => ANNOTATIONS_COUNTS_RESPONSE);
dataQueries.get_annotations_browser_page = jest.fn(() => ({}));

const storeActions = new StoreActions(geoImageNetStore, taxonomyStore, uiStore);
const userInteractions = new UserInteractions(storeActions, taxonomyStore, dataQueries, i18n, geoImageNetStore);

const refreshSourceCallbackMock = () => {
};

class TestableTaxonomyViewer extends React.Component<Props> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Viewer
          geoImageNetStore={geoImageNetStore}
          userInteractions={userInteractions}
          storeActions={storeActions}
          refresh_source_by_status={refreshSourceCallbackMock}
        />
      </MuiThemeProvider>
    );
  }
}

describe('Taxonomy viewer', () => {
  beforeEach(async () => {
    await userInteractions.fetch_taxonomies();
    await userInteractions.select_taxonomy(geoImageNetStore.taxonomies[1]);
  });

  test('Default data has new annotations', () => {
    expect(taxonomyStore.flat_taxonomy_classes[1].counts.new)
      .toBeGreaterThan(0);
  });

  test('Default data has two tabs', () => {
    const wrapper = mount(<TestableTaxonomyViewer />);
    expect(wrapper.find(Tab).length)
      .toBe(2);
  });

  test('Default data has classes', () => {
    const wrapper = mount(<TestableTaxonomyViewer />);
    expect(wrapper.find(Classes).length)
      .toBeGreaterThan(1);
  });

  test('Default data shows count chips', async () => {
    const wrapper = mount(<TestableTaxonomyViewer />);
    expect(wrapper.find(SpacedChip).length)
      .toBeGreaterThan(0);
  });

  test('Taxonomy viewer from presentation page shows taxonomy.', async () => {
    const wrapper = mount(
      <TaxonomyPresentation
        geoImageNetStore={geoImageNetStore}
        userInteractions={userInteractions}
      />
    );
    expect(wrapper.find(PresentationListElement).length)
      .toBeGreaterThan(0);
  });

  test('When all filters are off there are no count chips', () => {
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW, false);
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED, false);
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED, false);
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED, false);
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED, false);
    storeActions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED, false);
    const wrapper = mount(<TestableTaxonomyViewer />);
    expect(wrapper.find(SpacedChip).length)
      .toEqual(0);
  });

  test('Default data loads land cover', () => {
    const wrapper = mount(<TestableTaxonomyViewer />);
    expect(wrapper.html())
      .toContain('Couverture de sol');
  });

  test('Changing tabs loads taxonomy', async () => {
    const wrapper = mount(<TestableTaxonomyViewer />);
    const tabs = wrapper.find(Tab);
    tabs.last()
      .simulate('click');
    await wait(0);
    wrapper.update();
    expect(wrapper.html())
      .toContain('Objets');
    wrapper.unmount();
  });

});
