//@flow

import {create_state_proxy, StoreActions} from "../store";
import {DataQueries} from "../domain/data-queries";
import {UserInteractions} from "../domain";
import {ANNOTATIONS_COUNTS_RESPONSE, TAXONOMY_CLASSES_RESPONSE, TAXONOMY_RESPONSE} from "./api_responses";
import {ANNOTATION} from "../domain/constants";

const React = require('react');
const {mount, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const {Viewer} = require('../components/Taxonomy/Viewer');
const {Selector} = require('../components/Taxonomy/Selector');
const {Classes} = require('../components/Taxonomy/Classes');
const {SpacedChip} = require('../components/Taxonomy/AnnotationCounts');
const {JSDOM} = require('jsdom');
const {window} = new JSDOM(`<!doctype html>`);
const {i18n} = require('../utils');
const wait = require('waait');
const {Tab} = require('@material-ui/core');

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
copyProps(window, global);

configure({adapter: new Adapter()});
type Props = {};

const data_queries = new DataQueries('', '', '');
const state_proxy = create_state_proxy();
const store_actions = new StoreActions(state_proxy);
const user_interactions = new UserInteractions(store_actions, data_queries, i18n);

data_queries.fetch_taxonomies = jest.fn(() => TAXONOMY_RESPONSE);
data_queries.fetch_taxonomy_classes = jest.fn(() => TAXONOMY_CLASSES_RESPONSE);
data_queries.flat_taxonomy_classes_counts = jest.fn(() => ANNOTATIONS_COUNTS_RESPONSE);

class TestableTaxonomyViewer extends React.Component<Props> {

    constructor(props) {
        super(props);
        this.state_proxy = state_proxy;
        this.store_actions = store_actions;
        this.data_queries = data_queries;
        this.user_interactions = user_interactions;
    }

    refresh_source_callback_mock = (source) => {
        console.log(`refreshing source ${source}`);
    };

    render() {
        return (
            <Viewer
                state_proxy={this.state_proxy}
                user_interactions={this.user_interactions}
                store_actions={this.store_actions}
                refresh_source_by_status={this.refresh_source_callback_mock} />
        );
    }
}

describe('Taxonomy viewer', () => {

    beforeEach(async () => {
        await user_interactions.fetch_taxonomies();
        await user_interactions.select_taxonomy(state_proxy.taxonomies[1].versions[0], state_proxy.taxonomies[1].name);
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

    test('Toggling filters shows and hides annotation counts', async () => {
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REVIEW);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED);
        const wrapper = mount(<TestableTaxonomyViewer />);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.NEW].activated).toBe(false);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.RELEASED].activated).toBe(false);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.REVIEW].activated).toBe(false);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.VALIDATED].activated).toBe(false);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toEqual(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.NEW].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
    });

    test('All different status have their chips appearing.', async () => {
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.NEW, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.RELEASED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REVIEW, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.VALIDATED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED, false);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED, false);
        const wrapper = mount(<TestableTaxonomyViewer />);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toEqual(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.PRE_RELEASED);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.PRE_RELEASED].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.REJECTED);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.REJECTED].activated).toBe(true);
        await wait(0);
        wrapper.update();
        expect(wrapper.find(SpacedChip).length).toBeGreaterThan(0);
        store_actions.toggle_annotation_status_visibility(ANNOTATION.STATUS.DELETED);
        expect(state_proxy.annotation_status_list[ANNOTATION.STATUS.DELETED].activated).toBe(true);
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
