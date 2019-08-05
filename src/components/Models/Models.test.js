const {MockedProvider} = require('react-apollo/test-utils');
const React = require('react');
const {mount, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const {ModelsTable} = require('./ModelsTable');
const {BenchmarksTable} = require('./BenchmarksTable');
const {MODELS, LAUNCH_TEST_JOB, BENCHMARKS_JOBS} = require('../../domain/graphql_queries');
const wait = require('waait');
const {JSDOM} = require('jsdom');
const {window} = new JSDOM(`<!doctype html>`);

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

describe('We render some models', () => {
    test('Models table renders', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ModelsTable />
            </MockedProvider>
        );
        expect(wrapper.html()).toContain('Models');
        expect(wrapper.find(ModelsTable).html()).not.toContain('test_model');
        await wait(0);
        wrapper.update();
        expect(wrapper.find(ModelsTable)).toHaveLength(1);
        expect(wrapper.find(ModelsTable).html()).toContain('test_model');
        wrapper.unmount();
    });

    test('Launching a job adds a job to the jobs table', async () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <React.Fragment>
                    <ModelsTable />
                    <BenchmarksTable />
                </React.Fragment>
            </MockedProvider>
        );
        expect(wrapper.html()).toContain('Models');
        expect(wrapper.html()).toContain('Benchmarks');
        expect(wrapper.find(ModelsTable).html()).not.toContain('test_model');
        expect(wrapper.find(BenchmarksTable).html()).not.toContain('benchmark_id');

        await wait(0);
        wrapper.update();

        expect(wrapper.find(ModelsTable).html()).toContain('test_model');
        expect(wrapper.find(BenchmarksTable).html()).toContain('benchmark_id');

        const buttons = wrapper.find(ModelsTable).find('tbody').find('tr').find('button');
        expect(buttons).toHaveLength(1);
        buttons.simulate('click');

        await wait(0);
        wrapper.update();

        expect(wrapper.find(BenchmarksTable).html()).toContain('new-benchmark-id');
    });
});


const mocks = [
    {
        request: {
            query: MODELS,
        },
        result: {
            data: {
                models: [
                    {
                        id: '5193a839-de70-4533-a874-fc4361e27c53',
                        name: 'test_model',
                        path: '/data/geoimagenet/models/2019/6/ckpt.0000.PTW-SCPL1-20190425-162746.pth',
                        created: '2019-06-03T18:08:07.161000+00:00',
                        __typename: 'bruh',
                    }
                ]
            }
        }
    },
    {
        request: {
            query: LAUNCH_TEST_JOB,
            variables: {
                model_id: '5193a839-de70-4533-a874-fc4361e27c53', // this MUST correspond to the id of the mocked test_model
            }
        },
        result: {
            data: {
                launch_test: {
                    success: true,
                    message: '',
                    job: {
                        id: 'new-benchmark-id',
                        status: 'accepted',
                        progress: 1,
                        status_location: '',
                        visibility: 'hidden',
                    }
                }
            }
        }
    },
    {
        request: {
            query: BENCHMARKS_JOBS,
        },
        result: {
            data: {
                jobs: [
                    {
                        id: 'benchmark_id',
                        status: 'finished',
                        progress: 100,
                        status_location: '',
                        visibility: 'hidden',
                        __typename: 'bruh-benchmark',
                    }
                ]
            }
        }
    },
];
