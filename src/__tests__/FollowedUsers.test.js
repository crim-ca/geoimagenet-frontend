// @flow strict
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import { GeoImageNetStore } from '../model/store/GeoImageNetStore';
import { StoreActions } from '../model/StoreActions';
import { DataQueries } from '../domain/data-queries';
import { UserInteractions } from '../domain';
import { Container as UserSettingsContainer } from '../components/UserSettings/Container';
import { FollowedUsersList } from '../components/UserSettings/FollowedUsersList';
import { AddFollowedUserForm } from '../components/UserSettings/AddFollowedUserForm';
import { i18n as i18next } from '../utils/i18n';
import { User } from '../model/entities';
import { TaxonomyStore } from '../model/store/TaxonomyStore';
import { copyProps, wait } from './utils';
import { UserInterfaceStore } from '../model/store/UserInterfaceStore';

const { window } = new JSDOM('<!doctype html>');

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};
copyProps(window, global);

configure({ adapter: new Adapter() });

const dataQueries = new DataQueries('', '', '', '');
const user_without_followed_users = new User('user_name', 'email', [], 1, []);
// $FlowFixMe
dataQueries.save_followed_user = jest.fn(() => null);
// $FlowFixMe
dataQueries.remove_followed_user = jest.fn(() => null);

describe('Followed users form', () => {
  test('We can log a user on', () => {
    const geoImageNetStore = new GeoImageNetStore();
    const uiStore = new UserInterfaceStore();
    const taxonomyStore = new TaxonomyStore(uiStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore, uiStore);
    storeActions.set_session_user(user_without_followed_users);
    /**
     * $FlowFixMe
     * We are in a controlled situation, the logged user is not null
     */
    expect(geoImageNetStore.logged_user.user_name)
      .toBe('user_name');
  });

  /**
   * we want to validate that the form will populate the logged_user's followed users list
   * for that, we need a store and the form
   */
  test('Add followed user form validates input, adds and removes user', async () => {
    const store = new GeoImageNetStore();
    const uiStore = new UserInterfaceStore();
    const taxonomyStore = new TaxonomyStore(uiStore);
    const storeActions = new StoreActions(store, taxonomyStore, uiStore);
    const userInteractions = new UserInteractions(storeActions, taxonomyStore, dataQueries, i18next, store);
    storeActions.set_session_user(user_without_followed_users);
    const wrapper = mount(<UserSettingsContainer user={store.logged_user} userInteractions={userInteractions} />);
    expect(wrapper.find(FollowedUsersList))
      .toHaveLength(1);
    let id_input = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    let nickname_input = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');
    let submit_button = wrapper.find(AddFollowedUserForm)
      .find('button');
    expect(id_input)
      .toHaveLength(1);
    expect(nickname_input)
      .toHaveLength(1);
    expect(submit_button)
      .toHaveLength(1);
    expect(submit_button.props().disabled)
      .toBe(true);
    id_input.simulate('change', { target: { value: '2' } });
    nickname_input.simulate('change', { target: { value: 'name' } });
    await wait(0);
    wrapper.update();
    id_input = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    nickname_input = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');
    submit_button = wrapper.find(AddFollowedUserForm)
      .find('button');
    expect(submit_button.props().disabled)
      .toBe(false);
    expect(id_input.props().value)
      .toBe('2');
    expect(nickname_input.props().value)
      .toBe('name');
    submit_button.simulate('click');
    await wait(0);
    wrapper.update();
    /**
     * $FlowFixMe
     * We are in a controlled situation, the logged user is not null
     */
    expect(store.logged_user.followed_users.length)
      .toBe(1);
    const material_rows = wrapper.find(FollowedUsersList)
      .find('tbody')
      .find('tr.MuiTableRow-root');
    expect(material_rows)
      .toHaveLength(6);
    const user_entry = material_rows.first();
    const delete_button = user_entry.find('button');
    expect(delete_button)
      .toHaveLength(1);
    delete_button.simulate('click');
    await wait(0);
    wrapper.update();
    /**
     * $FlowFixMe
     * We are in a controlled situation, the logged user is not null
     */
    expect(store.logged_user.followed_users.length)
      .toBe(0);
  });
});
