// @flow strict

import { AnnotationBrowserStore } from '../../model/store/AnnotationBrowserStore';
import { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import { UserInterfaceStore } from '../../model/store/UserInterfaceStore';
import { TaxonomyStore } from '../../model/store/TaxonomyStore';
import { DataQueries } from '../../domain/data-queries';

describe('Annotation browser store', () => {
  let annotationBrowserStore;

  beforeEach(() => {
    const geoImageNetStore = new GeoImageNetStore();
    const uiStore = new UserInterfaceStore();
    const taxonomyStore = new TaxonomyStore(uiStore);
    const dataQueries = new DataQueries('', '', '', '');
    annotationBrowserStore = new AnnotationBrowserStore(
      '',
      '',
      '',
      geoImageNetStore,
      uiStore,
      taxonomyStore,
      dataQueries,
    );
    annotationBrowserStore.setWfsResponse({
      features: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ],
    });
  });

  test('The store have an observable with all annotations ids', () => {
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
      });
  });

  test('Toggling one id changes the selection', () => {
    annotationBrowserStore.toggleAnnotationSelection(6);
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: true,
        7: false,
        8: false,
        9: false,
        10: false,
      });
  });

  test('Moving page resets selection', () => {
    annotationBrowserStore.toggleAnnotationSelection(6);
    annotationBrowserStore.setWfsResponse({
      features: [
        { id: 23 },
      ],
    });
    annotationBrowserStore.setWfsResponse({
      features: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ],
    });
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
      });
  });
});
