# New Static Website

My starting point for a new static website project

## Setting Up

Install all dependenties:

```shell
npm install
```

## Basic Usage

Start the Grunt task runner with the included webserver:

```shell
grunt dev
```

This will:

- create a build in the `./build` folder
- serve all content in the `./build` folder on port 3000
- watch for changes in the `./src'` folder and updates the build
- lifereloads the browser

For a production build:

```shell
grunt prod
```

## Incorporates

- [Block Element Modifier (BEM) methodology](https://en.bem.info/methodology/key-concepts/)
- [Inclusive design patterns](https://www.smashingmagazine.com/inclusive-design-patterns/)

## Includes

- Slightly changed parts from [GEL Foundations](https://github.com/bbc/gel-foundations)
- Slightly changed parts from [InuitCSS](https://github.com/inuitcss/inuitcss)
- [Handlebars](http://handlebarsjs.com/)
- [criticalCSS](https://github.com/filamentgroup/criticalcss)


## GEL Foundations
A consistent foundation for which the BBC online can be built upon (work in progress).

### What is this?
This is a flexible code implementation of the [GEL foundational guidelines](http://www.bbc.co.uk/gel/guidelines/category/foundations) (Typography, Grid & Iconography).

To understand more about the background and context of our GEL Foundations, have a read of the blog post: [Creating a foundation for everyone](http://www.bbc.co.uk/blogs/internet/entries/c7c8cbe9-fe4e-478b-8048-e15d7c2cd138)

### GEL Typography

#### What is this?

An implementation of the [GEL Typography Guidelines](http://www.bbc.co.uk/gel/guidelines/typography).
Providing typefaces, type sizes, weights, line-heights and tracking.
The GEL Typography scale has been established to work on all devices and is independent of device size and resolution.

The typographic scale has been optimised based on the size of the viewport and the input method being used. We take a 'touch first' approach to typography, adjustments are then made if a primary input other than touch has been detected.

It can used in two forms, using a Sass mixin:

```sass
.my-component {
    @include gel-typography('canon-bold');
}
```

Or by simply adding the relevant classes to your markup:

```html
<h1 class="gel-canon-bold">Global Experience Language</h1>
```

#### Usage

By default the GEL Typography component does not output any markup but exposes a Sass Mixin which can be called within your Sass.

**Example**

```scss
.my-component {
    @include gel-typography('pica');
}

.my-component__title {
    @include gel-typography('canon');
}
```

A collection of typography classes can be output by defining `$gel-type-enable--markup-output: true;` before you `@import` the typography partial.

**Example:**

```scss
$gel-type-enable--markup-output: true;

@import "gel-typography/typography";
```

The following configurable options are available:

##### General Configuration

- `$gel-type-namespace: 'gel-';` - the default namespace applied to all typography classes
- `$gel-type-touch-class: 'no-touch';` - the class exposed used by your touch detection script applied when a non-touch interface is detected

##### Output Configuration

- `$gel-type-enable--markup-output: false;` - output a collection of classes for each type group
- `$gel-type-enable--font-family: false;` - output the correct font-family required by GEL Typography, required if the BBC's global header and footer, Barlesque, is not available.
- `$gel-type-enable--base-elements: false;` - map the GEL Typography classes to the relevant HTML elements

##### Custom Font Configuration

If you're using another font-face other than Arial and need to make adjustments to any of the type settings you can do this by defining in a custom `$gel-type-settings` map.

*For example:* [BBC News](http://www.bbc.com/burmese) support many languages, some of which do not use latin based character sets which require custom font scripts. It is often the case that these custom fonts will require bespoke font-sizes or line-heights.

For example, the configuration for Burmese may look like:

```scss
$gel-type-settings: (
    'trafalgar': (
        'group-a': (
          'font-size': 22px,
          'line-height': 30px,
        ),
        'group-b': (
          'font-size': 26px,
          'line-height': 36px
        ),
        'group-c': (
          'font-size': 38px,
          'line-height': 50px
        ),
        'group-d': (
          'font-size': 32px,
          'line-height': 32px
        )
    ),
    'trafalgar-bold': (
       ...
    )
);
```

#### Touch Detection

We operate a [touch-first](http://www.bbc.co.uk/gel/guidelines/how-to-design-for-touch) approach to our Typography. Group C (touch) sizes are used from 600px by default and then detection should be used to get the Group D (non-touch) sizes.

We also understand that touch detection is not an absolute measure and does not guarantee a 'true or false' outcome - this is okay.

##### Why not just have Group C and remove Group D?

Products such as News & Sport require more densely packed, legacy-like font sizes for their 'desktop' experience. Eventually we aim to remove this group altogether.

##### How can you detect touch

There are a number of ways you can apply the touch detection. [Modernizr](https://modernizr.com), the common feature detection library offers some basic touch events detection. Alternatively, you could use your own bespoke detection script like this one used by [BBC Sport](https://github.com/bbc/onesport/blob/master/webapp/static-versioned/js/features.js#L5-L24).

#### Who is using this?

The following teams are currently using this component: GEL, News, Sport, Live, Homepage, Search, BBC Food, CBBC, CBeebies, BBC Three, MyBBC, K&L, Taster, Academy, Travel & Weather, BBC Music

If your team is using this component, let us know and we'll add you to the list.

#### Credits

- [Shaun Bent](https://twitter.com/shaunbent)
- [Al Jones](https://twitter.com/Itsaljones)

### GEL Grid

#### What is this?

An implementation of the [GEL Grid Guidelines](http://www.bbc.co.uk/gel/guidelines/grid).
The Grid provides a way of creating flexible and unique layouts whilst also maintaining consistent margins, gutters and containing widths across the BBC, online.

This is implementation of the grid is built using `flexbox` with an `inline-block` fallback older browsers. This allows us to support browsers IE8 and above.

It can used in two forms, by simply adding the relevant classes to your markup:

```html
<div class="gel-layout">
    <div class="gel-layout__item gel-1/2"></div>
    <div class="gel-layout__item gel-1/2"></div>
</div>
```

Or using a Sass mixin:

```sass
.my-component {
    @include gel-layout;
}

.my-component__item {
    @include gel-layout-item;
    @include gel-columns(1/2);
}
```

#### Usage

A collection of grid utility classes can be output by defining `$gel-grid-enable--markup-output: true;` before you `@import` the main grid partial.

**Example:**

```scss
$gel-grid-enable--markup-output: true;

@import "gel-grid/grid";
```

This will allow you to create grids using specific markup within your page. With the grid markup enabled, its possible to create grids like so:

```html
<div class="gel-wrap">
    <div class="gel-layout">
        <div class="gel-layout__item gel-1/2 gel-1/4@m"></div>
        <div class="gel-layout__item gel-1/2 gel-1/4@m"></div>
        <div class="gel-layout__item gel-1/2 gel-1/4@m"></div>
        <div class="gel-layout__item gel-1/2 gel-1/4@m"></div>
    </div>
</div>
```

This would create a grid with each item being 50% wide. At the medium GEL breakpoint (600px), the width of each item changes to 25%.

**Core Grid Classes**

- `gel-wrap` - the outer grid wrapper, defines the maximum width of the grid and applies page margins
- `gel-layout` - a grid row
- `gel-layout__item` - an item within the grid, applies gutters between items. Width can be controlled using width classes

**Modifier Classes**

- `gel-layout--flush` - removes gutters between items
- `gel-layout--rev` - reversed order of layout items, e.g. items 1, 2, 3, 4 in your markup will display in order 4, 3, 2, 1 on your page
- `gel-layout--middle` - align layout items to the vertical centers of each other
- `gel-layout--bottom` - align layout items to the vertical bottoms of each other
- `gel-layout--right` - make the layout items fill up from the right hand side
- `gel-layout--center` - make the layout items fill up from the center outward
- `gel-layout--auto` - cause layout items to take up a non-explicit amount of width

*Flexbox Only*
- `gel-layout--equal` - cause each layout item to be of equal height
- `gel-layout--fit` - allows each layout items to size itself automatically by dividing the space equally between the total number of items

##### Widths

Widths can be applied to grid items using a collection of utility classes which are automatically generated when the grid markup is enabled. The utility classes allow widths to be changed at different breakpoints.

The width utility classes are entirely fraction based allowing you to size grid elements proportionally. By default the following fractional groups are output: `whole`, `halves`, `thirds`, `quarters`, `fifths`, `eighths`, `tenths`, `twelfths` and `twenty-fourths`.

The class structure is as follows:

- `.gel-1/1` - 100%
- `.gel-1/2` - 50%
- `.gel-2/3` - 66.666666667%
- `.gel-10/12` - 83.333333333%

In order to reduce page weight we do not output whole fractions for each group as this can be simply normalised to one whole (`.gel-1/1`).

###### Breakpoints

It is possible to apply width classes at specific breakpoints by applying a breakpoint specific suffix to the end of the class. That might look something like this:

```html
<div class="gel-layout">
    <div class="gel-layout__item gel-1/1 gel-1/2@m gel-1/4@l"></div>
</div>
```

Here the item would be 100% wide by default, then 50% wide from 600px and 25% for anything beyond 900px.

The following breakpoint suffixes are available by default:

- `@s` - 400px
- `@m` - 600px
- `@l` - 900px
- `@xl` - 1008px
- `@xxl` - 1280px

**More information:**

- [Responsive suffixes](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/#responsive-suffixes)

###### Specificity

Utility classes like these width classes always need to win when it comes to specificity, otherwise they're not doing their job correctly. You should never need to override a utility class, if you do you're doing something wrong. E.g. if you'd used a class of `gel-1/2` you would never want it to be anything other than 50%. If you want something other than 50% you should have used a different class.

To help enforce this way of thinking all width utilities classes proactively carry the `!important` keyword to boost their specificity.

**More information:**

- [The Importance of !important(http://csswizardry.com/2016/05/the-importance-of-important/)

### Sass Mixins
The GEL grid component exposes a collection of Sass Mixins which can be called within your Sass. Should you need to create a more bespoke component which is not possible using the standard utility classes.

**Example**

```scss
.my-component {
    @include gel-layout;
}

.my-component__item {
    @include gel-layout-item;
    @include gel-columns(1/2);

    @if $enhanced {
        @include mq($from: gel-bp-m) {
            @include gel-columns(1/4);
        }
    }
}
```

**Available Mixins**

- `@include gel-wrap` - create the outer grid wrapper
- `@include gel-layout` - defines a single grid row
- `@include gel-layout-item` - a single grid item
- `@include gel-columns($span, $columns)` - outputs a width for the requested number of columns, accepts either a fraction or number of columns

**Available Functions:**

- `gel-columns($span, $columns)` - returns a width value for the requested number of columns, accepts either a fraction or number of columns

##### Flexbox
The grid is developed using `flexbox` giving us a flexible, powerful grid solution. Flexbox is not fully supported in all browsers and has seen a number of development iterations. With this in mind we have intentionally targeted specific implementations of flexbox and avoided some older more troublesome implementations.

For browsers which do not support flexbox we fallback to an `inline-block` grid which offers ~80% of the features available in the flexbox grid.

We recommend you include some JavaScript based [Feature Detection](https://modernizr.com/) which can apply a top level class to signify if flexbox is supported or not. This will increase the features available to older browsers. The specific class applied can be controlled using the `$gel-grid-flexbox-feature-detection-class` option.

The following features are only supported by the flexbox grid and will degrade gracefully:

- [Equal Height Columns](http://bbc.github.io/gel-grid/#equal-height)
- [Independent Alignment](http://bbc.github.io/gel-grid/#independent-alignment)
- [Automatic Grids](http://bbc.github.io/gel-grid/#fit)

**More information:**

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Can I Use: Flexbox](http://caniuse.com/#feat=flexbox)

##### 1280px
The GEL Grid guideline has been updated to include a wider 1280px breakpoint. By default the grid supports this breakpoint. It can be displayed by setting the `$gel-grid-enable--1280-breakpoint` to `false`.

It is also possible to toggle the 1280px breakpoint on and off based on the presence of a specific class. If a class name is supplied e.g. `$gel-grid-1280-toggle-class: 'b-pw-1280';` then all wider 1280px styles will be scoped in this class.

**More information:**

- [ORB 1280px Documentation](http://www.bbc.co.uk/frameworks/orb/css#orb-1280)

##### Box Sizing
The GEL Grid consistences of a combination of fixed gutters and margins with fluid width columns. This combination of fixed and fluid units is achieved using `box-sizing: border-box`.

If you do not have `border-box` defined globally on your project you will need to enable the `$gel-grid-enable--box-sizing` flag to enable a bundled fix.

**More information:**

- [Box Sizing Border Box FTW](http://www.paulirish.com/2012/box-sizing-border-box-ftw/)
- [ORB Box Sizing Reset](https://gist.github.com/shaunbent/ca6dc58305ae3e434615acf1ef368fe8)

##### inline-block & white-space
The GEL Grid is constructed using `flexbox` with an `inline-block` fallback for older browsers. Using `inline-block` allows us to achieve a lot of the same complex layout technique that flexbox offers and provides a more powerful and flexible grid than is possible with more traditional techniques likes the use of floats.

One challenge to the using of `display: inline-block;` is the white-space which is introduced between `inline-block` elements. This space is a representation of the space between elements in the HTML. In order for the grid to work correctly this space needs to be removed.

There are a few ways you can do this:

###### HTML Fix
The best way to get around this issue is to remove the space between elements in your HTML. This could be done by minifying your markup or by using HTML comments to comment out the space:

```html
<div class="gel-layout">
    <div class="gel-layout__item gel-1/2"></div><!--
 --><div class="gel-layout__item gel-1/2"></div>
</div>
```

If you're building you're grid using something like ReactJS you will not have this problem with space between elements as a result of how the markup is generated by the ReactJS library.

###### CSS Fix
It is possible to collapse the space using CSS. An optional CSS fix can be enabled by setting the `$gel-grid-enable--whitespace-fix` flag to `true`.

*Note:* This is included as an optional fix as it is not 100% guaranteed to work. There are certain edge cases where this solution falls down. The only 100% guaranteed and recommended solution is to remove the space in the HTML.

#### Configuration

The following configurable options are available:

##### General Configuration

- `$gel-grid-namespace: 'gel-';` - the default namespace applied to all grid classes
- `$gel-grid-breakpoint-namespace: 'gel-bp-';` - the default namespace applied to breakpoint variables from [GEL Sass Tools](https://github.com/bbc/gel-sass-tools/blob/master/lib/settings/_globals.scss#L68)
- `$gel-grid-1280-toggle-class: null` - an optional scoping class to wrap all 1280px grid style in. Allows the wider grid to be used in a products that do not fully support the wider grid yet
- `$gel-grid-breakpoints` - a Sass map containing a list of breakpoints width classes should be generated for
- `$gel-grid-breakpoints--1280` - a Sass map containing a list of breakpoints which relate specifically to the 1280 breakpoint
- `$gel-grid-default-columns: 12` - the default number of columns the grid should be based on
- `$gel-grid-columns` - a Sass list containing a list of which fractions utility classes will be generated for
- `$gel-grid-flexbox-feature-detection-class: 'no-flexbox'` - The class applied by a feature detection script to signify there the current browser doesn't support Flexbox

##### Output Configuration

- `$gel-grid-enable--markup-output: false;` - output a collection of utility classes
- `$gel-grid-enable--1280-breakpoint: true;` - toggle the support for the wider 1280px grid
- `$gel-grid-enable--box-sizing: false;` - enable built in `box-sizing` rules if `box-sizing: border-box;` is not already defined
- `$gel-grid-enable--whitespace-fix: false;` - enable a built CSS fix to collapse the whitespace between `inline-block` items, this fix is not guaranteed to work 100% of the time

#### Grid Bookmarklet

The following Grid Bookmarklets can be used to overlay the grid in the browser to check visual alignment of elements:

- [1280px - 12 Column](bookmarklets/12-col-1280.js)
- [1280px - 24 Column](bookmarklets/24-col-1280.js)
- [1008px - 12 Column](bookmarklets/12-col-1008.js)
- [1008px - 24 Column](bookmarklets/24-col-1008.js)

#### Credits

- [Shaun Bent](https://twitter.com/shaunbent)
- [Al Jones](https://twitter.com/Itsaljones)

The foundations of this grid is based on the great work of [Harry Roberts](https://twitter.com/csswizardry) and his [Inuit CSS Grid](https://github.com/inuitcss/objects.layout)

#### GEL Foundations License

> The MIT License (MIT)
>
> Copyright 2016 British Broadcasting Corporation
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
> the Software, and to permit persons to whom the Software is furnished to do so,
> subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
