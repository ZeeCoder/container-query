# Caveats

## ResizeObserver Polyfill Delay

The ResizeObserver polyfill reacts in ~20ms. For the most part that should be ok,
but if you need more control over when a container applies new styles, you can
switch off the observing behaviour, and call the `adjust` instance method on the
Container instance manually, when you see fit.

Due to this 20ms reaction time, the more you nest containers, the slower change
propagates from top to bottom.

**This is a non issue** with a native implementation however, for example in
Chrome 64 and up.

## Circularity

With element / container query solutions, circularity issues may arise. While
[an attempt](https://github.com/ZeeCoder/container-query/issues/20) to tackle
this was made, the same is still unfortunately true to this library as well.

Use your best judgement when using container queries to avoid these issues.

---

◀️️ [JS API](js-api.md)

▶️️ [CSS-in-JS](css-in-js.md)
