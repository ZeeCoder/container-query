
@todo document @define-container; here.
@todo document multiple containers in a single file (singleContainer: false)
# Multiple Containers

Instead of processing each container individually, you might want to instead
import all styles containing containers in a single file, and then process that.

(This is the case described in [Usage with Gulp](gulp.md))

To do so, you'll have to switch off container auto-detection (which takes the
first class found in a processed file as the selector for a container) to allow
for the `@define-container;` declaration instead.

With that, you'll be able to declare multiple containers in a single file.

This is as simple as setting the `singleContainer` option to false, when using
the postcss plugin.

### Example

```pcss
.Component1 {
    @define-container;
    // ...
}

.Component2 {
    @define-container;
    // ...
}

// etc
```

**JSON structure**

Normally you don't have to care about the structure of the JSON file.
(In fact, I encourage you not to depend on anything in it, as it could potentially
change with new releases.)

However, if you incorporate all you styles into a single file before processing
it with the PostCSS plugin - using a workflow similar to what's described in [Usage with Gulp](gulp.md) for
example -, you'll instead have the extracted container stats grouped by
component selector in the resulting JSON:

```json
{
  ".Component1": {},
  ".Component2": {}
}
```

You can use this JSON to instantiate your `Container` classes as usual.

**Next:** [Usage Without webpack](without-webpack.md)
