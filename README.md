# موقع مكتب ميسرة خلاف — Static Site لـ GitHub Pages

Vanilla HTML/CSS/JS بلا Backend. كل البيانات القابلة للتعديل في مجلد `data/`.

## أين أعدّل؟
| ما تريد تغييره | الملف |
|---|---|
| الاسم، الصفة، الهاتف، واتساب، العنوان، الخريطة، الساعات، روابط التواصل | `data/site.json` |
| مجالات الممارسة | `data/specialties.json` |
| المقالات والأسئلة والأدلة | `data/articles.json` |
| الفعاليات | `data/events.json` |
| أقسام بوابة الزملاء | `data/colleagues.json` |
| صور المعرض | `data/gallery.json` |
| الألوان والخطوط والمسافات | أول `css/style.css` (`:root`) |

أي نص بين `[ ]` هو Placeholder يظهر بخلفية منقطة حتى تستبدله ببيانات معتمدة.

## ملاحظات تشغيل
- الصفحات تقرأ ملفات JSON بـ fetch، فلا تعمل بالنقر المزدوج على الملف (`file://`). شغّلها على GitHub Pages أو `python -m http.server`.
- كل المسارات نسبية، وتعمل تحت مسار فرعي (`username.github.io/repo/`).
- بعد النشر: استبدل `[SITE_URL]` في `sitemap.xml` و`robots.txt` بعنوان الموقع، وأضف قيمة `siteUrl` في `data/site.json`.
- ملفات `style.css` و`script.js` القديمة في الجذر استُبدلت بـ `css/style.css` و`js/app.js`، ويمكن حذف القديمة.
