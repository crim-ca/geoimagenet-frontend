// @flow strict

import {withStyles} from "@material-ui/core";
import React from "react";
import {LayerSwitcher} from "../../LayerSwitcher";
import {MapManager} from "./MapManager";
import {GeoImageNetStore} from "../../store/GeoImageNetStore";
import {StoreActions} from "../../store/StoreActions";
import {UserInteractions} from "../../domain";
import {Interactions} from "./Interactions";

type Props = {
    classes: { root: {} },
    state_proxy: GeoImageNetStore,
    store_actions: StoreActions,
    user_interactions: UserInteractions,
};

const styles = {
    root: {
        gridRow: '1/3',
        gridColumn: '1/3',
    }
};

class MapContainer extends React.Component<Props> {

    map_manager: MapManager;
    layer_switcher: LayerSwitcher;

    /**
     * Since we need DOM elements to exist to create Open Layers maps, we hook onto React's componentDidMount lifecycle
     * callback and create the map manager only when the dom is correctly created.
     */
    componentDidMount(): void {
        const {state_proxy, store_actions, user_interactions} = this.props;

        /**
         * The Layer Switcher is paramount to the map: it should allow easy access and toggling to the various displayed layers.
         * @private
         * @type {LayerSwitcher}
         */
        this.layer_switcher = new LayerSwitcher(
            {target: 'layer-switcher'},
            store_actions.toggle_annotation_status_visibility
        );

        this.map_manager = new MapManager(
            GEOSERVER_URL,
            ANNOTATION_NAMESPACE,
            ANNOTATION_LAYER,
            'map',
            state_proxy,
            store_actions,
            this.layer_switcher,
            user_interactions
        );

        new Interactions(this.map_manager.map, state_proxy, user_interactions, this.map_manager.formatGeoJson, ANNOTATION_LAYER, ANNOTATION_NAMESPACE);
    }

    render() {
        const {classes} = this.props;
        return <div id='map' className={classes.root} />;
    }
}

const StyledMapContainer = withStyles(styles)(MapContainer);

export {StyledMapContainer as MapContainer};
