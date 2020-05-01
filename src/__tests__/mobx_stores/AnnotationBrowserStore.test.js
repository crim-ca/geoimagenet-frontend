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
        { properties: { id: 1 } },
        { properties: { id: 2 } },
        { properties: { id: 3 } },
        { properties: { id: 4 } },
        { properties: { id: 5 } },
        { properties: { id: 6 } },
        { properties: { id: 7 } },
        { properties: { id: 8 } },
        { properties: { id: 9 } },
        { properties: { id: 10 } },
      ],
    });
  });

  test('The store have an observable with all annotations ids', () => {
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
      });
  });

  test('Toggling one id changes the selection', () => {
    annotationBrowserStore.toggleAnnotationSelection(6);
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false,
        7: true,
        8: true,
        9: true,
        10: true,
      });
  });

  test('Moving page resets selection', () => {
    annotationBrowserStore.toggleAnnotationSelection(6);
    annotationBrowserStore.setWfsResponse({
      features: [
        { properties: { id: 23 } },
      ],
    });
    annotationBrowserStore.setWfsResponse({
      features: [
        { properties: { id: 1 } },
        { properties: { id: 2 } },
        { properties: { id: 3 } },
        { properties: { id: 4 } },
        { properties: { id: 5 } },
        { properties: { id: 6 } },
        { properties: { id: 7 } },
        { properties: { id: 8 } },
        { properties: { id: 9 } },
        { properties: { id: 10 } },
      ],
    });
    expect(annotationBrowserStore.selection)
      .toEqual({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
      });
  });

  test('We have a fullSelection as true when everything is selected', () => {
    // annotationBrowserStore.toggleAnnotationSelection(1);
    // annotationBrowserStore.toggleAnnotationSelection(2);
    // annotationBrowserStore.toggleAnnotationSelection(3);
    // annotationBrowserStore.toggleAnnotationSelection(4);
    // annotationBrowserStore.toggleAnnotationSelection(5);
    // annotationBrowserStore.toggleAnnotationSelection(6);
    // annotationBrowserStore.toggleAnnotationSelection(7);
    // annotationBrowserStore.toggleAnnotationSelection(8);
    // annotationBrowserStore.toggleAnnotationSelection(9);
    // annotationBrowserStore.toggleAnnotationSelection(10);
    expect(annotationBrowserStore.fullSelection)
      .toBe(true);
  });

  test('We have a fullSelection as false when even one is deselected', () => {
    annotationBrowserStore.toggleAnnotationSelection(5);

    expect(annotationBrowserStore.fullSelection)
      .toBe(false);
  });

  test('We can select all annotations when they\'re all false', () => {
    annotationBrowserStore.toggleAllAnnotationSelection();
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

  test('We deselect all annotations when they\'re all selected', () => {
    annotationBrowserStore.toggleAllAnnotationSelection();
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
