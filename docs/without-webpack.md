# Without webpack

Even though the library was made with webpack in mind, there's no reason why
other bundlers wouldn't work, or other UI libraries for that matter. (Instead
of React.)

**Just follow the same steps**

1. Process your styles with the PostCSS plugin, to extract all container-related
   information
2. Save the JSON(s) somewhere
3. Serve the JSON(s) to the JS some way
4. Create a Container instance for all container html elements

For instance, imagine you have a `main.pcss` file, which imports all other
components.

(Using Gulp as described previously.)

Then, you can serve the JSON from the backend, and bundle the JS with your
favourite JS bundler, to grab that JSON and instantiate the Container class for
all elements found:

```js
// Assumptions:
// - Browserify as the bundler
// - JSON is available in a script tag, served by the backend:
//   `<script type="application/json" id="container-stats">{ ... }</script>`

import Container from "@zeecoder/container-query";

const containerStats = JSON.parse(
  document.getElementById("container-stats").textContent
);

// Initialising all containers by finding all instances based on the selectors
for (let containerSelector in containerStats) {
  document.querySelectorAll(containerSelector).forEach(element => {
    // Initialising all HTML Elements with the right json stats
    new Container(element, containerStats[containerSelector]);
  });
}
```

The above doesn't cover dynamically created elements, but that's the general idea.

**Next:** [Syntax](syntax.md)
