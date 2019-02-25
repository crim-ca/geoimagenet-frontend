import * as ol from 'ol';
import {Control} from 'ol/control';
import {unByKey} from 'ol/Observable';

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

class LayerSwitcher extends Control {

    constructor(opt_options) {

        const options = opt_options || {};
        const element = document.createElement('div');

        super({
            element: element,
            target: options.target,
        });

        this.mapListeners = [];

        this.hiddenClassName = 'layer-switcher';
        if (isTouchDevice()) {
            this.hiddenClassName += ' touch';
        }
        this.shownClassName = 'shown';

        element.className = this.hiddenClassName;

        this.panel = document.createElement('div');
        this.panel.className = 'panel';
        element.appendChild(this.panel);
        this.enableTouchScroll_(this.panel);

        this.forEachRecursive = this.forEachRecursive.bind(this);


    };

    /**
     * Re-draw the layer panel to represent the current state of the layers.
     */
    renderPanel() {

        this.ensureTopVisibleBaseLayerShown_();

        while (this.panel.firstChild) {
            this.panel.removeChild(this.panel.firstChild);
        }

        const ul = document.createElement('ul');
        this.panel.appendChild(ul);
        this.renderLayers_(this.getMap(), ul);

    };

    /**
     * Set the map instance the control is associated with.
     * @param {ol.Map} map The map instance.
     */
    setMap(map) {
        // Clean up listeners associated with the previous map
        for (let i = 0; i < this.mapListeners.length; i++) {
            unByKey(this.mapListeners[i]);
        }
        this.mapListeners.length = 0;
        // Wire up listeners etc. and store reference to new map
        Control.prototype.setMap.call(this, map);
        if (map) {
            this.renderPanel();
        }
    };

    /**
     * Ensure only the top-most base layer is visible if more than one is visible.
     * @private
     */
    ensureTopVisibleBaseLayerShown_() {
        let lastVisibleBaseLyr;
        this.forEachRecursive(this.getMap(), function (l, idx, a) {
            if (l.get('type') === 'base' && l.getVisible()) {
                lastVisibleBaseLyr = l;
            }
        });
        if (lastVisibleBaseLyr) {
            this.setVisible_(lastVisibleBaseLyr, true);
        }
    };

    /**
     * Toggle the visible state of a layer.
     * Takes care of hiding other layers in the same exclusive group if the layer
     * is toggle to visible.
     * @private
     * @param lyr {ol.layer.Base} The layer whos visibility will be toggled.
     * @param visible bool wether to make it visible or not
     */
    setVisible_(lyr, visible) {
        const map = this.getMap();
        lyr.setVisible(visible);
        if (visible && lyr.get('type') === 'base') {
            // Hide all other base layers regardless of grouping
            this.forEachRecursive(map, function (l, idx, a) {
                if (l !== lyr && l.get('type') === 'base') {
                    l.setVisible(false);
                }
            });
        }
    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Base} layer Layer to be rendered (should have a title property).
     * @param {Number} idx Position in parent group list.
     */
    renderLayer_(layer, idx) {

        const this_ = this;

        const li = document.createElement('li');

        const lyrTitle = layer.get('title');
        const lyrId = this.uuid();

        const label = document.createElement('label');

        if (layer.getLayers && !layer.get('combine')) {

            li.className = 'group';
            label.innerHTML = lyrTitle;
            li.appendChild(label);
            const ul = document.createElement('ul');
            li.appendChild(ul);

            this.renderLayers_(layer, ul);

        } else {

            li.className = 'layer';
            const input = document.createElement('input');
            if (layer.get('type') === 'base') {
                input.type = 'radio';
                input.name = 'base';
            } else {
                input.type = 'checkbox';
            }
            input.id = lyrId;
            input.checked = layer.get('visible');
            input.onchange = function (e) {
                this_.setVisible_(layer, e.target.checked);
            };
            li.appendChild(input);

            label.htmlFor = lyrId;
            label.innerHTML = lyrTitle;

            const rsl = this.getMap().getView().getResolution();
            if (rsl > layer.getMaxResolution() || rsl < layer.getMinResolution()) {
                label.className += ' disabled';
            }

            li.appendChild(label);

        }

        return li;

    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.Layer.Group} lyr Group layer whos children will be rendered.
     * @param {Element} elm DOM element that children will be appended to.
     */
    renderLayers_(lyr, elm) {
        const lyrs = lyr.getLayers().getArray().slice().reverse();
        for (var i = 0, l; i < lyrs.length; i++) {
            l = lyrs[i];
            if (l.get('title')) {
                elm.appendChild(this.renderLayer_(l, i));
            }
        }
    };

    /**
     * **Static** Call the supplied function for each layer in the passed layer group
     * recursing nested groups.
     * @param {ol.layer.Group} lyr The layer group to start iterating from.
     * @param {Function} fn Callback which will be called for each `ol.layer.Base`
     * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
     */
    forEachRecursive(lyr, fn) {
        lyr.getLayers().forEach((lyr, idx, a) => {
            fn(lyr, idx, a);
            if (lyr.getLayers) {
                this.forEachRecursive(lyr, fn);
            }
        });
    };

    /**
     * Generate a UUID
     * @returns {String} UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * @private
     * @desc Apply workaround to enable scrolling of overflowing content within an
     * element. Adapted from https://gist.github.com/chrismbarr/4107472
     */
    enableTouchScroll_ = function (elm) {
        if (isTouchDevice()) {
            let scrollStartPos = 0;
            elm.addEventListener("touchstart", function (event) {
                scrollStartPos = this.scrollTop + event.touches[0].pageY;
            }, false);
            elm.addEventListener("touchmove", function (event) {
                this.scrollTop = scrollStartPos - event.touches[0].pageY;
            }, false);
        }
    };
}

export {LayerSwitcher};
