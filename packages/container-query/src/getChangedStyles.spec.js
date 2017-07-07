import getChangedStyles from "./getChangedStyles";
import type { ContainerSize } from "./Container";

jest.mock("./containerRegistry", () => ({
    get: jest.fn()
}));

test("should apply default queries without a condition function", () => {
    const containerRegistry = require("./containerRegistry");
    containerRegistry.get.mockImplementation(() => {
        return {
            queryState: [false, false],
            jsonStats: {
                queries: [
                    {
                        // conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                values: {
                                    fontSize: "2rh",
                                    lineHeight: "1rh"
                                }
                            },
                            {
                                selector: ".Container__element",
                                values: {
                                    lineHeight: "3rh"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                values: {
                                    fontSize: "4rh",
                                    lineHeight: "2rh"
                                }
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    lineHeight: "10px"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    });

    const element: HTMLElement = document.createElement("div");
    const size: ContainerSize = { width: 100, height: 100 };
    expect(getChangedStyles(element, size)).toEqual({
        ".Container": {
            addStyle: {
                fontSize: "4px",
                lineHeight: "2px"
            },
            removeProps: []
        },
        ".Container__element": {
            addStyle: {
                lineHeight: "10px"
            },
            removeProps: []
        }
    });
});

test("should return change sets on first run", () => {
    const containerRegistry = require("./containerRegistry");
    containerRegistry.get.mockImplementation(() => {
        return {
            queryState: [false, false],
            jsonStats: {
                queries: [
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container__element",
                                styles: {
                                    fontSize: "12px",
                                    background: "#ccc"
                                },
                                values: {
                                    lineHeight: "1rh"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {
                                    background: "#000"
                                }
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    fontSize: "14px"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    });

    const element: HTMLElement = document.createElement("div");
    const size: ContainerSize = { width: 100, height: 100 };
    expect(getChangedStyles(element, size)).toEqual({
        ".Container": {
            addStyle: {
                background: "#000"
            },
            removeProps: []
        },
        ".Container__element": {
            addStyle: {
                fontSize: "14px",
                lineHeight: "1px",
                background: "#ccc"
            },
            removeProps: []
        }
    });
});

test("should generate remove change set", () => {
    const containerRegistry = require("./containerRegistry");
    containerRegistry.get.mockImplementation(() => {
        return {
            queryState: [true, true, true],
            jsonStats: {
                queries: [
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {
                                    background: "#aaa"
                                },
                                values: {}
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    background: "#bbb"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {},
                                values: {
                                    lineHeight: "10rh"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => false,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {
                                    fontSize: "14px",
                                    background: "#bbb"
                                },
                                values: {
                                    lineHeight: "2rh"
                                }
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    background: "#ccc",
                                    border: "none"
                                },
                                values: {
                                    fontSize: "1rh"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    });

    const element: HTMLElement = document.createElement("div");
    const size: ContainerSize = { width: 100, height: 100 };
    expect(getChangedStyles(element, size)).toEqual({
        ".Container": {
            addStyle: {
                background: "#aaa",
                lineHeight: "10px"
            },
            removeProps: ["fontSize"]
        },
        ".Container__element": {
            addStyle: {
                background: "#bbb"
            },
            removeProps: ["border", "fontSize"]
        }
    });
});

test("should generate empty change set if conditions allow", () => {
    const containerRegistry = require("./containerRegistry");
    containerRegistry.get.mockImplementation(() => {
        return {
            queryState: [true, true],
            jsonStats: {
                queries: [
                    {
                        conditionFunction: () => false,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {
                                    fontSize: "14px",
                                    background: "#bbb",
                                    lineHeight: "16px"
                                }
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    fontSize: "8px",
                                    background: "#eee"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                styles: {
                                    fontSize: "16px",
                                    background: "#ccc",
                                    lineHeight: "18px"
                                }
                            },
                            {
                                selector: ".Container__element",
                                styles: {
                                    fontSize: "9px",
                                    background: "#fff"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    });

    const element: HTMLElement = document.createElement("div");
    const size: ContainerSize = { width: 100, height: 100 };
    expect(getChangedStyles(element, size)).toEqual({
        ".Container": {
            addStyle: {},
            removeProps: []
        },
        ".Container__element": {
            addStyle: {},
            removeProps: []
        }
    });
});

test("should always recalculate values", () => {
    const containerRegistry = require("./containerRegistry");
    containerRegistry.get.mockImplementation(() => {
        return {
            queryState: [true, false, true],
            jsonStats: {
                queries: [
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                values: {
                                    fontSize: "2rh"
                                }
                            },
                            {
                                selector: ".Container__element",
                                values: {
                                    fontSize: "4rh"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                values: {
                                    fontSize: "3rh"
                                }
                            }
                        ]
                    },
                    {
                        conditionFunction: () => true,
                        elements: [
                            {
                                selector: ".Container",
                                values: {
                                    lineHeight: "4rh"
                                }
                            },
                            {
                                selector: ".Container__element",
                                values: {
                                    lineHeight: "3rh"
                                }
                            }
                        ]
                    }
                ]
            }
        };
    });

    const element: HTMLElement = document.createElement("div");
    const size: ContainerSize = { width: 200, height: 200 };
    expect(getChangedStyles(element, size)).toEqual({
        ".Container": {
            addStyle: {
                lineHeight: "8px",
                fontSize: "6px"
            },
            removeProps: []
        },
        ".Container__element": {
            addStyle: {
                lineHeight: "6px",
                fontSize: "8px"
            },
            removeProps: []
        }
    });
});
