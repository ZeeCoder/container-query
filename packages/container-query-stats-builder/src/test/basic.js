import StatsBuilder from "../.";

export const build = () =>
  new StatsBuilder()
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

export const out = [
  {
    elements: [
      {
        values: {
          "font-size": "15rh"
        }
      }
    ]
  },
  {
    conditions: [[[["width", ">", 200]]]],
    elements: [
      {
        values: {
          "font-size": "25rh"
        },
        styles: {
          background: "none"
        }
      }
    ]
  },
  {
    elements: [
      {
        selector: ".child",
        values: {
          "font-size": "10rh"
        }
      }
    ]
  },
  {
    conditions: [[[["width", ">", 200], ["height", ">", 200]]]],
    elements: [
      {
        selector: ".child",
        values: {
          "font-size": "20rh"
        },
        styles: {
          "line-height": "1.5",
          border: "none"
        }
      }
    ]
  },
  {
    elements: [
      {
        selector: ".child2",
        values: {
          "font-size": "30rh"
        }
      }
    ]
  },
  {
    conditions: [[[["orientation", ":", "portrait"]]]],
    elements: [
      {
        selector: ".child2",
        values: {
          "font-size": "10rh"
        },
        styles: {
          "line-height": "1.5"
        }
      }
    ]
  }
];
