# Multiple Containers

Instead of processing each container individually (on css file for each component
for example), you might want to import all styles containing multiple container
declarations in a single file, and process that.

To do so, you'll have to switch off container auto-detection - which takes the
first css class found in a processed file as the selector for the container - to
allow for the `@define-container;` declaration instead.

With that, you'll be able to declare multiple containers in a single file.

This is as simple as setting the `singleContainer` option to false.

(Showcased in the [Gulp](gulp.md)) section.)

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

### Metadata Structure

When you don't declare multiple containers in a single file, you don't have to
care about the structure of the JSON meta file.

However, if you run the plugin in `singleContainer: false` mode, you'll have the
extracted container metadata grouped by container selector in the resulting JSON:

```json
{
  ".Component1": {...},
  ".Component2": {...}
}
```

You can use this JSON to instantiate your `Container` classes as outlined in the
[Without React](without-react.md) section.

---

◀️️ [CSS Modules](css-modules.md)

▶️️ [Without React](without-react.md)
