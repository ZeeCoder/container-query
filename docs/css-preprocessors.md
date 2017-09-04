# Compatibility with Other CSS Preprocessors

From the examples above, you can see that I recommend using PostCSS.
However, other css preprocessors would work too, as long as they support custom
at-rules.

## SASS

Sass works out of the box with at-rules, even when they're nested.

They behave the same way media queries, which is great!

You can write things like:

```pcss
.Avatar {
    @define-container;
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
    @define-container;
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

## LESS

Support for at-rules is limited, but it'll work fine with v2.6.0 and above as
long as you avoid nesting.
