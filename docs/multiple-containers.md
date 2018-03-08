# Multiple Containers

Instead of processing each container individually, you might want to import all
styles containing container query syntax in a single file, and process that.

To do so, you'll have to switch off container auto-detection (which takes the
first class found in a processed file as the selector for a container) to allow
for the `@define-container;` declaration instead.

With that, you'll be able to declare multiple containers in a single file.

This is as simple as setting the `singleContainer` option to false.

(Also showcased in the [Usage with Gulp](gulp.md)) section.)

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

**Metadata structure**

Normally you don't have to care about the structure of the JSON meta file.
(In fact, I encourage you not to depend on anything in it, as it could potentially
change with new releases.)

However, if you run the plugin in `singleContainer: false` mode, you'll have the
extracted container metadata grouped by component selector in the resulting JSON:

```json
{
  ".Component1": {...},
  ".Component2": {...}
}
```

You can use this JSON to instantiate your `Container` classes as usual.

**Next:** [Usage Without webpack](without-webpack.md)
