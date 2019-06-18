const React = require('react');
const {Benchmarks} = require('../components/Benchmarks');
const {shallow, render, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const {create_client} = require('../utils/apollo');
const fetchMock = require('fetch-mock');

const client = create_client();
configure({adapter: new Adapter()});
fetchMock.post('/graphql', {"data":{"public_benchmarks":[{"id":"10452863-4408-442f-89f9-f275d358cc6e"},{"id":"4a615e3b-d109-4ade-a453-446898924ff4"}]}});

describe('We should render results from a data structure', () => {
    test('a component renders', () => {
        const component = shallow(<Benchmarks client={client} />);
        expect(true).toBe(true);
    });
    test('data from graphql query renders in a table', async () => {
        const component = render(<Benchmarks client={client} />);
        expect(component.find('.MuiTableRow-root')).toHaveLength(3); // two rows plus a header
    });
});
