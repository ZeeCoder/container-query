import StatsBuilder from ".";

test("should be able to generate the usual stats structure", () => {
  const stats = new StatsBuilder()
    .addStyle("font-size: 15rh")
    .addQuery("width > 200px")
    .addStyle("font-size: 25rh")
    .addStyle("background: none")

    .addDescendant(".child")
    .addStyle("font-size: 10rh")
    .addQuery("width > 200px")
    .addQuery("height > 200px")
    .addStyle("font-size: 20rh")
    .addStyle("line-height: 1.5")
    .addStyle("border: none")

    .build();

  console.log(JSON.stringify(stats, null, 2));
  return;

  expect(stats).toEqual([
    {
      elements: [
        {
          values: {
            "font-size": "15rh"
          }
        },
        {
          selector: ".child",
          values: {
            "font-size": "10rh"
          }
        }
      ]
    },
    {
      conditions: [["width", ">", 200]],
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
      conditions: [["width", ">", 200], ["height", ">", 200]],
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
    }
  ]);
});

test("should be able to output an optimised build", () => {});
