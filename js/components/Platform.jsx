import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export class Platform extends Component {

    render() {
        return (
            <div className='platform'>
                <div id="map" className="map">
                    <span id="coordinates" className="coordinates"/>
                </div>
                <div className="right paper">
                    <div id="actions" className="actions"/>
                    <section className="taxonomy opened">
                        <button className="section-handle">Taxonomies and Classes</button>
                        <div id="taxonomy" className="taxonomy"/>
                        <ul id="taxonomy_classes" className="taxonomy_classes"/>
                    </section>
                    <section className="layer-switcher closed">
                        <button className="section-handle">Basemaps, Images and Filters</button>
                        <div id="layer-switcher" className="layer-switcher-container"/>
                    </section>
                </div>
            </div>
        );
    }
}

