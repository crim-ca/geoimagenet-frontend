// @flow strict

import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { mount } from 'enzyme';
import { Annotation as AnnotationComponent } from '../../components/AnnotationBrowser/Annotation';
import { SelectionToggle } from '../../components/AnnotationBrowser/SelectionToggle';
import { theme } from '../../utils/react';
import { uiStore } from '../../model/instance_cache';
import { MODE } from '../../constants';

require('./define_global_jsdom');

describe('Annotation component', () => {
  let wrapper;

  beforeEach(() => {
    uiStore.setMode(MODE.VISUALIZATION);
    wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <AnnotationComponent />
      </MuiThemeProvider>,
    );
  });

  test('Components mounts without values', () => {
    expect(wrapper.find(AnnotationComponent).length)
      .toBe(1);
  });

  test('It has a toggleable control in validation mode', () => {
    uiStore.setMode(MODE.VALIDATION);
    wrapper.update();
    expect(wrapper.find(SelectionToggle).length)
      .toBe(1);
  });

  test('It shows status when in creation mode', () => {
    expect(wrapper.find('span').length)
      .toBe(3);
  });

  test('It does not show status when in evaluation mode', () => {
    uiStore.setMode(MODE.VALIDATION);
    wrapper.update();
    expect(wrapper.find('span').length)
      .toBe(6);
  });
});
