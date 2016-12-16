/**
 * Created by Johan on 13-11-2016.
 */
!function (root) {
  'use strict';

  const doc = root.document;

  //  a simple event handler wrapper
  function on(el, ev, callback) {
    if (el.addEventListener) {
      el.addEventListener(ev, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + ev, callback);
    }
  }

  // quick way to determine whether a css file has been cached locally
  function fileIsCached(id, href) {
    return root.localStorage
      && localStorage[id + '_content']
      && localStorage[id + '_file'] === href;
  }

  // time to get the actual css file
  function injectFontsStylesheet(id, href) {
    // if this is an older browser
    if (!root.localStorage || !root.XMLHttpRequest) {
      const stylesheet = doc.createElement('link');
      stylesheet.href = href;
      stylesheet.id = id;
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      doc.getElementsByTagName('head')[0].appendChild(stylesheet);

      // just use the native browser cache
      // this requires a good expires header on the server
      doc.cookie = id;
    } else {
      // if this isn't an old browser
      if (fileIsCached(id, href)) {
        // use the cached version if we already have it
        injectRawStyle(localStorage[id + '_content']);
      } else {
        // otherwise, load it with ajax
        loadWithAjax(id, href);
      }
    }
  }

  function loadWithAjax(id, href) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', href, true);

    // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
    xhr.onreadystatechange = () => {
      // once we have the content, quickly inject the css rules
      if (xhr.readyState === 4 && xhr.status === 200 && injectRawStyle(xhr.responseText)) {
        // and cache the text content for further use
        // notice that this overwrites anything that might have already been previously cached
        localStorage[id + '_content'] = xhr.responseText;
        localStorage[id + '_file'] = href;
      }
    };

    xhr.send();
  }

  // this is the simple utitily that injects the cached or loaded css text
  function injectRawStyle(text) {
    const style = doc.createElement('style');

    // cater for IE8 which doesn't support style.innerHTML
    style.setAttribute('type', 'text/css');

    if (style.styleSheet) {
      style.styleSheet.cssText = text;
    } else {
      style.innerHTML = text;
    }

    doc.getElementsByTagName('head')[0].appendChild(style);
  }

  /*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */
  const loadCSS = (href, before, media) => {
    /**
     * Arguments explained:
     * `href` [REQUIRED] is the URL for your CSS file.
     * `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
     *    By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you
     *    might desire a more specific location in your doc.
     * `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
     */
    let ref;
    let ss = doc.createElement('link');

    if (before) {
      ref = before;
    } else {
      const refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
      ref = refs[refs.length - 1];
    }

    // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
    function ready(cb) {
      if (doc.body) {
        cb();
      }

      setTimeout(() => {
        ready(cb);
      });
    }

    function loadCB() {
      if (ss.addEventListener) {
        ss.removeEventListener('load', loadCB);
      }

      ss.media = media || 'all';
    }

    const sheets = doc.styleSheets;
    ss.rel = 'stylesheet';
    ss.href = href;

    //  temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = 'only x';

    /**
     * Inject link
     * Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the
     *  argument to "after" in a later release and standardize on ref.nextSibling for all refs
     * Note: `insertBefore` is used instead of `appendChild`, for safety
     *  re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    */
    ready(() => {
      ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
    });

    /**
     * A method (exposed on return object for external use) that mimics onload by polling doc.styleSheets until it
     *  includes the new sheet.
     */
    const onloadcssdefined = (cb) => {
      for (let resolvedHref = ss.href, i = sheets.length; i--;) {
        if (sheets[i].href === resolvedHref) {
          return cb();
        }
      }

      setTimeout(() => {
        onloadcssdefined(cb);
      });
    };

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if (ss.addEventListener) {
      ss.addEventListener('load', loadCB);
    }

    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(loadCB);
    return ss;
  };

  if (typeof exports !== 'undefined') {
    exports.loadCSS = loadCSS;
  } else {
    root.loadCSS = loadCSS;
    root.loadLocalStorageCSS = (id, href) => {
      // if we have the fonts in localStorage or if we've cached them using the native batrowser cache
      if (fileIsCached(id, href) || doc.cookie.indexOf(id) > -1) {
        // just use the cached version
        injectFontsStylesheet(id, href);
      } else {
        // otherwise, don't block the loading of the page; wait until it's done.
        on(root, 'load', () => {
          injectFontsStylesheet(id, href);
        });
      }
    };
  }
}(this);
