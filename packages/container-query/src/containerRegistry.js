// @flow
import WeakMap from "es6-weak-map";
import type { RegistryData } from "../../common/src/types";

const containerRegistry: WeakMap = new WeakMap();

export default {
  set: function(element: HTMLElement, data: RegistryData) {
    containerRegistry.set(element, data);
  },

  get: function(element: HTMLElement) {
    return containerRegistry.get(element);
  },

  has: function(element: HTMLElement) {
    return containerRegistry.has(element);
  },

  delete: function(element: HTMLElement) {
    containerRegistry.delete(element);
  }
};
