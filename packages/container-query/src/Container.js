// @flow
import processMeta from "./processMeta";
import adjustContainer from "./adjustContainer";
import objectAssign from "object-assign";
import ResizeObserver from "resize-observer-polyfill";
import MutationObserver from "mutation-observer";
import raf from "raf";
import containerRegistry from "./containerRegistry";
import type { ContainerSize, Meta, RegistryData } from "../flow/types";
import { QUERIES } from "@zeecoder/container-query-meta-builder";

// TODO fix test picking up all sorts of js files
const resizeObserver: ResizeObserver = new ResizeObserver(entries => {
  if (!Array.isArray(entries)) {
    return;
  }

  entries.forEach(entry => {
    const data: RegistryData = containerRegistry.get(entry.target);

    if (
      typeof data === "undefined" ||
      typeof data !== "object" ||
      typeof data.instance !== "object" ||
      typeof data.instance.adjust !== "function"
    ) {
      console.warn(
        "Could not find Container instance for element:",
        entry.target
      );
      return;
    }

    const container: Container = data.instance;

    container.adjust({
      width: entry.contentRect.width,
      height: entry.contentRect.height
    });
  });
});

const mutationObserver = new MutationObserver(mutationRecords => {
  mutationRecords.forEach(mutationRecord => {
    // Remove container element from registry and unobserve resize changes
    const removedNodesLength = mutationRecord.removedNodes.length;
    for (let i = 0; i < removedNodesLength; i++) {
      const node: Element = mutationRecord.removedNodes[i];

      if (containerRegistry.has(node)) {
        resizeObserver.unobserve(node);
        containerRegistry.delete(node);
      }
    }
  });
});

export default class Container {
  container: HTMLElement;
  meta: {};
  opts: {};

  constructor(containerElement: HTMLElement, meta: Meta, opts: {} = {}) {
    this.container = containerElement;
    this.meta = processMeta(meta);

    this.opts = objectAssign(
      {
        adjustOnResize: true,
        adjustOnInstantiation: true,
        valuePrecision: 2
      },
      opts
    );

    const getInitialQueryState = () => {
      if (!Array.isArray(meta[QUERIES])) {
        return [];
      }

      return meta[QUERIES].map(() => false);
    };

    containerRegistry.set(containerElement, {
      instance: this,
      meta: meta,
      queryState: getInitialQueryState()
    });

    mutationObserver.observe(this.container.parentNode, {
      childList: true
    });

    if (this.opts.adjustOnResize) {
      this.observeResize();
    }

    if (this.opts.adjustOnInstantiation) {
      raf(() => this.adjust());
    }
  }

  /**
   * Starts observing resize changes.
   */
  observeResize() {
    resizeObserver.observe(this.container);
  }

  /**
   * Stops observing resize changes.
   */
  unobserveResize() {
    resizeObserver.unobserve(this.container);
  }

  /**
   * Adjusts the container to it's current dimensions, or to the ones given.
   */
  adjust(size: ?ContainerSize = null) {
    adjustContainer(this.container, size);

    if (typeof this.opts.handleResize === "function") {
      this.opts.handleResize(size);
    }
  }
}
