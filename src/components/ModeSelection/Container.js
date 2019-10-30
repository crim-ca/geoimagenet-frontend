// @flow strict
import React from 'react';
import { Actions } from './Actions';
import type { GeoImageNetStore } from '../../store/GeoImageNetStore';

type Props = {
  state_proxy: GeoImageNetStore,
};

const Container = (props: Props) => {
  const { state_proxy } = props;
  return (
    <Actions state_proxy={state_proxy} />
  );
};

export { Container };
