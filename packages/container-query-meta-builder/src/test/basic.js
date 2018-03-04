import MetaBuilder, {
  ELEMENTS,
  VALUES,
  STYLES,
  SELECTOR,
  CONDITIONS,
  QUERIES
} from "../.";

export const build = () =>
  new MetaBuilder(".Container")
    .addStyle("font-size: 15rh")

    .setQuery("(width > 200px)")
    .addStyle("font-size: 25rh")
    .addStyle("background: none")

    .resetQuery()
    .setDescendant(".child")
    .addStyle("font-size: 10rh")

    .setQuery("   (width > 200px) and (height > 200px)   ")
    .addStyle("line-height: 1.5")
    .addStyle("font-size: 20rh")
    .addStyle("  border: none")

    .resetQuery()
    .setDescendant(".child2")
    .addStyle("font-size: 30rh")

    .setQuery("(orientation: portrait)  ")
    .addStyle({ prop: "line-height", value: "1.5" })
    .addStyle({ prop: "font-size", value: "10rh" })

    .build();

export const out = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "font-size": "15rh"
          }
        },
        {
          [SELECTOR]: ".child",
          [VALUES]: {
            "font-size": "10rh"
          }
        },
        {
          [SELECTOR]: ".child2",
          [VALUES]: {
            "font-size": "30rh"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["width", ">", 200]]],
      [ELEMENTS]: [
        {
          [VALUES]: {
            "font-size": "25rh"
          },
          [STYLES]: {
            background: "none"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["width", ">", 200], ["height", ">", 200]]],
      [ELEMENTS]: [
        {
          [SELECTOR]: ".child",
          [VALUES]: {
            "font-size": "20rh"
          },
          [STYLES]: {
            "line-height": "1.5",
            border: "none"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["orientation", ":", "portrait"]]],
      [ELEMENTS]: [
        {
          [SELECTOR]: ".child2",
          [VALUES]: {
            "font-size": "10rh"
          },
          [STYLES]: {
            "line-height": "1.5"
          }
        }
      ]
    }
  ]
};
