// @flow strict

import React from "react";
import {withStyles} from "@material-ui/core";
import View from "ol/View";
import {fromLonLat} from "ol/proj";

import {Interactions} from "./Interactions";
import {MapManager} from "./MapManager";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store/StoreActions";
import {LayerSwitcher} from "../../LayerSwitcher";
import {UserInteractions} from "../../domain";
import {TaxonomyStore} from '../../store/TaxonomyStore';
import {OpenLayersStore} from "../../store/OpenLayersStore";
import {VIEW_CENTER} from "../../domain/constants";
import {autorun} from "mobx";

type Props = {
    classes: { root: {} },
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    user_interactions: UserInteractions,
    open_layers_store: OpenLayersStore,
};

const styles = {
    root: {
        gridRow: '1/3',
        gridColumn: '1/3',
    }
};

class MapContainer extends React.Component<Props> {

    map_manager: MapManager;

    /**
     * Since we need DOM elements to exist to create Open Layers maps, we hook onto React's componentDidMount lifecycle
     * callback and create the map manager only when the dom is correctly created.
     */
    componentDidMount(): void {
        const {state_proxy, store_actions, user_interactions, open_layers_store} = this.props;

        user_interactions.populate_image_dictionary();

        /**
         * The Layer Switcher is paramount to the map: it should allow easy access and toggling to the various displayed layers.
         */
        const layer_switcher = new LayerSwitcher(
            {target: 'layer-switcher'},
            store_actions.toggle_annotation_status_visibility
        );

        const view = new View({
            center: fromLonLat(open_layers_store.center),
            zoom: open_layers_store.zoom_level,
        });

        let first = true;
        autorun(() => {
            const extent = open_layers_store.extent;
            if (first === true) {
                first = false;
                return;
            }
            view.fit(extent, {duration: 800});
        });


        this.map_manager = new MapManager(
            GEOSERVER_URL,
            ANNOTATION_NAMESPACE,
            ANNOTATION_LAYER,
            'map',
            view,
            state_proxy,
            open_layers_store,
            store_actions,
            layer_switcher,
            user_interactions,
            new TaxonomyStore(state_proxy),
        );

        new Interactions(this.map_manager.map, state_proxy, user_interactions, open_layers_store, this.map_manager.formatGeoJson, this.map_manager.formatWKT, ANNOTATION_LAYER);
    }

    render() {
        const {classes} = this.props;
        return <div id='map' className={classes.root} />;
    }
}

const component = withStyles(styles)(MapContainer);

export {component as MapContainer};
