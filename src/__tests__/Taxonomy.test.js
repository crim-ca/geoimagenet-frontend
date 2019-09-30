//@flow

import {StoreActions} from "../store/StoreActions";
import {DataQueries} from "../domain/data-queries";
import {UserInteractions} from "../domain";
import {ANNOTATIONS_COUNTS_RESPONSE, TAXONOMY_CLASSES_RESPONSE, TAXONOMY_RESPONSE} from "./api_responses";
import {ANNOTATION} from "../domain/constants";
import {GeoImageNetStore} from "../store/GeoImageNetStore";
import {TaxonomyStore} from "../store/TaxonomyStore";

const React = require('react');
const {mount, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const {Viewer} = require('../components/Taxonomy/Viewer');
const {Selector} = require('../components/Taxonomy/Selector');
const {Classes} = require('../components/Taxonomy/Classes');
const {SpacedChip} = require('../components/Taxonomy/AnnotationCounts');
const {PresentationListElement} = require('../components/Taxonomy/PresentationListElement');
const {JSDOM} = require('jsdom');
const {window} = new JSDOM(`<!doctype html>`);
const {i18n} = require('../utils');
const {wait} = require('./utils');
const {Tab} = require('@material-ui/core');
const {TaxonomyPresentation} = require('../components/Presentation/TaxonomyPresentation');

function copyProps(src, target) {
    Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
    });
}

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};
global.GEOIMAGENET_API_URL = '';
copyProps(window, global);

configure({adapter: new Adapter()});
type Props = {};

const data_queries = new DataQueries('', '', '', '');
const state_proxy = new GeoImageNetStore();
const taxonomy_store = new TaxonomyStore(state_proxy);
const store_actions = new StoreActions(state_proxy);
const user_interactions = new UserInteractions(store_actions, taxonomy_store, data_queries, i18n, state_proxy);

data_queries.fetch_taxonomies = jest.fn(() => TAXONOMY_RESPONSE);
data_queries.fetch_taxonomy_classes = jest.fn(() => TAXONOMY_CLASSES_RESPONSE);
data_queries.flat_taxonomy_classes_counts = jest.fn(() => ANNOTATIONS_COUNTS_RESPONSE);

const refresh_source_callback_mock = () => {
};

class TestableTaxonomyViewer extends React.Component<Props> {

    render() {
        return (
            <Viewer
                state_proxy={state_proxy}
                taxonomy_store={taxonomy_store}
                user_interactions={user_interactions}
                store_actions={store_actions}
                refresh_source_by_status={refresh_source_callback_mock} />
        );
    }
}

describe('Taxonomy viewer', () => {

    beforeEach(async () => {
        await user_interactions.fetch_taxonomies();
        await user_interactions.select_taxonomy(state_proxy.taxonomies[1]);
    });

    test('Building the taxonomy from real data shows annotations', async () => {
        expect(state_proxy.flat_taxonomy_classes[1].counts['new']).toBeGreaterThan(0);
        const wrapper = mount(<TestableTaxonomyViewer />);
        expect(wrapper.find(Viewer)).toHaveLength(1);
        expect(wrapper.find(Selector)).toHaveLength(1);
        expect(wrapper.find(Classes).length).toBeGreaterThan(1);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
    });

    test('Taxonomy viewer from presentation page shows taxonomy.', async () => {
        const wrapper = mount(
            <TaxonomyPresentation
                state_proxy={state_proxy}
                taxonomy_store={taxonomy_store}
                user_interactions={user_interactions} />
        );
        expect(wrapper.find(PresentationListElement).length).toBeGreaterThan(0);
    });

    test('Toggling filters shows and hides annotation counts', async () => {
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED);
        const wrapper = mount(<TestableTaxonomyViewer />);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.NEW].activated).toBe(false);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.RELEASED].activated).toBe(false);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.VALIDATED].activated).toBe(false);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.PRE_RELEASED].activated).toBe(false);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.REJECTED].activated).toBe(false);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.DELETED].activated).toBe(false);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toEqual(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.NEW].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
    });

    test('All different status have their chips appearing.', async () => {
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED, false);
        const wrapper = mount(<TestableTaxonomyViewer />);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toEqual(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.PRE_RELEASED].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.REJECTED].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED);
        expect(state_proxy.annotation_status_filters[ANNOTATION.STATUS.DELETED].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);

    });

    test('Changing tabs loads taxonomy', async () => {
        const wrapper = mount(<TestableTaxonomyViewer />);
        await wait(0);
        wrapper.update();
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(2);
        tabs.first().simulate('click');
        await wait(0);
        wrapper.update();
        expect(wrapper.html()).toContain('Land cover');
        tabs.last().simulate('click');
        await wait(0);
        wrapper.update();
        expect(wrapper.html()).toContain('Objects');
        wrapper.unmount();
    });

});
