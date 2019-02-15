import * as ol from 'ol';
import {Control} from 'ol/control';
import {unByKey} from 'ol/Observable';

const factory = (ol) => {
    /**
     * OpenLayers v3/v4 Layer Switcher Control.
     * See [the examples](./examples) for usage.
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object} opt_options Control options, extends olx.control.ControlOptions adding:
     *                              **`tipLabel`** `String` - the button tooltip.
     */
    const LayerSwitcher = function (opt_options) {

        const options = opt_options || {};

        this.mapListeners = [];

        this.hiddenClassName = 'layer-switcher';
        if (LayerSwitcher.isTouchDevice_()) {
            this.hiddenClassName += ' touch';
        }
        this.shownClassName = 'shown';

        const element = document.createElement('div');
        element.className = this.hiddenClassName;

        this.panel = document.createElement('div');
        this.panel.className = 'panel';
        element.appendChild(this.panel);
        LayerSwitcher.enableTouchScroll_(this.panel);

        Control.call(this, {
            element: element,
            target: options.target
        });

    };

    ol.inherits(LayerSwitcher, Control);

    /**
     * Show the layer panel.
     */
    LayerSwitcher.prototype.showPanel = function () {
        if (!this.element.classList.contains(this.shownClassName)) {
            this.element.classList.add(this.shownClassName);
            this.renderPanel();
        }
    };

    /**
     * Re-draw the layer panel to represent the current state of the layers.
     */
    LayerSwitcher.prototype.renderPanel = function () {

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
    LayerSwitcher.prototype.setMap = function (map) {
        // Clean up listeners associated with the previous map
        for (let i = 0, key; i < this.mapListeners.length; i++) {
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
    LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_ = function () {
        let lastVisibleBaseLyr;
        LayerSwitcher.forEachRecursive(this.getMap(), function (l, idx, a) {
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
     * @param {ol.layer.Base} The layer whos visibility will be toggled.
     */
    LayerSwitcher.prototype.setVisible_ = function (lyr, visible) {
        const map = this.getMap();
        lyr.setVisible(visible);
        if (visible && lyr.get('type') === 'base') {
            // Hide all other base layers regardless of grouping
            LayerSwitcher.forEachRecursive(map, function (l, idx, a) {
                if (l != lyr && l.get('type') === 'base') {
                    l.setVisible(false);
                }
            });
        }
    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Base} lyr Layer to be rendered (should have a title property).
     * @param {Number} idx Position in parent group list.
     */
    LayerSwitcher.prototype.renderLayer_ = function (lyr, idx) {

        var this_ = this;

        var li = document.createElement('li');

        var lyrTitle = lyr.get('title');
        var lyrId = LayerSwitcher.uuid();

        var label = document.createElement('label');

        if (lyr.getLayers && !lyr.get('combine')) {

            li.className = 'group';
            label.innerHTML = lyrTitle;
            li.appendChild(label);
            var ul = document.createElement('ul');
            li.appendChild(ul);

            this.renderLayers_(lyr, ul);

        } else {

            li.className = 'layer';
            var input = document.createElement('input');
            if (lyr.get('type') === 'base') {
                input.type = 'radio';
                input.name = 'base';
            } else {
                input.type = 'checkbox';
            }
            input.id = lyrId;
            input.checked = lyr.get('visible');
            input.onchange = function (e) {
                this_.setVisible_(lyr, e.target.checked);
            };
            li.appendChild(input);

            label.htmlFor = lyrId;
            label.innerHTML = lyrTitle;

            var rsl = this.getMap().getView().getResolution();
            if (rsl > lyr.getMaxResolution() || rsl < lyr.getMinResolution()) {
                label.className += ' disabled';
            }

            li.appendChild(label);

        }

        return li;

    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Group} lyr Group layer whos children will be rendered.
     * @param {Element} elm DOM element that children will be appended to.
     */
    LayerSwitcher.prototype.renderLayers_ = function (lyr, elm) {
        var lyrs = lyr.getLayers().getArray().slice().reverse();
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
    LayerSwitcher.forEachRecursive = function (lyr, fn) {
        lyr.getLayers().forEach(function (lyr, idx, a) {
            fn(lyr, idx, a);
            if (lyr.getLayers) {
                LayerSwitcher.forEachRecursive(lyr, fn);
            }
        });
    };

    /**
     * Generate a UUID
     * @returns {String} UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    LayerSwitcher.uuid = function () {
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
    LayerSwitcher.enableTouchScroll_ = function (elm) {
        if (LayerSwitcher.isTouchDevice_()) {
            var scrollStartPos = 0;
            elm.addEventListener("touchstart", function (event) {
                scrollStartPos = this.scrollTop + event.touches[0].pageY;
            }, false);
            elm.addEventListener("touchmove", function (event) {
                this.scrollTop = scrollStartPos - event.touches[0].pageY;
            }, false);
        }
    };

    /**
     * @private
     * @desc Determine if the current browser supports touch events. Adapted from
     * https://gist.github.com/chrismbarr/4107472
     */
    LayerSwitcher.isTouchDevice_ = function () {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    };
    return LayerSwitcher;
};

const LayerSwitcher = factory(ol);

export {LayerSwitcher};