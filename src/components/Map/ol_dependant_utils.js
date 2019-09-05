// @flow strict

import {Feature} from "ol/Feature";
import {Circle, Fill, Stroke, Style, Text} from "ol/style";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";

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
    return (feature, resolution) => {
        const {show_labels} = state_proxy;
        const taxonomy_class = state_proxy.flat_taxonomy_classes[feature.get('taxonomy_class_id')];
        const label = taxonomy_class.name_en || taxonomy_class.name_fr;
        const styles = [
            create_for_select_interaction ? select_style() : base_style(color),
        ];
        if (show_labels) {
            styles.push(new Style({
                text: new Text({
                    font: '16px Calibri, sans-serif',
                    fill: new Fill({color: '#000'}),
                    stroke: new Stroke({color: '#FFF', width: 2}),
                    text: resolution > 100 ? '' : label,
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
