// @flow strict
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MuiThemeProvider } from '@material-ui/core';
import { JSDOM } from 'jsdom';
import { GeoImageNetStore } from '../model/store/GeoImageNetStore';
import { StoreActions } from '../model/StoreActions';
import { UserInteractions } from '../domain/user-interactions';
import { Container as UserSettingsContainer } from '../components/UserSettings/Container';
import { FollowedUsersList } from '../components/UserSettings/FollowedUsersList';
import { AddFollowedUserForm } from '../components/UserSettings/AddFollowedUserForm';
import { Sidebar } from '../components/Sidebar';
import { i18n as i18next } from '../utils/i18n';
import { User } from '../model/User';
import { TaxonomyStore } from '../model/store/TaxonomyStore';
import { copyProps, wait } from './utils';
import { UserInterfaceStore } from '../model/store/UserInterfaceStore';
import { OpenLayersStore } from '../model/store/OpenLayersStore';
import { theme } from '../utils/react';
import { dataQueries } from '../model/instance_cache';

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

const userWithoutFollowedUsers = new User('user_name', 'email', [], 1, [], true);
// $FlowFixMe
dataQueries.persistFollowedUser = jest.fn(async () => true);
// $FlowFixMe
dataQueries.remove_followed_user = jest.fn(async () => true);

describe('Followed users form', () => {
  test('Anonymous user does not have settings section', () => {
    const geoImageNetStore = new GeoImageNetStore();
    const uiStore = new UserInterfaceStore();
    const taxonomyStore = new TaxonomyStore(uiStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore, uiStore);
    const openLayersStore = new OpenLayersStore(null);
    const userInteractions = new UserInteractions(storeActions, taxonomyStore, dataQueries, i18next, geoImageNetStore);
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Sidebar
          geoImageNetStore={geoImageNetStore}
          storeActions={storeActions}
          userInteractions={userInteractions}
          openLayersStore={openLayersStore}
        />
      </MuiThemeProvider>,
    );
    expect(wrapper.find(FollowedUsersList).length)
      .toBe(0);
  });

  test('We can log a user on', () => {
    const geoImageNetStore = new GeoImageNetStore();
    const uiStore = new UserInterfaceStore();
    const taxonomyStore = new TaxonomyStore(uiStore);
    const storeActions = new StoreActions(geoImageNetStore, taxonomyStore, uiStore);
    storeActions.set_session_user(userWithoutFollowedUsers);
    /**
     * $FlowFixMe
     * We are in a controlled situation, the logged user is not null
     */
    expect(geoImageNetStore.user.name)
      .toBe('user_name');
  });
});

/**
 * we want to validate that the form will populate the user's followed users list
 * for that, we need a store and the form
 */
describe('Add followed user form validates input, adds and removes user', () => {
  let store;
  let uiStore;
  let taxonomyStore;
  let storeActions;
  let userInteractions;
  let wrapper;
  let idInput;
  let nicknameInput;
  let submitButton;

  beforeEach(() => {
    store = new GeoImageNetStore();
    uiStore = new UserInterfaceStore();
    taxonomyStore = new TaxonomyStore(uiStore);
    storeActions = new StoreActions(store, taxonomyStore, uiStore);
    userInteractions = new UserInteractions(storeActions, taxonomyStore, dataQueries, i18next, store);
    storeActions.set_session_user(userWithoutFollowedUsers);
    wrapper = mount(<UserSettingsContainer user={store.user} userInteractions={userInteractions} />);
  });

  test('Logged user without followed users has access to the list and form', () => {
    expect(wrapper.find(FollowedUsersList))
      .toHaveLength(1);
    idInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    nicknameInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');
    submitButton = wrapper.find(AddFollowedUserForm)
      .find('button');
    expect(idInput)
      .toHaveLength(1);
    expect(nicknameInput)
      .toHaveLength(1);
    expect(submitButton)
      .toHaveLength(1);
    expect(submitButton.props().disabled)
      .toBe(true);
  });

  test('entering values activates the form', async () => {
    idInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    nicknameInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');

    idInput.simulate('change', { target: { value: '2' } });
    nicknameInput.simulate('change', { target: { value: 'name' } });
    await wait(0);
    wrapper.update();

    idInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    nicknameInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');
    submitButton = wrapper.find(AddFollowedUserForm)
      .find('button');
    expect(submitButton.props().disabled)
      .toBe(false);
    expect(idInput.props().value)
      .toBe('2');
    expect(nicknameInput.props().value)
      .toBe('name');
  });

  test('Saving the form adds a user to the list', async () => {
    idInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="id"]');
    nicknameInput = wrapper.find(AddFollowedUserForm)
      .find('input[id="nickname"]');
    submitButton = wrapper.find(AddFollowedUserForm)
      .find('button');

    idInput.simulate('change', { target: { value: '2' } });
    nicknameInput.simulate('change', { target: { value: 'name' } });
    submitButton.simulate('click');
    await wait(0);
    wrapper.update();

    expect(store.user.followed_users.length)
      .toBe(1);
    const materialRows = wrapper.find(FollowedUsersList)
      .find('tbody')
      .find('tr.MuiTableRow-root');
    expect(materialRows)
      .toHaveLength(6);
    const userEntry = materialRows.first();
    const deleteButton = userEntry.find('button');
    expect(deleteButton)
      .toHaveLength(1);
    deleteButton.simulate('click');
    await wait(0);
    wrapper.update();
    /**
     * $FlowFixMe
     * We are in a controlled situation, the logged user is not null
     */
    expect(store.user.followed_users.length)
      .toBe(0);
  });
});
