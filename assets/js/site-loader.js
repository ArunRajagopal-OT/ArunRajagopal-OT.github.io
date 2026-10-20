/*
  Shared loader for the portfolio.
  - index.html loads it with no data-section: the full portfolio is built from the parts below.
  - A section page (for example /speaking/index.html) loads it with data-section="speaking":
    the same parts are built, then only that section (plus the sidebar, nav and the Connect panel)
    is shown. The section page's own <title>, meta description and canonical replace the defaults.
  To add a part, edit PARTS. To add a section page, see README.md.
*/
(function () {
  var PARTS = ['site-00', 'site-01', 'site-02', 'site-03', 'site-04', 'site-05', 'site-06', 'site-07', 'site-08',
    'site-09a', 'site-09b1', 'site-09s', 'site-09b1x', 'site-09b2ascii1', 'site-09b2ascii2', 'site-10a',
    'site-10b1', 'site-10b21', 'site-10b22', 'site-11a', 'site-11b'];

  // Section id on the page -> URL of its own section page. Ids without a page go to /#id.
  var PAGES = {
    profile: '/profile/', leadership: '/leadership/', sectors: '/sectors/', impact: '/value/',
    speaking: '/speaking/', publications: '/publications/', credentials: '/credentials/',
    education: '/education/', clients: '/clients/', contact: '/contact/'
  };

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

  var SECTION_CSS =
    'html[data-section-page] .hero{display:none!important}' +
    'html[data-section-page] main.content>section{display:none!important}' +
    'html[data-section-page] main.content>section.is-section-page,' +
    'html[data-section-page] main.content>section#contact{display:block!important}' +
    'html[data-section-page] main.content{padding-top:118px}' +
    '@media(max-width:900px){html[data-section-page] main.content{padding-top:84px}}' +
    '.section-page-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;' +
    'margin:0 0 30px;padding:12px 14px 12px 18px;border:1px solid var(--line);border-radius:14px;background:var(--surface,rgba(255,255,255,.03))}' +
    '.section-page-bar .section-page-label{font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-2)}' +
    '.section-page-bar a{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--ink);text-decoration:none;' +
    'padding:8px 14px;border-radius:999px;border:1px solid var(--line-strong,var(--line))}' +
    '.section-page-bar a:hover,.section-page-bar a:focus-visible{border-color:var(--accent);color:var(--ink)}';

  function sectionScript(id) {
    // Runs inside the written document, after the site scripts.
    return '<script>(function(){' +
      'var id=' + JSON.stringify(id) + ',pages=' + JSON.stringify(PAGES) + ';' +
      'var sec=document.getElementById(id);' +
      'if(!sec){document.documentElement.removeAttribute("data-section-page");return;}' +
      'sec.classList.add("is-section-page");' +
      'var bar=document.createElement("div");bar.className="section-page-bar";' +
      'bar.innerHTML=\'<span class="section-page-label">Arun Rajagopal portfolio</span><a href="/">View full portfolio <span aria-hidden="true">&rarr;</span></a>\';' +
      'sec.insertBefore(bar,sec.firstChild);' +
      // Nav: same section scrolls, others open their page (or the full portfolio at that anchor).
      'document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-target]");if(!b)return;' +
      'var t=b.getAttribute("data-target");if(t===id){return;}e.preventDefault();e.stopPropagation();' +
      'location.href=t==="hero"?"/":(pages[t]||("/#"+t));},true);' +
      'function act(){document.querySelectorAll(".nav-link").forEach(function(l){l.classList.toggle("active",l.getAttribute("data-target")===id);});}' +
      'window.addEventListener("scroll",act,{passive:true});act();' +
      '})();<\/script>';
  }

  function beforeBodyEnd(html, s) {
    var i = html.toLowerCase().lastIndexOf('</body>');
    return i < 0 ? html + s : html.slice(0, i) + s + html.slice(i);
  }

  function build(html) {
    if (section) {
      // Make relative asset links absolute so they work from /<slug>/.
      html = html.replace(/(["'(])(assets\/|privacy\.html)/g, '$1/$2');
      html = html.replace(/<html([^>]*)>/i, '<html$1 data-section-page="' + esc(section) + '">');
      html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
      html = html.replace(/<meta[^>]*name="description"[^>]*>/i, '');
      html = html.replace(/<\/head>/i, sectionHead() + '<style>' + SECTION_CSS + '</style></head>');
      html = beforeBodyEnd(html, sectionScript(section));
    } else {
      // Full portfolio: honour deep links such as /#speaking after the document is rewritten.
      html = beforeBodyEnd(html,
        '<script>(function(){var h=location.hash.slice(1);if(!h)return;function go(){var el=document.getElementById(decodeURIComponent(h));if(el)el.scrollIntoView();}' +
        'if(document.readyState==="complete")setTimeout(go,0);else window.addEventListener("load",go);})();<\/script>');
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
