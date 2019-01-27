# CSS Preprocessors

From the examples above, you can guess that I recommend using PostCSS. However,
other css preprocessors would work too, so long as they support custom at-rules.

## SASS

Sass works out of the box with at-rules, even when they're nested.

They behave the same way media queries, which is great!

You can write things like:

```pcss
.Avatar {
  /* ... */

  @container (width > 200px) {
    /* ... */
  }

  @container (height > 200px) {
    /* ... */
  }
}
```

Which compiles to:

```css
.Avatar {
  /* ... */
}

@container (width > 200px) {
  .Avatar {
    /* ... */
  }
}

@container (height > 200px) {
  .Avatar {
    /* ... */
  }
}
```

(This is equivalent to using postcss-nested with the bubble option.)

## LESS

Support for at-rules is limited, but it'll work fine with v2.6.0 and above as
long as you avoid nesting.

---

◀️️ [Without React](without-react.md)

▶️️ [Syntax](syntax.md)
