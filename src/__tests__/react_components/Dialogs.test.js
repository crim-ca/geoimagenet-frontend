import { wait } from '../utils';

const React = require('react');
const { shallow, configure } = require('enzyme');
const { DialogManager } = require('../../components/Dialogs/DialogManager');
const { DialogContainer } = require('../../components/Dialogs/DialogContainer');
const { PromisifiedDialog } = require('../../components/Dialogs/PromisifiedDialog');
const { Dialog, DialogActions, Button } = require('@material-ui/core');
const Adapter = require('enzyme-adapter-react-16');
const { default_state } = require('../../components/Dialogs/DialogContainer');

configure({ adapter: new Adapter() });

describe('We should be able to instantiate the container and use it to display dialogs.', () => {

  test('Creating the container registers the dialog creation callback', () => {

    expect(DialogManager.dialog_creation_callback)
      .toBe(null);

    const wrapper = shallow(<DialogContainer />);
    expect(DialogManager.dialog_creation_callback)
      .not
      .toBe(null);
    expect(wrapper.state())
      .toEqual(default_state);

    /**
     * The dialog creation callback should be reset when the container is removed from the dom
     */
    wrapper.unmount();
    expect(DialogManager.dialog_creation_callback)
      .toBe(null);
  });

  test('Calling the confirm manager\'s method renders a dialog', async () => {
    const wrapper = shallow(<DialogContainer />);

    /**
     * both container's state and dialog props should not be opened
     */
    expect(wrapper.state().open)
      .toEqual(false);
    expect(wrapper.dive()
      .props().open)
      .toEqual(false);

    /**
     * we ignore the promise here, we just want the state to be correctly updated
     * we wait manually for the component to be rendered
     */
    DialogManager.confirm('test');
    await wait(1000);

    expect(wrapper.state().open)
      .toEqual(true);
    expect(wrapper.state().text)
      .toEqual('test');

    /**
     * Technically the prop should be equivalent to the passed state, but let's be sure anyway
     */
    expect(wrapper.dive()
      .props().open)
      .toEqual(true);
    wrapper.unmount();
  });

  test('We can resolve or reject the promise through the button clicks', async () => {
    const wrapper = shallow(<DialogContainer />);
    let promise;
    let buttons;

    promise = DialogManager.confirm('test accept');
    buttons = wrapper.find(PromisifiedDialog)
      .dive()
      .find(Dialog)
      .dive()
      .find(DialogActions)
      .dive()
      .find(Button);
    expect(buttons)
      .toHaveLength(2);
    buttons.first()
      .simulate('click');
    expect(promise)
      .resolves
      .toBe('test accept');

    expect(wrapper.state())
      .toEqual(default_state);

    promise = DialogManager.confirm('test reject');
    buttons = wrapper.find(PromisifiedDialog)
      .dive()
      .find(Dialog)
      .dive()
      .find(DialogActions)
      .dive()
      .find(Button);
    buttons.last()
      .simulate('click');
    expect(promise)
      .rejects
      .toBe('test reject');

    expect(wrapper.state())
      .toEqual(default_state);

    wrapper.unmount();
  });

  test('We can\'t render multiple containers', () => {
    const wrapper = shallow(<DialogContainer />);
    expect(() => {
      const second_wrapper = shallow(<DialogContainer />);
      second_wrapper.unmount();
    })
      .toThrow();
    wrapper.unmount();
  });

  test('Calling the confirm method without container correctly throws', async () => {
    await expect(DialogManager.confirm('test throw because no container'))
      .rejects
      .toEqual('There is no dialog creation callback registered. Did you instantiate a DialogContainer?');

    expect(() => {
      DialogManager.register_dialog_creation_callback('invalid function');
    })
      .toThrow('The dialog creation callback should be a function.');

    DialogManager.dialog_creation_callback = 'invalid function';
    await expect(DialogManager.confirm('test throw because invalid callback'))
      .rejects
      .toEqual('The dialog creation callback registered is not a function. ' +
        'Did you instantiate a DialogContainer?');
    DialogManager.dialog_creation_callback = null;
  });

});
