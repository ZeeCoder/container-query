import applyStylesToElements from "./applyStylesToElements";

test("should apply all declarations to all the elements", () => {
    const elements = [
        { style: { border: "none", fontSize: "12px" } },
        { style: { border: "1px solid" } }
    ];

    const style = {
        fontSize: "42px",
        lineHeight: "50px"
    };

    applyStylesToElements(style, elements);

    expect(elements[0].style).toEqual({
        border: "none",
        fontSize: "42px",
        lineHeight: "50px"
    });
    expect(elements[1].style).toEqual({
        border: "1px solid",
        fontSize: "42px",
        lineHeight: "50px"
    });
});
