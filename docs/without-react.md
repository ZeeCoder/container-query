# Without React

Even though the library was made with webpack and React in mind, there's no
reason why other bundlers or UI libraries wouldn't work.

## Installation

```sh
yarn add @zeecoder/container-query --dev
# or
npm install @zeecoder/container-query --save-dev
```

**Just follow the same steps**

1. Process your styles with the PostCSS plugin, to extract all container-related
   data,
2. Save the metadata somewhere,
3. Serve the metadata to the runtime in some way,
4. Create a `Container` instance for all container html elements, with the metadata.

For instance, imagine you have a `main.pcss` file, which imports all other
components from other pcss files.

(Using [Gulp as described previously](gulp.md).)

Then, you can serve the JSON from the backend, and bundle the JS with your
favourite JS bundler, to grab that JSON and instantiate the Container class for
all elements found:

```js
// Assumptions:
// - Browserify as the bundler
// - JSON is available in a script tag, served by the backend as follows:
//   `<script type="application/json" id="container-metadata">{ ... }</script>`

import Container from "@zeecoder/container-query";

const meta = JSON.parse(
  document.getElementById("container-metadata").textContent
);

// Initialising all containers by finding all instances based on the selectors
for (let selector in meta) {
  document.querySelectorAll(selector).forEach(element => {
    // Initialising all HTML Elements with the right json metadata
    new Container(element, meta[selector]);
  });
}
```

The above doesn't cover dynamically created container elements, but that's the
general idea.

---

◀️️ [Multiple Containers](multiple-containers.md)

▶️️ [CSS Preprocessors](css-preprocessors.md)
