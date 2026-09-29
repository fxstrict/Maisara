/* مكتب ميسرة خلاف — سكربت الموقع (Vanilla JS، بلا مكتبات) */
(function () {
  'use strict';

  var ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>'
  };
  var NAV = [
    ['index.html', 'الرئيسية', 'home'], ['about.html', 'عن الأستاذ', 'about'],
    ['specialties.html', 'مجالات الممارسة', 'specialties'], ['knowledge.html', 'الموسوعة القانونية', 'knowledge'],
    ['colleagues.html', 'للزملاء المحامين', 'colleagues'], ['contact.html', 'التواصل', 'contact']
  ];
  var S = {}, page = document.body.getAttribute('data-page') || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var getJSON = function (p) { return fetch(p).then(function (r) { if (!r.ok) throw new Error(p); return r.json(); }); };
  var param = function (k) { return new URLSearchParams(location.search).get(k) || ''; };
  var isPh = function (t) { return /^\s*\[.*\]\s*$/.test(t || ''); };
  var ph = function (t) { return isPh(t) ? '<span class="ph">' + esc(t) + '</span>' : esc(t); };
  var wa = function (msg) { return 'https://wa.me/' + S.whatsappNumber + '?text=' + encodeURIComponent(msg); };

  /* تطبيع عربي للبحث: إزالة التشكيل وتوحيد الألف والياء والتاء المربوطة */
  function norm(t) {
    return String(t || '').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\u0600-\u06FFa-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* ---------- الهيكل المشترك ---------- */
  function shell() {
    var cur = function (k) { return k === page || (page === 'specialty' && k === 'specialties') || (page === 'article' && k === 'knowledge') ? ' aria-current="page"' : ''; };
    var nav = NAV.map(function (n) { return '<a href="' + n[0] + '"' + cur(n[2]) + '>' + n[1] + '</a>'; }).join('');
    var head = '<a class="skip" href="#main">تخطَّ إلى المحتوى</a>' +
      '<header class="site-header"><div class="wrap"><a class="brand" href="index.html"><img src="assets/logo.svg" alt="" width="40" height="40"><span><b>ميسرة خلاف</b><small>' + esc(S.role) + '</small></span></a>' +
      '<nav class="nav" aria-label="التنقل الرئيسي">' + nav + '</nav>' +
      '<div class="hdr-actions"><a class="icon-btn" href="knowledge.html" aria-label="بحث في الموسوعة">' + ICON.search + '</a>' +
      '<a class="btn solid hdr-cta" href="appointment.html">طلب موعد</a></div></div></header>' +
      '<div class="menu" id="menu" aria-hidden="true"><div class="menu-top"><b class="kicker">القائمة</b><button class="icon-btn" id="menu-close" aria-label="إغلاق القائمة">' + ICON.close + '</button></div>' +
      NAV.map(function (n) { return '<a class="big" href="' + n[0] + '">' + n[1] + '</a>'; }).join('') +
      '<a class="big" href="appointment.html">طلب موعد</a><div class="small"><span>' + esc(S.officeName) + '</span></div></div>';
    document.body.insertAdjacentHTML('afterbegin', head);
    var f = S.social || {};
    var soc = [['facebook', 'فيسبوك'], ['instagram', 'إنستجرام'], ['x', 'إكس'], ['youtube', 'يوتيوب'], ['linkedin', 'لينكدإن']]
      .filter(function (s) { return f[s[0]]; }).map(function (s) { return '<li><a href="' + esc(f[s[0]]) + '" target="_blank" rel="noopener">' + s[1] + '</a></li>'; }).join('');
    var foot = '<footer class="site-footer"><div class="wrap"><div class="foot-grid">' +
      '<div><h4>' + esc(S.officeName) + '</h4><p>' + esc(S.degree) + '</p><p>' + esc(S.role) + '</p><p>' + ph(S.address) + '</p></div>' +
      '<div><h4>الموقع</h4><ul><li><a href="about.html">عن الأستاذ</a></li><li><a href="specialties.html">مجالات الممارسة</a></li><li><a href="knowledge.html">الموسوعة القانونية</a></li><li><a href="colleagues.html">للزملاء المحامين</a></li><li><a href="events.html">الأخبار والفعاليات</a></li><li><a href="gallery.html">معرض الصور</a></li></ul></div>' +
      '<div><h4>التواصل</h4><ul><li><a href="tel:' + esc(S.phoneTel) + '">اتصال: <span dir="ltr">' + esc(S.phoneDisplay) + '</span></a></li><li><a href="' + wa('السلام عليكم، أرغب في التواصل بخصوص موضوع قانوني.') + '" target="_blank" rel="noopener">واتساب</a></li><li><a href="appointment.html">طلب موعد</a></li><li><a href="contact.html">صفحة التواصل</a></li></ul></div>' +
      '<div><h4>تابعنا</h4><ul>' + (soc || '<li class="ph">[تُضاف روابط التواصل الاجتماعي]</li>') + '</ul></div></div>' +
      '<div class="foot-legal"><p>' + esc(S.disclaimer) + '</p><p>© ' + new Date().getFullYear() + ' ' + esc(S.officeName) + '</p></div></div></footer>' +
      '<nav class="bottom-nav" aria-label="إجراءات سريعة"><a href="tel:' + esc(S.phoneTel) + '">' + ICON.phone + 'اتصل</a>' +
      '<a href="' + wa('السلام عليكم، أرغب في التواصل بخصوص موضوع قانوني.') + '" target="_blank" rel="noopener">' + ICON.wa + 'واتساب</a>' +
      '<a href="appointment.html">' + ICON.cal + 'موعد</a><button type="button" class="menu-btn" id="menu-open" aria-controls="menu" aria-expanded="false">' + ICON.menu + 'القائمة</button></nav>';
    document.body.insertAdjacentHTML('beforeend', foot);
    var menu = $('#menu'), openB = $('#menu-open');
    function setMenu(o) { menu.classList.toggle('open', o); menu.setAttribute('aria-hidden', String(!o)); openB.setAttribute('aria-expanded', String(o)); document.body.style.overflow = o ? 'hidden' : ''; if (o) $('#menu-close').focus(); else openB.focus(); }
    openB.addEventListener('click', function () { setMenu(true); });
    $('#menu-close').addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  /* ---------- ربط البيانات المركزية ---------- */
  function bind() {
    $$('[data-bind]').forEach(function (el) { var v = S[el.getAttribute('data-bind')]; if (v != null) el.innerHTML = ph(v); });
    $$('[data-wa]').forEach(function (el) { el.href = wa(el.getAttribute('data-wa')); el.target = '_blank'; el.rel = 'noopener'; });
    $$('[data-tel]').forEach(function (el) { el.href = 'tel:' + S.phoneTel; });
    $$('[data-social]').forEach(function (el) { var u = (S.social || {})[el.getAttribute('data-social')]; if (u) { el.href = u; el.target = '_blank'; el.rel = 'noopener'; } else el.hidden = true; });
    $$('[data-hours]').forEach(function (el) { el.innerHTML = (S.hours || []).map(function (h) { return '<li><b>' + ph(h.days) + '</b>' + ph(h.time) + '</li>'; }).join(''); });
    $$('[data-map]').forEach(function (el) {
      if (S.mapsEmbedUrl) el.innerHTML = '<iframe src="' + esc(S.mapsEmbedUrl) + '" title="موقع المكتب على الخريطة" loading="lazy"></iframe>';
      else el.innerHTML = '<p class="ph">[يضاف عنوان المكتب النهائي ورابط Google Maps]</p>';
    });
    $$('[data-directions]').forEach(function (el) { if (S.mapsUrl) { el.href = S.mapsUrl; el.target = '_blank'; el.rel = 'noopener'; } else el.hidden = true; });
    var obs = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }); }, { threshold: .08 }) : null;
    $$('.reveal').forEach(function (el) { obs ? obs.observe(el) : el.classList.add('in'); });
  }

  function setMeta(title, desc) {
    document.title = title;
    var d = $('meta[name="description"]'); if (d && desc) d.setAttribute('content', desc);
    ['og:title', 'og:description'].forEach(function (p, i) { var m = $('meta[property="' + p + '"]'); if (m) m.setAttribute('content', i ? desc : title); });
  }
  function jsonld(obj) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(obj); document.head.appendChild(s); }

  /* ---------- مكوّنات العرض ---------- */
  function specRow(s) { return '<li><a href="specialty.html?slug=' + esc(s.slug) + '"><span class="r-t">' + esc(s.title) + '</span><p class="r-d">' + ph(s.shortDescription) + '</p></a></li>'; }
  function artRow(a) { return '<li><a href="article.html?slug=' + esc(a.slug) + '"><span class="meta">' + esc(a.category) + ' · قراءة ' + a.readingTime + ' دقائق</span><span class="r-t">' + esc(a.title) + '</span><p class="r-d">' + esc(a.excerpt) + '</p></a></li>'; }
  function draftNote() { return S.showDraftNotices === false ? '' : '<p class="notice">قائمة مجالات الممارسة مبدئية، وتُعتمد صياغتها ونطاقها من صاحب الموقع قبل النشر النهائي.</p>'; }

  var Pages = {
    home: function (d) {
      $('#home-specs').innerHTML = d.spec.items.slice(0, 5).map(specRow).join('');
      $('#home-arts').innerHTML = d.art.items.map(artRow).join('');
    },
    specialties: function (d) { $('#spec-note').innerHTML = draftNote(); $('#spec-list').innerHTML = d.spec.items.map(specRow).join(''); },
    specialty: function (d) {
      var s = d.spec.items.filter(function (x) { return x.slug === param('slug'); })[0], box = $('#spec');
      if (!s) { box.innerHTML = '<h1>المجال غير موجود</h1><p><a class="link" href="specialties.html">العودة إلى مجالات الممارسة</a></p>'; return; }
      setMeta(s.seoTitle, s.seoDescription);
      var rel = d.art.items.filter(function (a) { return (s.articles || []).indexOf(a.slug) > -1; });
      box.innerHTML = '<nav class="crumbs" aria-label="مسار التصفح"><a href="index.html">الرئيسية</a><span aria-hidden="true">‹</span><a href="specialties.html">مجالات الممارسة</a><span aria-hidden="true">‹</span>' + esc(s.title) + '</nav>' +
        '<h1>' + esc(s.title) + '</h1><p class="lede">' + ph(s.shortDescription) + '</p><p>' + ph(s.fullDescription) + '</p>' + draftNote() +
        '<h2>الخدمات المرتبطة</h2><ul class="rows">' + s.services.map(function (x) { return '<li><a class="static"><span class="r-t">' + ph(x) + '</span></a></li>'; }).join('') + '</ul>' +
        (s.faq.length ? '<h2 class="mt">أسئلة شائعة</h2><div class="faq">' + s.faq.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div>' : '') +
        (rel.length ? '<h2 class="mt">مقالات مرتبطة</h2><ul class="rows">' + rel.map(artRow).join('') + '</ul>' : '') +
        '<div class="btn-row"><a class="btn solid" href="appointment.html?specialty=' + encodeURIComponent(s.title) + '">طلب استشارة</a><a class="btn" href="' + wa('السلام عليكم، أرغب في الاستفسار عن ' + s.title + '.') + '" target="_blank" rel="noopener">تواصل عبر واتساب</a></div>';
      jsonld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'الرئيسية', item: new URL('index.html', location.href).href }, { '@type': 'ListItem', position: 2, name: 'مجالات الممارسة', item: new URL('specialties.html', location.href).href }, { '@type': 'ListItem', position: 3, name: s.title }] });
    },
    knowledge: function (d) {
      var input = $('#q'), out = $('#results');
      var idx = [];
      d.art.items.forEach(function (a) { idx.push({ t: 'مقال', title: a.title, desc: a.excerpt, url: 'article.html?slug=' + a.slug, hay: norm([a.title, a.excerpt, a.category, a.tags.join(' '), a.content.map(function (c) { return c.text; }).join(' ')].join(' ')) }); });
      (d.art.faqs || []).forEach(function (f) { idx.push({ t: 'سؤال وجواب', title: f.q, desc: f.a, url: 'specialty.html?slug=' + f.specialty, hay: norm(f.q + ' ' + f.a) }); });
      (d.art.guides || []).forEach(function (g) { idx.push({ t: 'دليل', title: g.title, desc: g.excerpt, url: '#', hay: norm(g.title + ' ' + g.excerpt) }); });
      d.spec.items.forEach(function (s) { idx.push({ t: 'مجال ممارسة', title: s.title, desc: s.shortDescription, url: 'specialty.html?slug=' + s.slug, hay: norm([s.title, s.shortDescription, s.fullDescription, s.services.join(' '), s.faq.map(function (f) { return f.q + ' ' + f.a; }).join(' ')].join(' ')) }); });
      function run() {
        var q = norm(input.value), words = q.split(' ').filter(Boolean);
        if (!words.length) { out.innerHTML = '<ul class="rows">' + d.art.items.map(artRow).join('') + '</ul>'; return; }
        var hits = idx.map(function (i) { var sc = 0; words.forEach(function (w) { if (norm(i.title).indexOf(w) > -1) sc += 3; if (i.hay.indexOf(w) > -1) sc += 1; }); return { i: i, sc: sc, all: words.every(function (w) { return i.hay.indexOf(w) > -1; }) }; })
          .filter(function (h) { return h.all; }).sort(function (a, b) { return b.sc - a.sc; });
        out.innerHTML = hits.length ? '<p class="meta" role="status">' + hits.length + ' نتيجة</p><ul class="rows">' + hits.map(function (h) { return '<li><a href="' + esc(h.i.url) + '"><span class="meta">' + h.i.t + '</span><span class="r-t">' + esc(h.i.title) + '</span><p class="r-d">' + esc(h.i.desc) + '</p></a></li>'; }).join('') + '</ul>'
          : '<p role="status">لا توجد نتائج مطابقة. جرّب كلمات أبسط، أو <a class="link" href="appointment.html">اطلب موعدًا</a> لعرض سؤالك.</p>';
      }
      input.value = param('q'); input.addEventListener('input', run); $('#search-form').addEventListener('submit', function (e) { e.preventDefault(); run(); }); run();
      $('#guides').innerHTML = (d.art.guides || []).map(function (g) { return '<li><a class="static"><span class="r-t">' + ph(g.title) + '</span><p class="r-d">' + esc(g.excerpt) + '</p></a></li>'; }).join('');
    },
    article: function (d) {
      var a = d.art.items.filter(function (x) { return x.slug === param('slug'); })[0], box = $('#article');
      if (!a) { box.innerHTML = '<h1>المقال غير موجود</h1><p><a class="link" href="knowledge.html">العودة إلى الموسوعة</a></p>'; return; }
      setMeta(a.title + ' — الموسوعة القانونية', a.excerpt);
      var link = $('link[rel="canonical"]'); if (link) link.href = location.origin + location.pathname + '?slug=' + a.slug;
      var reviewed = a.reviewStatus === 'reviewed' && a.legalReviewDate;
      var body = a.content.map(function (c) { return c.type === 'h2' ? '<h2>' + esc(c.text) + '</h2>' : '<p>' + esc(c.text) + '</p>'; }).join('');
      var rel = (a.relatedArticles || []).map(function (s) { return d.art.items.filter(function (x) { return x.slug === s; })[0]; }).filter(Boolean);
      var rs = (a.relatedSpecialties || []).map(function (s) { return d.spec.items.filter(function (x) { return x.slug === s; })[0]; }).filter(Boolean);
      box.innerHTML = '<nav class="crumbs" aria-label="مسار التصفح"><a href="index.html">الرئيسية</a><span aria-hidden="true">‹</span><a href="knowledge.html">الموسوعة القانونية</a><span aria-hidden="true">‹</span>' + esc(a.category) + '</nav>' +
        '<span class="kicker">' + esc(a.category) + '</span><h1>' + esc(a.title) + '</h1><p class="lede">' + esc(a.excerpt) + '</p>' +
        '<p class="meta">تاريخ النشر: ' + (a.datePublished ? esc(a.datePublished) : '<span class="ph">[تاريخ النشر]</span>') + ' · آخر مراجعة: ' + (reviewed ? esc(a.legalReviewDate) : '<span class="ph">[تاريخ المراجعة القانونية]</span>') + ' · قراءة ' + a.readingTime + ' دقائق</p>' +
        (reviewed ? '' : '<p class="notice">مسودة — تحتاج مراجعة قانونية قبل اعتمادها.</p>') +
        (a.featuredImage ? '<div class="hero-art"><img src="' + esc(a.featuredImage) + '" alt="" loading="eager"></div>' : '') +
        '<div class="article-layout"><div><div class="article-body">' + body + '</div>' +
        '<h2 class="mt">المصادر</h2><ul class="sources">' + a.sources.map(function (s) { return '<li>' + ph(s) + '</li>'; }).join('') + '</ul>' +
        '<p class="notice">' + esc(S.disclaimer) + '</p>' +
        '<div class="feedback" id="fb"><b>هل أجاب هذا المقال عن سؤالك؟</b><div class="btn-row"><button class="btn" id="fb-yes" type="button">نعم</button><button class="btn" id="fb-no" type="button">لم أجد ما أبحث عنه</button></div><p id="fb-out" class="mt-s" role="status"></p></div></div>' +
        '<aside class="aside-sticky"><div class="btn-row"><a class="btn solid" href="' + wa('السلام عليكم، قرأت مقال «' + a.title + '» وأحتاج إلى توضيح بخصوص...') + '" target="_blank" rel="noopener">اسأل عبر واتساب</a><button class="btn" id="share" type="button">مشاركة المقال</button></div>' +
        (rs.length ? '<h3 class="mt">التخصص المرتبط</h3><ul class="rows">' + rs.map(specRow).join('') + '</ul>' : '') +
        (rel.length ? '<h3 class="mt">مقالات مرتبطة</h3><ul class="rows">' + rel.map(artRow).join('') + '</ul>' : '') + '</aside></div>';
      $('#fb-yes').onclick = function () { $('#fb-out').textContent = 'شكرًا لك. يسعدنا أن المقال كان مفيدًا.'; };
      $('#fb-no').onclick = function () { $('#fb-out').innerHTML = 'نأسف لذلك. اكتب لنا سؤالك وسنوجهك للمسار المناسب: <a class="link" target="_blank" rel="noopener" href="' + wa('السلام عليكم، قرأت مقال «' + a.title + '» ولم أجد إجابة سؤالي، وأحتاج إلى توضيح بخصوص...') + '">أرسل عبر واتساب</a> أو <a class="link" href="appointment.html">اطلب موعدًا</a>.'; };
      $('#share').onclick = function () { var u = location.href; if (navigator.share) navigator.share({ title: a.title, url: u }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { $('#share').textContent = 'تم نسخ الرابط'; }); };
      jsonld({ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, inLanguage: 'ar', author: { '@type': 'Person', name: S.personName }, datePublished: a.datePublished || undefined, dateModified: a.dateModified || undefined });
    },
    colleagues: function (d) {
      $('#col-sections').innerHTML = d.col.sections.map(function (s) { return '<li id="' + esc(s.id) + '"><a class="static"><span class="r-t">' + esc(s.title) + '</span><p class="r-d">' + ph(s.text) + '</p></a></li>'; }).join('');
      $('#support-form').addEventListener('submit', function (e) {
        e.preventDefault(); var v = function (id) { return $('#' + id).value.trim(); };
        window.open(wa('السلام عليكم أستاذ ميسرة،\nمعك الزميل/ـة: ' + v('c-name') + '\nنوع الموضوع: ' + v('c-type') + '\nتفاصيل الموضوع: ' + v('c-details') + '\n—\nرسالة عبر بوابة الزملاء في الموقع'), '_blank', 'noopener');
      });
    },
    events: function (d) {
      var real = d.ev.items.filter(function (x) { return !x.placeholder; });
      $('#ev-list').innerHTML = real.length ? real.map(function (x) { return '<li><a><span class="meta">' + esc(x.category) + ' · ' + esc(x.date) + '</span><span class="r-t">' + esc(x.title) + '</span><p class="r-d">' + esc(x.description) + '</p></a></li>'; }).join('') : '<li><a class="static"><span class="r-t ph">[تُضاف هنا الفعاليات والأخبار عند اعتمادها]</span><p class="r-d">تُدار القائمة من الملف data/events.json دون تعديل الصفحة.</p></a></li>';
    },
    gallery: function (d) {
      var cats = ['الكل'].concat(d.gal.categories), box = $('#gal'), fl = $('#filters');
      function draw(c) {
        var its = d.gal.items.filter(function (i) { return c === 'الكل' || i.category === c; });
        box.innerHTML = its.length ? its.map(function (i) { return '<figure><a href="' + esc(i.image) + '"><picture><source type="image/webp" srcset="' + esc(i.webp) + '"><img src="' + esc(i.image) + '" alt="' + esc(i.alt) + '" loading="lazy" width="800" height="600"></picture></a><figcaption>' + esc(i.caption) + '</figcaption></figure>'; }).join('') : '<p class="ph">[لا توجد صور في هذا القسم بعد]</p>';
        $$('button', fl).forEach(function (b) { b.setAttribute('aria-pressed', String(b.textContent === c)); });
      }
      fl.innerHTML = cats.map(function (c) { return '<button type="button" aria-pressed="false">' + c + '</button>'; }).join('');
      fl.addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') draw(e.target.textContent); }); draw('الكل');
    },
    appointment: function (d) {
      var sel = $('#a-spec'); sel.innerHTML = '<option value="">غير محدد</option>' + d.spec.items.map(function (s) { return '<option>' + esc(s.title) + '</option>'; }).join('');
      if (param('specialty')) sel.value = param('specialty');
      $('#appt-form').addEventListener('submit', function (e) {
        e.preventDefault(); var v = function (id) { return $('#' + id).value.trim() || '—'; };
        window.open(wa('السلام عليكم، أرغب في طلب موعد لمناقشة موضوع قانوني.\nالاسم: ' + v('a-name') + '\nالهاتف: ' + v('a-phone') + '\nالخدمة: ' + v('a-service') + '\nالتخصص: ' + v('a-spec') + '\nالموعد المقترح: ' + v('a-when') + '\nطريقة التواصل المفضلة: ' + v('a-way') + '\nوصف مختصر: ' + v('a-details')), '_blank', 'noopener');
        $('#appt-out').textContent = 'تم تجهيز رسالة الطلب في واتساب. هذا طلب موعد وليس حجزًا مؤكدًا، وسيتم التواصل معك للتأكيد.';
      });
    }
  };

  /* ---------- التشغيل ---------- */
  var need = { home: ['spec', 'art'], specialties: ['spec'], specialty: ['spec', 'art'], knowledge: ['spec', 'art'], article: ['spec', 'art'], colleagues: ['col'], events: ['ev'], gallery: ['gal'], appointment: ['spec'] };
  var files = { spec: 'data/specialties.json', art: 'data/articles.json', col: 'data/colleagues.json', ev: 'data/events.json', gal: 'data/gallery.json' };
  getJSON('data/site.json').then(function (site) {
    S = site; shell(); bind(); (function(){ var c=$('link[rel="canonical"]'); if(c && /^http/.test(location.protocol)){ var sl=param('slug'); c.href=location.origin+location.pathname+(sl?'?slug='+encodeURIComponent(sl):''); var u=$('meta[property="og:url"]'); if(u) u.setAttribute('content',c.href);} })();
    var keys = need[page] || [];
    return Promise.all(keys.map(function (k) { return getJSON(files[k]); })).then(function (arr) {
      var d = {}; keys.forEach(function (k, i) { d[k] = arr[i]; });
      if (Pages[page]) Pages[page](d);
      bind();
    });
  }).catch(function (err) {
    var m = $('#main'); if (m) m.insertAdjacentHTML('afterbegin', '<p class="notice">تعذّر تحميل بيانات الموقع. إذا فتحت الملف مباشرة من الجهاز فشغّله عبر خادم محلي أو من GitHub Pages.</p>');
    if (window.console) console.error(err);
  });
})();
