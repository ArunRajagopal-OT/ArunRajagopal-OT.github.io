/*
  Shared loader for the portfolio.
  - index.html loads it with no data-section: the full portfolio is built from the parts below.
  - A section page (for example /speaking/index.html) loads it with data-section="speaking":
    the full portfolio is built in the same way, then the page scrolls straight to that section.
    The section page's own <title>, meta description and canonical replace the defaults.
  To add a part, edit PARTS. To add a section page, see README.md.
*/
(function () {
  var PARTS = ['site-00', 'site-01', 'site-02', 'site-03', 'site-04', 'site-05', 'site-06', 'site-07', 'site-08',
    'site-09a', 'site-09b1', 'site-09s', 'site-09b1x', 'site-09b2ascii1', 'site-09b2ascii2', 'site-10a',
    'site-10b1', 'site-10b21', 'site-10b22', 'site-11a', 'site-11b'];


  var me = document.currentScript;
  var section = me && me.getAttribute('data-section');
  var root = section ? '/' : '';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function sectionHead() {
    // Copy title, description and canonical from the section page itself.
    var title = document.title;
    var d = document.querySelector('meta[name="description"]');
    var c = document.querySelector('link[rel="canonical"]');
    var out = '<title>' + esc(title) + '</title>';
    if (d) out += '<meta name="description" content="' + esc(d.content) + '"/>';
    if (c) out += '<link rel="canonical" href="' + esc(c.href) + '"/>';
    out += '<meta property="og:title" content="' + esc(title) + '"/>';
    if (d) out += '<meta property="og:description" content="' + esc(d.content) + '"/>';
    if (c) out += '<meta property="og:url" content="' + esc(c.href) + '"/>';
    return out;
  }

  function goTo(id) {
    // Runs inside the written document: scroll to the section once the page has loaded, then keep it
    // in place for a moment while images above it finish loading (stops as soon as the visitor scrolls).
    return '<script>(function(){var id=' + JSON.stringify(id) + ',stop=false,n=0;' +
      'function go(){if(stop)return;var el=document.getElementById(id);if(el)el.scrollIntoView();}' +
      '["wheel","touchstart","keydown","mousedown"].forEach(function(e){window.addEventListener(e,function(){stop=true;},{once:true,passive:true});});' +
      'function start(){go();var t=setInterval(function(){go();if(++n>=12)clearInterval(t);},250);}' +
      'if(document.readyState==="complete")setTimeout(start,0);else window.addEventListener("load",start);})();<\/script>';
  }

  function beforeBodyEnd(html, s) {
    var i = html.toLowerCase().lastIndexOf('</body>');
    return i < 0 ? html + s : html.slice(0, i) + s + html.slice(i);
  }

  function build(html) {
    if (section) {
      // Make relative asset links absolute so they work from /<slug>/.
      html = html.replace(/(["'(])(assets\/|privacy\.html)/g, '$1/$2');
      html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
      html = html.replace(/<meta[^>]*name="description"[^>]*>/i, '');
      html = html.replace(/<\/head>/i, sectionHead() + '</head>');
      html = beforeBodyEnd(html, goTo(section));
    } else {
      // Full portfolio: honour deep links such as /#speaking after the document is rewritten.
      var h = decodeURIComponent(location.hash.slice(1));
      if (h) html = beforeBodyEnd(html, goTo(h));
    }
    return html;
  }

  Promise.all(PARTS.map(function (p) {
    var url = root + 'exact/' + p + '.part';
    return fetch(url).then(function (r) { if (!r.ok) throw Error(url + ' ' + r.status); return r.text(); });
  })).then(function (parts) {
    var html = build(parts.join(''));
    document.open(); document.write(html); document.close();
  }).catch(function (e) {
    document.body.innerHTML = '<pre style="padding:24px;color:#f5f3ee;background:#0c1117">' + esc(e) + '</pre>';
  });
})();
