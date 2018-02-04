// @flow
import WeakMap from "es6-weak-map";
import type { RegistryData } from "../flow/types";

const containerRegistry: WeakMap = new WeakMap();

export default {
  set: function(element: Element | Node, data: RegistryData) {
    containerRegistry.set(element, data);
  },

  get: function(element: Element | Node) {
    return containerRegistry.get(element);
  },

  has: function(element: Element | Node) {
    return containerRegistry.has(element);
  },

  delete: function(element: Element | Node) {
    containerRegistry.delete(element);
  }
};
