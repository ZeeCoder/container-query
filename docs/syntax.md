# Syntax

## Declaration

As previous examples show, containers can be declared by adding
`@define-container;` inside a rule that's meant to be used as a container.

(Unnecessary in `singleContainer` mode)

Multiple such definitions in a single CSS file are allowed. All container
queries and units will be relative to the previous declaration.

**Example**

```pcss
.User {
  @define-container;

  &__name {
    display: none;
    font-size: 10rh;
  }

  @container (width > 200px) {
    display: block;
  }
}

.Avatar {
  @define-container;

  border-radius: 100%;
  border: 1rh solid;

  @container (width < 30px), (height < 30px) {
    background: grey;
  }
}
```

Note that for container queries and container units to work, all elements must
be descendants of the container.

Using the above example, an element with the `.User__name` class will not have
its font-size adjusted, unless it's a descendant of a container element with
the `.User` class.

## Queries

Container queries have the same syntax media queries do:

```pcss
@container (condition) and (condition), (condition) {
  // styles
}
```

However, instead of writing min-width, min-height you can use the following
operators: `<`, `<=`, `>`, `>=`.

(In accordance width [CSS Media Queries Level 4](https://drafts.csswg.org/mediaqueries/#mq-range-context))

The following conditions are supported: width, height, aspect-ratio, orientation.

**Examples**

```pcss
@condition (orientation: landscape) {
}
@condition (orientation: portrait) {
}
@condition (width > 100px) {
}
@condition (height < 100px) {
}
@condition (aspect-ratio > 3) {
}
@condition (orientation: landscape) and (aspect-ratio > 3) {
}
```

If you want the same syntax for your media queries, then I recommend [this plugin](https://github.com/postcss/postcss-media-minmax).

## Units

Container units are like viewport units (vh, vw, vmin and vmax), only relative
to the container. They are useful to generate values based on the container's
size.

The supported units are: **rh**, **rw**, **rmin**, **rmax**.

**Syntax**: `<value><rh/rw/rmin/rmax>`

Depending on whether rh or rw is used, value stands for a percentage of the
container's width or height.

If a container's size is:

* width: 120px
* height: 130px

then

* 100rw → 120px
* 100rh → 130px
* 100rmin → 120px
* 100rmax → 130px
* 15rh → 11.53846px
* 15rw → 12.5px

And so on.

**Example**

```pcss
.User {
  @define-container;

  &__name {
    font-size: 10rh;
  }

  &__avatar {
    border-radius: 100%;
    border: 1rmin solid;
  }

  @container (height > 150px) {
    font-size: 15rh;
    border: 5rmin solid;
  }
}
```

Note that recalculating and applying these values is costly, since it's
done on each resize event (or `adjust` call).

### CSS Custom Properties

Setting custom properties are supported, which you can use to improve
performance.

```pcss
.User {
  @define-container;
  --rh: 1rh;
  --rmin: 1rmin;

  &__name {
    font-size: calc(10*var(--rh));
  }

  &__avatar {
    border-radius: 100%;
    border: calc(1*var(--rmin)) solid;
  }

  @container (height > 150px) {
    font-size: calc(15*var(--rh));
    border: calc(5*var(--rmin)) solid;
  }
}
```

## Note

You might be tempted to use container units to set an aspect ratio between the
container's width / height:

```pcss
.Container {
  @define-container;
  height: 50rw;
  // Height will now be 50% of it's width
}
```

While this works, there's a [pure CSS solution too](https://codepen.io/ZeeCaptein/pen/ZyEowo).

Admittedly more boilerplate, but it might worth avoiding JS when it's not really
necessary by using flexbox, CSS grid and other vanilla CSS solutions instead.

**Next:** [Api](api.md)
