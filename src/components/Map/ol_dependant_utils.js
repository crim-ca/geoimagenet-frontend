// @flow strict

import {Feature} from "ol/Feature";
import {Circle, Fill, Stroke, Style, Text} from "ol/style";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import type {FollowedUser} from "../../Types";

type StyleFunction = (Feature, number) => Style | Style[];

function base_style(color: string): Style {
    return new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.25)',
        }),
        stroke: new Stroke({
            color: color,
            width: 2
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
                color: color,
            })
        }),
    });
}

function select_style(): Style {
    return new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.4)',
        }),
        stroke: new Stroke({
            color: 'blue',
            width: 4
        }),
    });
}

export function create_style_function(color: string, state_proxy: GeoImageNetStore, create_for_select_interaction: boolean = false): StyleFunction {

    return (feature: Feature, resolution: number) => {

        /**
         * If there is a logged user (it's possible there isn't, people can access the map in anonymous mode)
         * then we should not be trying to substitute nicknames for ids
         *
         * NOTE we must keep this code *inside* the callback otherwise the list is not updated in accordance to the changes to the followed users
         */
        const {nickname_map} = state_proxy;

        const {show_labels, show_annotators_identifiers} = state_proxy;
        const taxonomy_class = state_proxy.flat_taxonomy_classes[feature.get('taxonomy_class_id')];
        const label = taxonomy_class.name_en || taxonomy_class.name_fr;
        /**
         * theoretically, all features would have annotator ids. but y'know, theory and reality sometimes disagree.
         */
        const annotator_id = feature.get('annotator_id') ? feature.get('annotator_id').toString() : '-1';
        // TODO if we need performance of styling, this check could happen at the create style level, and return a different function instead of making the check here
        const identifier = nickname_map.hasOwnProperty(annotator_id) ? nickname_map[annotator_id] : annotator_id;

        const bits = [];
        if (show_labels) {
            bits.push(label);
        }
        if (show_annotators_identifiers) {
            bits.push(`user ${identifier}`);
        }
        const final_text = bits.join(' : ');

        const styles = [
            create_for_select_interaction ? select_style() : base_style(color),
        ];
        if (bits.length > 0) {
            styles.push(new Style({
                text: new Text({
                    font: '16px Calibri, sans-serif',
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({color: '#FFF', width: 2}),
                    text: resolution > 100 ? '' : final_text,
                    overflow: true,
                }),
            }));
        }
        if (feature.get('review_requested')) {
            styles.push(new Style({
                text: new Text({
                    font: '36px Calibri, sans-serif',
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({color: '#FFF', width: 2}),
                    text: resolution > 100 ? '' : '?',
                    overflow: true,
                    offsetY: show_labels ? 36 : 0,
                }),
            }));
        }
        return styles;
    };
}
