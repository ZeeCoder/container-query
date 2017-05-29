import processConfig from "./processConfig";
import adjustContainer from "./adjustContainer";
import objectAssign from "object-assign";
import ResizeObserver from "resize-observer-polyfill";
import {
    getContainerByElement,
    addContainerToRegistry
} from "./ContainerRegistry";
import raf from "raf";

const observer = new ResizeObserver(entries => {
    if (!Array.isArray(entries)) {
        return;
    }

    entries.forEach(entry => {
        const container = getContainerByElement(entry.target);

        if (
            container === null ||
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

        addContainerToRegistry(containerElement, this);

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
        observer.observe(this.containerElement);
    }

    /**
     * Stops observing resize changes.
     */
    unobserveResize() {
        observer.unobserve(this.containerElement);
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
