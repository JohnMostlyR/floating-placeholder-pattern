# New Static Website

My starting point for a new static website project

## Setting Up

Install all dependanties:

```shell
npm init
```

## Basic Usage

Start the included webserver:

```shell
grunt run:server
```

This will serve all content in the `./public` folder on port 3000

Run the development Grunt tasks:

```shell
grunt dev
```

This will:

- Look for any new, or changed, images in the `./images` folder and copies them to `./publish/img` and optimizes them.
- Look for any new, or changed, JavaScript in the `./js` folder and copies those to `./public/js` folder where they are compiled from ES6 to ES5 and minimized.
- Look for any new, or changed, SASS files in the `./sass` folder and copies and compiles them to the `./publish/css` folder and minize the CSS files.
- Look for any new, or changes, handlebar files in the `./views` folder and copies and compile them to the `./publish` folder and minimize the HTML files.
- Create and minifies an above-the-fold CSS in the `./publish/css` folder.

## Includes

- InuitCSS: [https://github.com/inuitcss/inuitcss](http://)
- Handlebars: [http://handlebarsjs.com/](http://)
- criticalCSS: [https://github.com/filamentgroup/criticalcss](http://)