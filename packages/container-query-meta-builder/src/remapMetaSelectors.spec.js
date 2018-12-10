import remapMetaSelectors from "./remapMetaSelectors";
import MetaBuilder, { QUERIES, SELECTOR, ELEMENTS } from "./index";

test("should remap all BEM-style class names for all containers", () => {
  const meta1 = new MetaBuilder(".Container1")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".child1")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const meta2 = new MetaBuilder(".Container2")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".child2")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const meta = {
    ".Container1": meta1,
    ".Container2": meta2
  };

  const expectedMeta1 = new MetaBuilder(".mapped-Container1")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".mapped-child1")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const expectedMeta2 = new MetaBuilder(".mapped-Container2")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".mapped-child2")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const expectedMeta = {
    ".Container1": expectedMeta1,
    ".Container2": expectedMeta2
  };

  const classMap = {
    child1: "mapped-child1",
    Container1: "mapped-Container1",
    child2: "mapped-child2",
    Container2: "mapped-Container2"
  };

  const mappedMeta = remapMetaSelectors(meta, classMap);

  expect(mappedMeta).toEqual(expectedMeta);
});

test("should remap all BEM-style class names for a single container in the meta", () => {
  const meta = new MetaBuilder(".Container")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".child")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const expectedMeta = new MetaBuilder(".mapped-Container")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".mapped-child")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const classMap = {
    child: "mapped-child",
    Container: "mapped-Container"
  };

  const mappedMeta = remapMetaSelectors(meta, classMap);

  expect(mappedMeta).toEqual(expectedMeta);
});

test("should remap all class names in selectors", () => {
  const meta = new MetaBuilder(".Container .other-class")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".child .wrapper")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const expectedMeta = new MetaBuilder(".mContainer .mother-class")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".mchild .mwrapper")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const classMap = {
    Container: "mContainer",
    "other-class": "mother-class",
    child: "mchild",
    wrapper: "mwrapper"
  };

  const mappedMeta = remapMetaSelectors(meta, classMap);

  expect(mappedMeta).toEqual(expectedMeta);
});

describe("should gracefully handle missing props in the meta", () => {
  test("should handle completely empty meta", () => {
    const meta = {
      ".container": {}
    };
    const mappedMeta = remapMetaSelectors(meta, {});

    expect(mappedMeta).toEqual(meta);
  });

  test("should handle meta with empty query prop", () => {
    const meta = {
      [SELECTOR]: ".selector",
      [QUERIES]: [{}]
    };
    const mappedMeta = remapMetaSelectors(meta, {});

    expect(mappedMeta).toEqual(meta);
  });
});

test("should be able to handle css-exported meta json string", () => {
  const meta = new MetaBuilder(".Container")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".child")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const expectedMeta = new MetaBuilder(".mContainer")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 15px")

    .resetQuery()
    .setDescendant(".mchild")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 10px")

    .build();

  const classMap = {
    Container: "mContainer",
    child: "mchild"
  };

  const cssMetaExport = `'${JSON.stringify(meta)}'`;

  const mappedMeta = remapMetaSelectors(cssMetaExport, classMap);

  expect(mappedMeta).toEqual(expectedMeta);
});
