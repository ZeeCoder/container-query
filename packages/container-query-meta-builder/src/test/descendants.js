import MetaBuilder, {
  ELEMENTS,
  VALUES,
  STYLES,
  SELECTOR,
  CONDITIONS
} from "../.";

export const build = () =>
  new MetaBuilder()
    .setDescendant(".child")
    .addStyle("font-size: 5rh")

    .setDescendant(".child")
    .addStyle("font-size: 10rh")

    .setQuery("(width > 100px)")
    .addStyle("font-size: 10rh")
    .addStyle("border: none")

    .resetQuery()
    .setDescendant(".child2")
    .addStyle("font-size: 10rh")
    .setQuery("(width > 100px)")
    .addStyle("font-size: 11rh")
    .setQuery("(width > 200px)")
    .addStyle("font-size: 12rh")

    .resetQuery()
    .setDescendant(".child3")
    .addStyle("line-height: 10rh")
    .setQuery("(width > 10px)")
    .addStyle("font-size: 10rh")
    .setQuery("(width > 20px)")
    .addStyle("font-size: 20rh")
    .setQuery("(width > 30px)")
    .addStyle("font-size: 30rh")

    .build();

export const out = [
  {
    [ELEMENTS]: [
      {
        [SELECTOR]: ".child",
        [VALUES]: {
          "font-size": "10rh"
        }
      },
      {
        [SELECTOR]: ".child2",
        [VALUES]: {
          "font-size": "10rh"
        }
      },
      {
        [SELECTOR]: ".child3",
        [VALUES]: {
          "line-height": "10rh"
        }
      }
    ]
  },
  {
    [CONDITIONS]: [[["width", ">", 100]]],
    [ELEMENTS]: [
      {
        [SELECTOR]: ".child",
        [VALUES]: {
          "font-size": "10rh"
        },
        [STYLES]: {
          border: "none"
        }
      },
      {
        [SELECTOR]: ".child2",
        [VALUES]: {
          "font-size": "11rh"
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
          "font-size": "12rh"
        }
      }
    ]
  },
  {
    [CONDITIONS]: [[["width", ">", 10]]],
    [ELEMENTS]: [
      {
        [SELECTOR]: ".child3",
        [VALUES]: {
          "font-size": "10rh"
        }
      }
    ]
  },
  {
    [CONDITIONS]: [[["width", ">", 20]]],
    [ELEMENTS]: [
      {
        [SELECTOR]: ".child3",
        [VALUES]: {
          "font-size": "20rh"
        }
      }
    ]
  },
  {
    [CONDITIONS]: [[["width", ">", 30]]],
    [ELEMENTS]: [
      {
        [SELECTOR]: ".child3",
        [VALUES]: {
          "font-size": "30rh"
        }
      }
    ]
  }
];
