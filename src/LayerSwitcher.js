// @flow strict

import Base from 'ol/layer/Base';
import Group from 'ol/layer/Group';
import Map from 'ol/Map';
import { Control } from 'ol/control';
import { unByKey } from 'ol/Observable';
import { Feature } from 'ol';
import type { AnnotationStatus } from './Types';
import Layer from 'ol/layer/Layer';

/**
 * Somewhat dirty hack to know if the device supports touch events, but probably reliable. Might leak the touch event, but
 * it will probably be gc'd.
 * @returns {boolean}
 */
function isTouchDevice() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}

type ToggleLayerCallback = AnnotationStatus => void;

/**
 * Taken from https://github.com/walkermatt/ol-layerswitcher and modified as we don't need some of the things it initially does,
 * such as the OL control behaviour, hidden aspect, and to be able to actually integrate it to the platform.
 * @todo we need to transform this (somehow) into a React component that would still exhibit an OL Contol behaviour.
 *
 * Possibly by creating another "LayerSwitcher" component that would manage this class internally.
 */
class LayerSwitcher extends Control {

  toggle_layer_callback: ToggleLayerCallback;

  mapListeners: (() => void)[];

  class_name: string;

  panel: HTMLElement;

  constructor(opt_options: { target: string | HTMLElement }, toggle_layer_callback: ToggleLayerCallback) {

    const options = opt_options || {};
    const { target } = options;
    const element = document.createElement('div');
    super({
      element: element,
      target: target,
    });

    /**
     * When the layer switcher is used to toggle a layer, we need to tell it to the outside world.
     * @private
     * @type {Function}
     */
    this.toggle_layer_callback = toggle_layer_callback;

    this.mapListeners = [];

    this.class_name = 'layer-switcher';
    if (isTouchDevice()) {
      this.class_name += ' touch';
    }

    element.className = this.class_name;

    this.panel = document.createElement('div');
    this.panel.className = 'panel';
    element.appendChild(this.panel);
    this.enableTouchScroll_(this.panel);

  }

  /**
   * Populate the layer panel with the current state of the layers.
   * this would be the render method?
   */
  renderPanel() {

    this.ensureTopVisibleBaseLayerShown_();

    while (this.panel.firstChild) {
      this.panel.removeChild(this.panel.firstChild);
    }

    const ul = document.createElement('ul');
    this.panel.appendChild(ul);
    const layers = this.getMap()
      .getLayers()
      .getArray()
      .slice()
      .reverse();
    this.renderLayers_(layers, ul);

  }

  /**
   * Set the map instance the control is associated with.
   */
  setMap(map: Map) {
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
  }

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
  }

  /**
   * Toggle the visible state of a layer.
   * Takes care of hiding other layers in the same exclusive group if the layer
   * is toggle to visible.
   * @private
   * @param {ol.Layer.Base} layer The layer whos visibility will be toggled.
   * @param visible bool wether to make it visible or not
   */
  setVisible_(layer: Base, visible: boolean) {
    const map = this.getMap();
    layer.setVisible(visible);
    if (visible && layer.get('type') === 'base') {
      // Hide all other base layers regardless of grouping
      this.forEachRecursive(map, function (base_layer, idx, a) {
        if (base_layer !== layer && base_layer.get('type') === 'base') {
          base_layer.setVisible(false);
        }
      });
    }
  }

  /**
   * Render all layers that are children of a group.
   */
  renderLayer_(layer: Base, layer_index: number) {

    const this_ = this;

    const li = document.createElement('li');
    const layer_title = layer.get('title');
    const layer_id = this.uuid();

    const label = document.createElement('label');

    /**
     * hacky hack to make GeoImageNet images be grouped? combine is a custom attribute added on the high resolution images
     * rendered on the map.
     */
    if (layer.getLayers && !layer.get('combine')) {

      li.className = 'group';
      label.innerHTML = layer_title;
      li.appendChild(label);
      const ul = document.createElement('ul');
      li.appendChild(ul);
      const layers = layer.getLayers()
        .getArray()
        .slice()
        .reverse();
      this.renderLayers_(layers, ul);

    } else {

      li.className = 'layer';
      const input = document.createElement('input');
      if (layer.get('type') === 'base') {
        input.type = 'radio';
        input.name = 'base';
      } else {
        input.type = 'checkbox';
      }
      input.id = layer_id;
      input.checked = layer.get('visible');
      input.onchange = (e) => {
        this_.setVisible_(layer, e.target.checked);
        if (layer.type === 'VECTOR') {
          this.toggle_layer_callback(layer.get('title'));
        }
      };
      li.appendChild(input);

      label.htmlFor = layer_id;
      label.innerHTML = layer_title;

      const rsl = this.getMap()
        .getView()
        .getResolution();
      if (rsl > layer.getMaxResolution() || rsl < layer.getMinResolution()) {
        label.className += ' disabled';
      }

      li.appendChild(label);

    }

    return li;

  }

  /**
   * Render all layers that are children of a group.
   * layer_group Group layer whose children will be rendered.
   * element DOM element that children will be appended to.
   */
  renderLayers_(layers: Layer[], element: HTMLElement) {
    for (var i = 0, l; i < layers.length; i++) {
      l = layers[i];
      if (l.get('title')) {
        element.appendChild(this.renderLayer_(l, i));
      }
    }
  }

  /**
   * **Static** Call the supplied function for each layer in the passed layer group
   * recursively nesting groups.
   * @param layer_group The layer group to start iterating from.
   * @param callback Callback which will be called for each `ol.layer.Base`
   * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
   */
  forEachRecursive = (layer_group: Group, callback: (Feature, number, Feature[]) => void) => {
    layer_group.getLayers()
      .forEach((layer, index, collection) => {
        callback(layer, index, collection);
        if (layer.getLayers) {
          this.forEachRecursive(layer, callback);
        }
      });
  };

  /**
   * Generate a UUID
   * @returns {String} UUID
   *
   * Adapted from http://stackoverflow.com/a/2117523/526860
   */
  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * @private
   * @desc Apply workaround to enable scrolling of overflowing content within an
   * element. Adapted from https://gist.github.com/chrismbarr/4107472
   */
  enableTouchScroll_ = function (elm: HTMLElement) {
    if (isTouchDevice()) {
      let scrollStartPos = 0;
      elm.addEventListener('touchstart', function (event: TouchEvent) {
        scrollStartPos = this.scrollTop + event.touches[0].pageY;
      }, false);
      elm.addEventListener('touchmove', function (event: TouchEvent) {
        this.scrollTop = scrollStartPos - event.touches[0].pageY;
      }, false);
    }
  };
}

export { LayerSwitcher };
