import processConfig from "./processConfig";
import adjustContainer from "./adjustContainer";
import objectAssign from "object-assign";
import ResizeObserver from "resize-observer-polyfill";
import MutationObserver from "mutation-observer";
import WeakMap from "es6-weak-map";
import raf from "raf";

const containerRegistry = new WeakMap();

const resizeObserver = new ResizeObserver(entries => {
    if (!Array.isArray(entries)) {
        return;
    }

    entries.forEach(entry => {
        const container = containerRegistry.get(entry.target);

        if (
            typeof container === "undefined" ||
            typeof container !== "object" ||
            typeof container.adjust !== "function"
        ) {
            console.warn(
                "Could not find Container instance for element:",
                entry.target
            );
            return;
        }

        container.adjust({
            width: entry.contentRect.width,
            height: entry.contentRect.height
        });
    });
});

const mutationObserver = new MutationObserver(mutationsRecords => {
    mutationsRecords.forEach(mutationsRecord => {
        // Remove container element from registry and unobserve resize changes
        mutationsRecord.removedNodes.forEach(node => {
            if (containerRegistry.has(node) === false) {
                return;
            }

            resizeObserver.unobserve(node);
            containerRegistry.delete(node);
        });
    });
});

/**
 * @class
 * @property {Element} containerElement
 * @property {Object} jsonStats
 * @property {Object} opts
 */
export default class Container {
    constructor(containerElement, jsonStats, opts = {}) {
        this.containerElement = containerElement;
        this.processedJsonStats = processConfig(jsonStats);

        this.opts = objectAssign(
            {
                adjustOnResize: false,
                adjustOnInstantiation: true
            },
            opts
        );

        this.observeResize = this.observeResize.bind(this);
        this.unobserveResize = this.unobserveResize.bind(this);
        this.adjust = this.adjust.bind(this);

        containerRegistry.set(containerElement, this);
        mutationObserver.observe(this.containerElement.parentNode, {
            childList: true
        });

        if (this.opts.adjustOnResize) {
            this.observeResize();
        }

        if (this.opts.adjustOnInstantiation) {
            raf(this.adjust);
        }
    }

    /**
     * Starts observing resize changes.
     */
    observeResize() {
        resizeObserver.observe(this.containerElement);
    }

    /**
     * Stops observing resize changes.
     */
    unobserveResize() {
        resizeObserver.unobserve(this.containerElement);
    }

    /**
     * Adjusts the container to it's current dimensions, or to the ones given.
     *
     * @param {ContainerDimensions} containerDimensions
     */
    adjust(containerDimensions = null) {
        adjustContainer(
            this.containerElement,
            this.processedJsonStats,
            containerDimensions
        );
    }
}
