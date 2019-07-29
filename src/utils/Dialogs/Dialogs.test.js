const React = require('react');
const {render, configure} = require('enzyme');
const {DialogManager} = require('./DialogManager');
const {DialogContainer} = require('./DialogContainer');
const Adapter = require('enzyme-adapter-react-16');

configure({adapter: new Adapter()});

describe('We should be able to instantiate the container and use it to display dialogs.', () => {
    test('Creating the container registers the dialog creation callback', () => {
        render(<DialogContainer />);
        expect(DialogManager.dialog_creation_callback).not.toBe(null);
    });
});
