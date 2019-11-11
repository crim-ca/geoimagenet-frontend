// @flow strict
import React from 'react';
import { Actions } from './Actions';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';

type Props = {
  geoImageNetStore: GeoImageNetStore,
};

const Container = (props: Props) => {
  const { geoImageNetStore } = props;
  return (
    <Actions geoImageNetStore={geoImageNetStore} />
  );
};

export { Container };
