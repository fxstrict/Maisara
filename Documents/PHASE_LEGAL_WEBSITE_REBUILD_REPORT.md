# تقرير إعادة بناء الموقع القانوني

## 1. Summary
أُعيد بناء الموقع من صفحات ثابتة مكررة إلى بنية Static قائمة على بيانات JSON مركزية، مع هوية تحريرية (كحلي حبر، عاجي، فحمي، برونزي مطفأ)، وتوجيه بصري مستقل للموبايل والديسكتوب، وموسوعة قانونية بحث، وبوابة للزملاء، وطلب موعد عبر واتساب. لم يُدفع شيء إلى GitHub.

## 2. Current Architecture (قبل التعديل)
4 صفحات HTML (`index, about, specialties, contact`) + `style.css` + `script.js` + 5 صور. الهيدر والفوتر وشعار SVG مكررة في كل صفحة، و105 عنصر `style=""` مضمّن، وحركة دوران دائمة للشعار، وأرقام/آراء وهمية، وصفة "نقيب" في كل الصفحات.

## 3. New Architecture
HTML صغير لكل صفحة + `js/app.js` (يحقن الهيدر/الفوتر/القائمة/الشريط السفلي ويرسم الصفحات من JSON) + `css/style.css` + `data/*.json`. لا مكتبات خارجية باستثناء خطي Google Fonts. الصفحات: الرئيسية، عن الأستاذ، مجالات الممارسة (+صفحة تفصيلية بـ `?slug=`)، الموسوعة والبحث، المقال (`?slug=`)، للزملاء، الأخبار والفعاليات، المعرض، طلب موعد، التواصل.

## 4. Files Changed
`index.html`, `about.html`, `specialties.html`, `contact.html`, `README.md`

## 5. Files Added
`appointment.html`, `article.html`, `colleagues.html`, `events.html`, `gallery.html`, `knowledge.html`, `specialty.html`, `css/style.css`, `js/app.js`, `data/{site,specialties,articles,events,colleagues,gallery}.json`, `assets/logo.svg`, `assets/favicon.svg`, `assets/hero-mobile.{jpg,webp}`, `assets/{portrait-court,portrait-desk,portrait-formal,portrait-office-colleague,campaign-banner}.webp`, `manifest.webmanifest`, `sitemap.xml`, `robots.txt`, وملفات `Documents/`.

## 6. Files Removed
`style.css` و`script.js` في الجذر (استُبدلا بـ `css/style.css` و`js/app.js`). لا يوجد ما يحذفهما تلقائيًا من الـZIP؛ احذفهما يدويًا من المستودع أو اتركهما دون أثر.

## 7. Design System
متغيرات `:root` للألوان والخطوط (Amiri للعناوين، IBM Plex Sans Arabic للنص) والمسافات والـ container والـ z-index والانتقالات. لا inline styles في أي HTML. لا ذهبي لامع ولا تدرجات ولا Glassmorphism. البرونزي المطفأ للتمييز المحدود فقط.

## 8. Mobile Strategy
صورة Hero مقصوصة خصيصًا (4:5، رأس وصدر) بارتفاع أقصى 60% من الشاشة ليظهر الاسم في الشاشة الأولى؛ بوابة المسارات صفوف كبيرة متراصة؛ شريط سفلي (اتصل، واتساب، موعد، القائمة)؛ قائمة كاملة الشاشة؛ الخط الزمني بسكة عمودية.

## 9. Desktop Strategy
Hero منقسم: نص على اليمين وصورة عريضة تملأ الجانب الآخر حتى الحافة؛ بوابة المسارات شبكة 2×2 بخطوط فاصلة؛ خط زمني بتسمية جانبية؛ صفحة المقال بعمودين مع عمود جانبي لاصق. الهيدر الأفقي من 75rem، وما دونها يستخدم الشريط السفلي.

## 10. Content Architecture
كل المحتوى المتكرر في JSON. إضافة تخصص أو مقال أو فعالية = إضافة كائن في ملف JSON دون لمس HTML. حقول المقال تشمل حالة المراجعة وتاريخها والمصادر والمقالات والتخصصات المرتبطة.

## 11. SEO
title/description/canonical/OG/Twitter وlang/dir في كل صفحة؛ Person وLegalService (بلا عنوان) في الرئيسية؛ Article وBreadcrumbList تُحقن ديناميكيًا؛ sitemap وrobots وfavicon وmanifest.

## 12. Accessibility
رابط تخطي، labels لكل الحقول، focus ظاهر، أهداف لمس ≥ 44px، إغلاق القائمة بـ Esc، `aria-live` لنتائج البحث، احترام `prefers-reduced-motion`.

## 13. Performance
WebP مع JPG احتياطي بـ `picture`، `fetchpriority` وpreload لصورة Hero بحسب الجهاز، lazy لبقية الصور، بلا مكتبات، سكربت واحد `defer`.

## 14. Testing
انظر `FINAL_QA_REPORT.md`.

## 15. Known Placeholders
انظر `CONTENT_REVIEW_AND_PLACEHOLDERS.md`.

## 16. Known Limitations
- المحتوى يُرسم بـ JavaScript من JSON، ما قد يُبطئ فهرسة محركات البحث لصفحات المقال والتخصص مقارنة بـ HTML مولّد مسبقًا.
- `sitemap.xml` و`robots.txt` يحتاجان استبدال `[SITE_URL]`، ولا توجد صورة OG لأنها تتطلب رابطًا مطلقًا.
- لم تُختبر الخطوط الفعلية من Google Fonts داخل بيئة الاختبار (محجوبة)، فالتحقق تم بخطوط بديلة.
- لا يعمل الموقع من `file://` بسبب `fetch`.

## 17. Future Recommended Work
سكربت بناء اختياري يولّد صفحات HTML ثابتة للمقالات والتخصصات (لتحسين SEO)، صور جديدة حسب `IMAGE_REQUIREMENTS.md`، مراجعة قانونية للمقالات، إضافة عنوان المكتب وإحداثياته.
