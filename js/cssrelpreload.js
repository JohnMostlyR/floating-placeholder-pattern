/*! CSS rel=preload polyfill. Depends on loadCSS function.
  [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT  */
(function (w) {
  // rel=preload support test
  if (!w.loadCSS) {
    return;
  }

  const rp = loadCSS.relpreload = {};

  rp.support = () => {
    try {
      return w.document.createElement('link').relList.supports('preload');
    } catch (e) {
      return false;
    }
  };

  // loop preload links and fetch using loadCSS
  rp.poly = () => {
    const links = w.document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.rel === 'preload' && link.getAttribute('as') === 'style') {
        w.loadCSS(link.href, link);
        link.rel = null;
      }
    }
  };

  // if link[rel=preload] is not supported, we must fetch the CSS manually using loadCSS
  if (!rp.support()) {
    rp.poly();
    const run = w.setInterval(rp.poly, 300);
    if (w.addEventListener) {
      w.addEventListener('load', () => {
        w.clearInterval(run);
      });
    }
    if (w.attachEvent) {
      w.attachEvent('onload', () => {
        w.clearInterval(run);
      });
    }
  }
}(this));
