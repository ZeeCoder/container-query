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
    .addStyle("font-size: 10rh")
    .addStyle("font-size: 15rh")
    .addStyle("line-height: 15rh")

    .setQuery("(width > 100px)")
    .addStyle("font-size: 20rh")
    .addStyle("line-height: 20rh")

    .setQuery("(width > 100px)")
    .addStyle("line-height: 21rh")
    .addStyle("background: transparent")

    .resetQuery()
    .setDescendant(".child")
    .addStyle("font-size: 5rh")
    .addStyle("line-height: 5rh")

    .resetQuery()
    .resetDescendant()
    .addStyle("font-size: 17rh")

    .setDescendant(".child2")
    .addStyle("font-size: 20rh")

    .setDescendant(".child2")
    .addStyle("line-height: 30rh")

    .setQuery("(width > 200px)")
    .addStyle("font-size: 25rh")
    .addStyle("border: none")

    .build();

export const out = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "font-size": "17rh",
            "line-height": "15rh"
          }
        },
        {
          [SELECTOR]: ".child",
          [VALUES]: {
            "font-size": "5rh",
            "line-height": "5rh"
          }
        },
        {
          [SELECTOR]: ".child2",
          [VALUES]: {
            "font-size": "20rh",
            "line-height": "30rh"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["width", ">", 100]]],
      [ELEMENTS]: [
        {
          [VALUES]: {
            "font-size": "20rh",
            "line-height": "21rh"
          },
          [STYLES]: {
            background: "transparent"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["width", ">", 200]]],
      [ELEMENTS]: [
        {
          [SELECTOR]: ".child2",
          [VALUES]: {
            "font-size": "25rh"
          },
          [STYLES]: {
            border: "none"
          }
        }
      ]
    }
  ]
};
