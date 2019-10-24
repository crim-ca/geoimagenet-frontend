// @flow strict
import * as React from 'react'
import { taxonomy_store, annotation_browser_store, ui_store } from './instance_cache'
import type { TaxonomyStore } from './TaxonomyStore'
import type { AnnotationBrowserStore } from './AnnotationBrowserStore'
import { UserInterfaceStore } from './UserInterfaceStore'

type InjectedForTaxonomy = {| taxonomy_store: TaxonomyStore |};

function withTaxonomyStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForTaxonomy |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} taxonomy_store={taxonomy_store} />
    )
  }
}

type InjectedForAnnotationBrowser = {| annotation_browser_store: AnnotationBrowserStore |};

function withAnnotationBrowserStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForAnnotationBrowser |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} annotation_browser_store={annotation_browser_store} />
    )
  }
}

type InjectedForUserInterface = {| ui_store: UserInterfaceStore |};

function withUserInterfaceStore<Config>(
  InnerComponent: React.AbstractComponent<{| ...Config, ...InjectedForUserInterface |}>,
): React.AbstractComponent<Config> {
  return function WrapperComponent(props: Config) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <InnerComponent {...props} ui_store={ui_store} />
    )
  }
}

export {
  withTaxonomyStore,
  withAnnotationBrowserStore,
  withUserInterfaceStore,
}
