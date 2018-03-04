import StatsBuilder, {
  ELEMENTS,
  VALUES,
  STYLES,
  SELECTOR,
  CONDITIONS
} from "../.";

export const build = () =>
  new StatsBuilder()
    .setDescendant(".child")
    .addStyle("font-size: 10rh")
    .setDescendant(".child2")
    .addStyle("font-size: 10rh")
    .setDescendant(".child3")
    .addStyle("line-height: 10rh")

    .resetDescendant()
    .setQuery("(width > 100px)")
    .setDescendant(".child")
    .addStyle("font-size: 10rh")
    .addStyle("border: none")
    .setDescendant(".child2")
    .addStyle("font-size: 11rh")

    .resetDescendant()
    .setQuery("(width > 200px)")
    .setDescendant(".child2")
    .addStyle("font-size: 12rh")

    .resetDescendant()
    .setQuery("(width > 10px)")
    .setDescendant(".child3")
    .addStyle("font-size: 10rh")

    .resetDescendant()
    .setQuery("(width > 20px)")
    .setDescendant(".child3")
    .addStyle("font-size: 20rh")

    .resetDescendant()
    .setQuery("(width > 30px)")
    .setDescendant(".child3")
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
