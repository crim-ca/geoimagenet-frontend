//@flow

import { StoreActions } from '../store/StoreActions'
import { UserInteractions } from '../domain'
import { ANNOTATIONS_COUNTS_RESPONSE, TAXONOMY_CLASSES_RESPONSE, TAXONOMY_RESPONSE } from './api_responses'
import { ANNOTATION } from '../constants'
import { theme } from '../utils/react'
import { MuiThemeProvider } from '@material-ui/core'

import Tab from '@material-ui/core/Tab'

const React = require('react')
const { mount, configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { Viewer } = require('../components/Taxonomy/Viewer')
const { Classes } = require('../components/Taxonomy/Classes')
const { SpacedChip } = require('../components/Taxonomy/AnnotationCounts')
const { PresentationListElement } = require('../components/Taxonomy/PresentationListElement')
const { JSDOM } = require('jsdom')
const { window } = new JSDOM(`<!doctype html>`)
const { i18n } = require('../utils')
const { wait } = require('./utils')
const { TaxonomyPresentation } = require('../components/Presentation/TaxonomyPresentation')
const { state_proxy, taxonomy_store, data_queries } = require('../store/instance_cache')

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  })
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js',
}
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0)
}
global.cancelAnimationFrame = function (id) {
  clearTimeout(id)
}
copyProps(window, global)

configure({ adapter: new Adapter() })
type Props = {};

data_queries.fetch_taxonomies = jest.fn(() => TAXONOMY_RESPONSE)
data_queries.fetch_taxonomy_classes = jest.fn(() => TAXONOMY_CLASSES_RESPONSE)
data_queries.flat_taxonomy_classes_counts = jest.fn(() => ANNOTATIONS_COUNTS_RESPONSE)
data_queries.get_annotations_browser_page = jest.fn(() => ({}))

const store_actions = new StoreActions(state_proxy, taxonomy_store)
const user_interactions = new UserInteractions(store_actions, taxonomy_store, data_queries, i18n, state_proxy)

const refresh_source_callback_mock = () => {
}

class TestableTaxonomyViewer extends React.Component<Props> {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Viewer
          state_proxy={state_proxy}
          user_interactions={user_interactions}
          store_actions={store_actions}
          refresh_source_by_status={refresh_source_callback_mock} />
      </MuiThemeProvider>
    )
  }
}

describe('Taxonomy viewer', () => {

  beforeEach(async () => {
    await user_interactions.fetch_taxonomies()
    await user_interactions.select_taxonomy(state_proxy.taxonomies[1])
  })

  test('Default data has new annotations', () => {
    expect(taxonomy_store.flat_taxonomy_classes[1].counts['new'])
      .toBeGreaterThan(0)
  })

  test('Default data has two tabs', () => {
    const wrapper = mount(<TestableTaxonomyViewer />)
    expect(wrapper.find(Tab).length)
      .toBe(2)
  })

  test('Default data has classes', () => {
    const wrapper = mount(<TestableTaxonomyViewer />)
    expect(wrapper.find(Classes).length)
      .toBeGreaterThan(1)
  })

  test('Default data shows count chips', async () => {
    const wrapper = mount(<TestableTaxonomyViewer />)
    expect(wrapper.find(SpacedChip).length)
      .toBeGreaterThan(0)
  })

  test('Taxonomy viewer from presentation page shows taxonomy.', async () => {
    const wrapper = mount(
      <TaxonomyPresentation
        state_proxy={state_proxy}
        user_interactions={user_interactions} />
    )
    expect(wrapper.find(PresentationListElement).length)
      .toBeGreaterThan(0)
  })

  test('When all filters are off there are no count chips', () => {
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW, false)
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED, false)
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED, false)
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED, false)
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED, false)
    store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED, false)
    const wrapper = mount(<TestableTaxonomyViewer />)
    expect(wrapper.find(SpacedChip).length)
      .toEqual(0)
  })

  test('Default data loads land cover', () => {
    const wrapper = mount(<TestableTaxonomyViewer />)
    expect(wrapper.html())
      .toContain('Couverture de sol')
  })

  test('Changing tabs loads taxonomy', async () => {
    const wrapper = mount(<TestableTaxonomyViewer />)
    const tabs = wrapper.find(Tab)
    tabs.last()
      .simulate('click')
    await wait(0)
    wrapper.update()
    expect(wrapper.html())
      .toContain('Objets')
    wrapper.unmount()
  })

})
