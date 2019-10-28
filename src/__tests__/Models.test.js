// @flow strict

import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../utils/react';

const { MockedProvider } = require('react-apollo/test-utils');
const React = require('react');
const { mount, configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { Models } = require('../components/Models/Models');
const { ModelsTable } = require('../components/Models/ModelsTable');
const { BenchmarksTable } = require('../components/Models/BenchmarksTable');
const { UploadForm } = require('../components/Models/UploadForm');
const { MODELS, LAUNCH_TEST_JOB, BENCHMARKS_JOBS, UPLOAD_MODEL } = require('../domain/graphql_queries');
const { NotificationContainer } = require('react-notifications');
const { wait } = require('./utils');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`<!doctype html>`);

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

configure({ adapter: new Adapter() });

type Props = {
  mocks: {}[],
}

class TestingModels extends React.Component<Props> {
  render() {
    const { mocks } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Models model_upload_instructions_url='/instructions' />
        </MockedProvider>
        <NotificationContainer />
      </MuiThemeProvider>
    );
  }
}

const dummy_file = new File(['foo'], 'filename');

describe('We render some models', () => {
  test('Models table renders', async () => {
    const wrapper = mount(<TestingModels mocks={mocks} />);
    expect(wrapper.html())
      .toContain('Models');
    expect(wrapper.find(ModelsTable)
      .html())
      .not
      .toContain('test_model');
    await wait(0);
    wrapper.update();
    expect(wrapper.find(ModelsTable))
      .toHaveLength(1);
    expect(wrapper.find(ModelsTable)
      .html())
      .toContain('test_model');
    expect(wrapper.find(BenchmarksTable)
      .html())
      .toContain('Job done.');
    wrapper.unmount();
  });

  test('Launching a job adds a job to the jobs table', async () => {
    const wrapper = mount(<TestingModels mocks={mocks} />);
    expect(wrapper.html())
      .toContain('Models');
    expect(wrapper.html())
      .toContain('Benchmarks');
    expect(wrapper.find(ModelsTable)
      .html())
      .not
      .toContain('test_model');
    expect(wrapper.find(BenchmarksTable)
      .html())
      .not
      .toContain('benchmark_id');

    await wait(0);
    wrapper.update();

    expect(wrapper.find(ModelsTable)
      .html())
      .toContain('test_model');
    expect(wrapper.find(BenchmarksTable)
      .html())
      .toContain('benchmark_id');

    const buttons = wrapper.find(ModelsTable)
      .find('tbody')
      .find('tr')
      .find('button');
    expect(buttons)
      .toHaveLength(1);
    buttons.simulate('click');

    await wait(0);
    wrapper.update();

    expect(wrapper.find(BenchmarksTable)
      .html())
      .toContain('new-benchmark-id');
    wrapper.unmount();
  });

  test('No dataset error on job launch show notification', async () => {
    const wrapper = mount(<TestingModels mocks={no_dataset_error_mock} />);

    await wait(0);
    wrapper.update();

    wrapper.find(ModelsTable)
      .find('tbody')
      .find('tr')
      .find('button')
      .simulate('click');

    await wait(0);
    wrapper.update();

    const notification_container = wrapper.find(NotificationContainer);
    expect(notification_container)
      .toHaveLength(1);
    expect(notification_container.html())
      .toContain('There does not seem to be datasets yet. Please ask your admin to create a dataset before launching tests.');

    wrapper.unmount();
  });

  test('Upload form uploads a file and reloads table', async () => {
    const wrapper = mount(<TestingModels mocks={mocks} />);
    let upload_form = wrapper.find(UploadForm);
    expect(upload_form)
      .toHaveLength(1);
    let button = upload_form.find('button');
    expect(button)
      .toHaveLength(1);
    expect(button.prop('disabled'))
      .toEqual(true);

    const file_input = upload_form.find('input')
      .filterWhere(n => n.prop('type') === 'file');
    expect(file_input)
      .toHaveLength(1);

    file_input.simulate('change', {
      target: {
        validity: { valid: true },
        files: [dummy_file]
      }
    });

    await wait(0);
    wrapper.update();

    upload_form = wrapper.find(UploadForm);
    button = upload_form.find('button');
    expect(button.prop('disabled'))
      .toEqual(false);

    // TODO finish this test, upload is not thoroughly acceptably tested

    wrapper.unmount();
  });
});

const MODELS_MOCK_QUERY = {
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
        }
      ]
    }
  }
};

const no_dataset_error_mock = [
  MODELS_MOCK_QUERY,
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
          success: false,
          message: 'There does not seem to be datasets yet. Please ask your admin to create a dataset before launching tests.',
          job: null
        }
      }
    }
  }
];

const mocks = [
  {
    request: {
      query: UPLOAD_MODEL,
      variables: {
        model_name: 'new-model',
        file: dummy_file,
      }
    },
    result: {
      data: {
        upload_model: {
          success: true,
          message: '',
          model: {
            name: 'new-model',
          }
        },
      }
    },
  },
  MODELS_MOCK_QUERY,
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
            status_message: '',
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
            status_message: 'Job done.',
            visibility: 'hidden',
          }
        ]
      }
    }
  },
];
