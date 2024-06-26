// @flow strict
import * as React from 'react';
import {
  taxonomyStore,
  annotationBrowserStore,
  uiStore,
  dataQueries,
} from './instance_cache';
import type { TaxonomyStore } from './store/TaxonomyStore';
import type { AnnotationBrowserStore } from './store/AnnotationBrowserStore';
import type { UserInterfaceStore } from './store/UserInterfaceStore';
import type { DataQueries } from '../domain/data-queries';

type InjectedForTaxonomy = {| taxonomyStore: TaxonomyStore |};

function withTaxonomyStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForTaxonomy |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} taxonomyStore={taxonomyStore} />
    );
  };
}

type InjectedForAnnotationBrowser = {| annotationBrowserStore: AnnotationBrowserStore |};

function withAnnotationBrowserStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForAnnotationBrowser |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} annotationBrowserStore={annotationBrowserStore} />
    );
  };
}

type InjectedForUserInterface = {| uiStore: UserInterfaceStore |};

function withUserInterfaceStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForUserInterface |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} uiStore={uiStore} />
    );
  };
}

type InjectedForDataQueries = {| dataQueries: DataQueries |};

function withDataQueries<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForDataQueries |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} dataQueries={dataQueries} />
    );
  };
}

export {
  withTaxonomyStore,
  withAnnotationBrowserStore,
  withUserInterfaceStore,
  withDataQueries,
};
