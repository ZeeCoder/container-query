import {
    getContainerByElement,
    addContainerToRegistry
} from "./ContainerRegistry";

test("should return null for keys not registered", () => {
    expect(getContainerByElement("element")).toBe(null);
});

test("should be able to retrieve previously saved values", () => {
    expect(addContainerToRegistry("element", "container")).toBe(true);
    expect(addContainerToRegistry("element1", "container1")).toBe(true);
    expect(addContainerToRegistry("element2", "container2")).toBe(true);
    expect(addContainerToRegistry("element2", "other container")).toBe(false);

    expect(getContainerByElement("element")).toBe("container");
    expect(getContainerByElement("element1")).toBe("container1");
    expect(getContainerByElement("element2")).toBe("container2");
});
