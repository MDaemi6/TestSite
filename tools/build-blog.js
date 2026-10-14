#!/usr/bin/env node
/* Rewrites the crawlable HTML inside blog.html from assets/js/blog-data.js.
   Run after editing the data file:   node tools/build-blog.js            */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const file = path.join(root, 'blog.html');
const B = require(path.join(root, 'assets/js/blog.js'));
const { cardHTML, num, CATS, ALL, BATCH } = B;

const sorted = ALL.slice().sort((a, b) => b.date.localeCompare(a.date));
const count = id => ALL.filter(a => a.cat === id).length;

const chips = ['<button class="bl-chip" type="button" data-cat="all" aria-pressed="true">همه <small>' + num(ALL.length) + '</small></button>']
  .concat(CATS.map(c => '<button class="bl-chip" type="button" data-cat="' + c.id + '" aria-pressed="false">' + c.name + ' <small>' + num(count(c.id)) + '</small></button>'))
  .join('\n                  ');

const first = sorted.slice(0, BATCH).map(a => cardHTML(a)).join('\n');
const rest = sorted.slice(BATCH).map(a => cardHTML(a)).join('');

const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const side = CATS.map(c => {
  const items = sorted.filter(a => a.cat === c.id);
  return '<details class="bl-acc" name="bl-cats"><summary><span>' + c.name + '</span><small>' + num(items.length) + ' مقاله</small><i aria-hidden="true"></i></summary>' +
    '<ul>' + items.map(a => '<li><a href="' + esc(a.url) + '">' + esc(a.title) + '</a></li>').join('') + '</ul>' +
    '<a class="bl-acc__all" href="' + c.url + '">همه مقاله‌های ' + c.name + ' ←</a></details>';
}).join('');

const real = sorted.filter(a => !a.demo);
const SITE = 'https://eateasily.net/';
const title = 'مقالات ایت مگ؛ آموزش لاغری، تغذیه، پزشکی، رژیم و روانشناسی';
const ld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage', '@id': SITE + 'blog/#webpage', url: SITE + 'blog/', name: title,
      inLanguage: 'fa-IR', isPartOf: { '@id': SITE + '#website' },
      breadcrumb: { '@id': SITE + 'blog/#breadcrumb' }, mainEntity: { '@id': SITE + 'blog/#list' }
    },
    {
      '@type': 'BreadcrumbList', '@id': SITE + 'blog/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'مقالات', item: SITE + 'blog/' }
      ]
    },
    {
      '@type': 'ItemList', '@id': SITE + 'blog/#list', name: 'مقالات ایت مگ',
      numberOfItems: real.length, itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: real.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: a.url, name: a.title }))
    }
  ]
};
const ldTag = '\n  <script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n  </script>\n  ';

let html = fs.readFileSync(file, 'utf8');
const put = (name, body) => {
  const re = new RegExp('<!--' + name + ':START-->[\\s\\S]*?<!--' + name + ':END-->');
  if (!re.test(html)) throw new Error('marker missing: ' + name);
  html = html.replace(re, () => '<!--' + name + ':START-->' + body + '<!--' + name + ':END-->');
};
put('CHIPS', '\n                  ' + chips + '\n');
put('ARTICLES', '\n' + first + '\n');
put('NOSCRIPT', rest);
put('SIDECATS', '\n            ' + side + '\n');
put('LD', ldTag);
fs.writeFileSync(file, html);
console.log('blog.html updated — ' + ALL.length + ' articles (' + real.length + ' real, ' + (ALL.length - real.length) + ' sample)');
