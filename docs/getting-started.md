# Getting Started

This solution consists of a PostCSS plugin and a JS (`Container`) class that
takes care of runtime styling.

> PostCSS → Metadata → Runtime

The plugin analyses your CSS and extracts all container query related
data, producing a metadata object.

Depending on your setup this file could contain more than one container's data.
(See [Multiple Containers](multiple-containers.md) for more details.)

Once you have your metadata, all you need to do is to feed it to the Container
instance, and it will take care of the rest!

Your job is even easier in React, as Container instantiation is abstracted away.

**One important note on containers:**

For container queries and units to work, all elements using container queries
must be descendants of a container, as their conditions and values only makes
sense in a container's context.)

---

▶️ [Parcel](parcel.md)

▶️ [webpack](webpack.md)

▶️ [Gulp](gulp.md)
