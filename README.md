# A form with floating placeholder pattern

When the user focuses on a field the placeholder moves aside behind the label so the user can still clearly see what input is expected.

This instead of the normal behaviour where the placeholder text is removed as soon as the field gets focus.

This is an attempt to do it in CSS only, so to not rely on a JavaScript that potentially could become unavailable, or turned off by the user. This is very well doable accept I also want to keep the reading sequence intact, for screen readers. So the label should be placed _before_ the input field.

As there is, currently, no possibility to select a previous sibling in CSS, what would be very helpful from point of view from the input element, I instead wrapped both label and field in a div and using the `:focus-within` pseudo selector. Unfortunately though for the moment it only works well in Firefox, with no support at all in, you guessed it, IE and Edge. See [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within) for more information.

Now how to detect if a user has typed in something in CSS and so make the placeholder text to not appear again.
For this I use the `:placeholder-shown` pseudo selector and the placeholder attribute with no text. This selector is however still experimental and for the browsers where it does work it _only_ works on form fields with input type is `text`.
See more [here](https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown).

All in all a fun experiment but not for production any time soon.

See a working, well, if you are using Firefox that is, example on [codepen](https://codepen.io/jmeester/pen/qXrpzZ).
