// @flow strict

import { Feature } from 'ol/Feature';
import {
  Circle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import { VALID_OPENLAYERS_ANNOTATION_RESOLUTION } from '../../constants';
import { theme } from '../../utils/react';
import { features as activatedFeatures } from '../../../features';
import type { GeoImageNetStore } from '../../model/store/GeoImageNetStore';
import type { TaxonomyStore } from '../../model/store/TaxonomyStore';

type StyleFunction = (Feature, number) => Style | Style[];


function baseStyle(color: string): Style {
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.25)',
    }),
    stroke: new Stroke({
      color,
      width: 2,
    }),
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color,
      }),
    }),
  });
}

function selectStyle(): Style {
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.4)',
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 4,
    }),
  });
}

// Static styles to help with rendering.
const vectorStyles = {
  new: baseStyle(theme.colors.new),
  pre_release: baseStyle(theme.colors.pre_released),
  released: baseStyle(theme.colors.released),
  review: baseStyle(theme.colors.review),
  validated: baseStyle(theme.colors.validated),
  rejected: baseStyle(theme.colors.rejected),
  deleted: baseStyle(theme.colors.deleted),
};
const selectedStyle = selectStyle();

export function createStyleFunction(
  key: string,
  geoImageNetStore: GeoImageNetStore,
  taxonomyStore: TaxonomyStore,
  create_for_select_interaction: boolean = false,
): StyleFunction {
  return (feature: Feature, resolution: number) => {
    /**
     * While one might be tempted to move these variable access outside of the callback,
     * we must keep this code *inside* the callback otherwise the list is not updated in accordance to the changes to the followed users
     */
    const { showLabels, showAnnotatorsIdentifiers, user: { nicknamesMap } } = geoImageNetStore;
    if (!feature.get('taxonomy_class_id')) {
      return new Style();
    }
    const taxonomyClass = taxonomyStore.flat_taxonomy_classes[feature.get('taxonomy_class_id')];
    const label = taxonomyClass.name_en || taxonomyClass.name_fr;
    /**
     * theoretically, all features would have annotator ids. but y'know, theory and reality sometimes disagree.
     */
    const annotatorId = feature.get('annotator_id')
      ? feature.get('annotator_id')
        .toString()
      : '-1';
    // TODO if we need performance of styling, this check could happen at the create style level, and return a different function instead of making the check here
    const identifier = nicknamesMap.hasOwnProperty(annotatorId) ? nicknamesMap[annotatorId] : annotatorId;

    const bits = [];
    if (showLabels) {
      bits.push(label);
    }
    if (showAnnotatorsIdentifiers) {
      bits.push(`user ${identifier}`);
    }
    const finalText = bits.join(' : ');

    const styles = [
      create_for_select_interaction ? selectedStyle : vectorStyles[key],
    ];
    if (bits.length > 0) {
      styles.push(new Style({
        text: new Text({
          font: '16px Calibri, sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#FFF',
            width: 2,
          }),
          text: resolution > VALID_OPENLAYERS_ANNOTATION_RESOLUTION ? '' : finalText,
          overflow: true,
        }),
      }));
    }
    if (activatedFeatures.expertise && feature.get('review_requested')) {
      styles.push(new Style({
        text: new Text({
          font: '36px Calibri, sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#FFF',
            width: 2,
          }),
          text: resolution > VALID_OPENLAYERS_ANNOTATION_RESOLUTION ? '' : '?',
          overflow: true,
          offsetY: showLabels ? 36 : 0,
        }),
      }));
    }

    return styles;
  };
}
