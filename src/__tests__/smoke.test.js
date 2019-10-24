const React = require('react')
const { Benchmarks } = require('../components/Benchmarks')
const { Models } = require('../components/Models/Models')
const { shallow, render, configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
const { create_client } = require('../utils/apollo')
const fetchMock = require('fetch-mock')
const { ApolloProvider } = require('react-apollo')
const { MuiThemeProvider } = require('@material-ui/core')
const { theme } = require('../utils/react.js')

// need to call fetchMock before creating the client so that fetch gets mocked
fetchMock.post('/graphql', { 'data': { 'public_benchmarks': [{ 'id': '10452863-4408-442f-89f9-f275d358cc6e' }, { 'id': '4a615e3b-d109-4ade-a453-446898924ff4' }] } })
const client = create_client()
configure({ adapter: new Adapter() })

describe('We should render results from a data structure', () => {
  test('a component renders', () => {
    shallow(<ApolloProvider client={client}><Benchmarks /></ApolloProvider>)
    expect(true)
      .toBe(true)
  })
  test('data from graphql query renders in a table', async () => {
    const component = render(<ApolloProvider client={client}><Benchmarks /></ApolloProvider>)
    expect(component.find('.MuiTableRow-root'))
      .toHaveLength(3) // two rows plus a header
  })
})

describe('basic component rendering succeeds', () => {
  test('models page renders', () => {
    shallow(
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}><Models client={client} model_upload_instructions_url='' /></ApolloProvider>
      </MuiThemeProvider>
    )
    expect(true)
      .toBe(true)
  })
})
