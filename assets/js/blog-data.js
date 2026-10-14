/* ==========================================================
   Eat Easily — blog data (ایت مگ)
   ----------------------------------------------------------
   • The first 3 articles are REAL pages of the site. Their views / likes /
     words / minutes are placeholders — replace with real numbers.
   • Entries with demo:true are SAMPLE items so infinite scroll and filters
     can be previewed. They link to the category page. Delete them (or
     replace them with real articles) before going live.
   • After editing this file run:  node tools/build-blog.js
     (rewrites the crawlable HTML inside blog.html).
   Fields: id, title, desc, cat, sub, url, date (ISO), words (length),
   min (reading time, minutes), views (پربازدید), likes (محبوب), demo.
   ========================================================== */
(function (root) {
  'use strict';
  const data = {
  "cats": [
    {
      "id": "medical",
      "name": "پزشکی",
      "url": "https://eateasily.net/medical/",
      "tone": "peach"
    },
    {
      "id": "nutrition",
      "name": "تغذیه",
      "url": "https://eateasily.net/nutrition/",
      "tone": "mint"
    },
    {
      "id": "diets",
      "name": "رژیم‌ها",
      "url": "https://eateasily.net/diets/",
      "tone": "gold"
    },
    {
      "id": "psychology",
      "name": "روانشناسی",
      "url": "https://eateasily.net/psychology/",
      "tone": "blue"
    },
    {
      "id": "workout",
      "name": "ورزش",
      "url": "https://eateasily.net/workout/",
      "tone": "green"
    }
  ],
  "articles": [
    {
      "id": "complications",
      "title": "عوارض لاغری؛ شایع‌ترین مشکلات کاهش وزن و راه پیشگیری از آن‌ها",
      "desc": "ریزش مو، ضعف، یبوست و سنگ کیسه صفرا از شایع‌ترین عوارض لاغری سریع‌اند؛ علت هر کدام و راه پیشگیری را بخوانید.",
      "cat": "medical",
      "sub": "مراقبت‌های لاغری",
      "url": "https://eateasily.net/complications/",
      "date": "2026-10-04",
      "words": 1320,
      "min": 6,
      "views": 2140,
      "likes": 186,
      "demo": false
    },
    {
      "id": "weight-loss-drugs",
      "title": "داروهای لاغری",
      "desc": "نگاهی به داروهای لاغری، تفاوت آن‌ها با روش‌های اصولی و دلیل اینکه مصرف خودسرانه توصیه نمی‌شود.",
      "cat": "medical",
      "sub": "لاغری با پزشکی",
      "url": "https://eateasily.net/weight-loss-drugs/",
      "date": "2026-10-04",
      "words": 1680,
      "min": 8,
      "views": 3560,
      "likes": 241,
      "demo": false
    },
    {
      "id": "under-water-weighing",
      "title": "وزن‌کشی زیر آب چیست و چگونه باید آن را انجام دهیم؟",
      "desc": "وزن‌کشی زیر آب چه چیزی را اندازه می‌گیرد، چطور انجام می‌شود و چرا برای سنجش ترکیب بدن کاربرد دارد؟",
      "cat": "medical",
      "sub": "اندازه‌گیری",
      "url": "https://eateasily.net/under-water-weighing/",
      "date": "2026-09-18",
      "words": 1450,
      "min": 7,
      "views": 1870,
      "likes": 122,
      "demo": false
    },
    {
      "id": "demo-1",
      "title": "چاقی و دیابت نوع ۲؛ این دو چه ارتباطی با هم دارند؟",
      "desc": "نگاهی ساده به رابطه اضافه وزن با مقاومت به انسولین و راه‌های کاهش خطر.",
      "cat": "medical",
      "sub": "بیماری‌های چاقی",
      "url": "https://eateasily.net/medical/diseases/",
      "date": "2026-09-11",
      "words": 1700,
      "min": 8,
      "views": 1797,
      "likes": 36,
      "demo": true
    },
    {
      "id": "demo-2",
      "title": "کبد چرب و اضافه وزن؛ نشانه‌ها و پیشگیری",
      "desc": "کبد چرب چطور با اضافه وزن مرتبط است و برای پیشگیری از آن چه کارهایی مؤثر است؟",
      "cat": "medical",
      "sub": "بیماری‌های چاقی",
      "url": "https://eateasily.net/medical/diseases/",
      "date": "2026-09-01",
      "words": 900,
      "min": 4,
      "views": 565,
      "likes": 199,
      "demo": true
    },
    {
      "id": "demo-3",
      "title": "روش‌های پزشکی لاغری؛ از مشاوره تا پیگیری",
      "desc": "مسیر معمول لاغری زیر نظر پزشک چگونه است و در هر مرحله چه اتفاقی می‌افتد؟",
      "cat": "medical",
      "sub": "لاغری با پزشکی",
      "url": "https://eateasily.net/medical/treatment/",
      "date": "2026-08-29",
      "words": 2550,
      "min": 12,
      "views": 3906,
      "likes": 271,
      "demo": true
    },
    {
      "id": "demo-4",
      "title": "پوست بعد از لاغری؛ چطور از افتادگی پوست جلوگیری کنیم؟",
      "desc": "سرعت کاهش وزن، پروتئین و آب کافی چه نقشی در کشسانی پوست دارند؟",
      "cat": "medical",
      "sub": "مراقبت‌های لاغری",
      "url": "https://eateasily.net/medical/care/",
      "date": "2026-08-22",
      "words": 1350,
      "min": 6,
      "views": 532,
      "likes": 234,
      "demo": true
    },
    {
      "id": "demo-5",
      "title": "پیش‌غذای سبک برای کنترل اشتها؛ ۵ دستور ساده",
      "desc": "پنج پیش‌غذای سریع و کم‌حجم که قبل از وعده اصلی به کنترل اشتها کمک می‌کنند.",
      "cat": "nutrition",
      "sub": "دستور پخت",
      "url": "https://eateasily.net/nutrition/recipes/",
      "date": "2026-08-15",
      "words": 2000,
      "min": 9,
      "views": 1165,
      "likes": 58,
      "demo": true
    },
    {
      "id": "demo-6",
      "title": "سوپ سبزیجات رژیمی؛ دستور پخت قدم‌به‌قدم",
      "desc": "یک سوپ سبک و سیرکننده با مواد در دسترس، همراه با نکته‌های پخت و نگهداری.",
      "cat": "nutrition",
      "sub": "دستور پخت",
      "url": "https://eateasily.net/nutrition/recipes/",
      "date": "2026-08-05",
      "words": 2450,
      "min": 11,
      "views": 422,
      "likes": 301,
      "demo": true
    },
    {
      "id": "demo-7",
      "title": "پروتئین کافی در روز؛ چه منابعی انتخاب کنیم؟",
      "desc": "منابع پروتئین حیوانی و گیاهی را مقایسه می‌کنیم و می‌گوییم چطور در هر وعده بگنجانیم.",
      "cat": "nutrition",
      "sub": "مواد و خواص",
      "url": "https://eateasily.net/nutrition/foods-and-benefits/",
      "date": "2026-07-31",
      "words": 1050,
      "min": 5,
      "views": 2763,
      "likes": 310,
      "demo": true
    },
    {
      "id": "demo-8",
      "title": "سوپرفودها چه هستند و واقعاً چه خاصیتی دارند؟",
      "desc": "سوپرفود یعنی چه، کدام ادعاها پایه علمی دارند و چطور آن‌ها را در برنامه غذایی بیاوریم؟",
      "cat": "nutrition",
      "sub": "مواد و خواص",
      "url": "https://eateasily.net/nutrition/foods-and-benefits/",
      "date": "2026-07-21",
      "words": 850,
      "min": 4,
      "views": 2578,
      "likes": 215,
      "demo": true
    },
    {
      "id": "demo-9",
      "title": "کالری چیست و بدن چطور آن را می‌سوزاند؟",
      "desc": "تعریف ساده کالری، سوخت‌وساز پایه و عواملی که مصرف انرژی بدن را تغییر می‌دهند.",
      "cat": "nutrition",
      "sub": "مبانی علمی رژیم",
      "url": "https://eateasily.net/nutrition/science/",
      "date": "2026-07-17",
      "words": 850,
      "min": 4,
      "views": 370,
      "likes": 297,
      "demo": true
    },
    {
      "id": "demo-10",
      "title": "هورمون‌های گرسنگی و سیری؛ چرا گاهی سیر نمی‌شویم؟",
      "desc": "لپتین و گرلین چه کار می‌کنند و خواب و استرس چطور بر اشتها اثر می‌گذارند؟",
      "cat": "nutrition",
      "sub": "مبانی علمی رژیم",
      "url": "https://eateasily.net/nutrition/science/",
      "date": "2026-07-09",
      "words": 1100,
      "min": 5,
      "views": 1896,
      "likes": 85,
      "demo": true
    },
    {
      "id": "demo-11",
      "title": "برنامه غذایی هفتگی بدون گرسنگی؛ یک نمونه عملی",
      "desc": "نمونه‌ای از برنامه هفتگی با وعده‌های متنوع که بدون محرومیت قابل اجراست.",
      "cat": "diets",
      "sub": "برنامه‌های رژیم",
      "url": "https://eateasily.net/diets/diet-plans/",
      "date": "2026-07-04",
      "words": 2400,
      "min": 11,
      "views": 2518,
      "likes": 169,
      "demo": true
    },
    {
      "id": "demo-12",
      "title": "راهنمای شروع رژیم؛ قبل از هر چیز چه کار کنیم؟",
      "desc": "پیش از شروع هر برنامه کاهش وزن چه چیزهایی را بسنجیم و چه هدفی بگذاریم؟",
      "cat": "diets",
      "sub": "راهنمای رژیم",
      "url": "https://eateasily.net/diets/guides/",
      "date": "2026-06-26",
      "words": 2450,
      "min": 11,
      "views": 602,
      "likes": 309,
      "demo": true
    },
    {
      "id": "demo-13",
      "title": "استپ وزنی چیست و چطور از آن عبور کنیم؟",
      "desc": "چرا وزن بعد از مدتی ثابت می‌ماند و چه تغییرهای کوچکی دوباره آن را به حرکت درمی‌آورد؟",
      "cat": "diets",
      "sub": "راهنمای رژیم",
      "url": "https://eateasily.net/diets/guides/",
      "date": "2026-06-19",
      "words": 2500,
      "min": 11,
      "views": 1705,
      "likes": 61,
      "demo": true
    },
    {
      "id": "demo-14",
      "title": "مقایسه فستینگ و کالری‌شماری؛ مزایا و محدودیت‌ها",
      "desc": "دو روش پرطرفدار را کنار هم می‌گذاریم و نقاط قوت و ضعف هر کدام را مرور می‌کنیم.",
      "cat": "diets",
      "sub": "مقایسه رژیم‌ها",
      "url": "https://eateasily.net/diets/comparison/",
      "date": "2026-06-13",
      "words": 2450,
      "min": 11,
      "views": 2491,
      "likes": 42,
      "demo": true
    },
    {
      "id": "demo-15",
      "title": "رژیم‌های سخت چرا شکست می‌خورند؟",
      "desc": "دلیل رهاکردن رژیم‌های محدودکننده و بازگشت وزن چیست و جایگزین پایدارتر کدام است؟",
      "cat": "diets",
      "sub": "مقایسه رژیم‌ها",
      "url": "https://eateasily.net/diets/comparison/",
      "date": "2026-06-03",
      "words": 1350,
      "min": 6,
      "views": 2966,
      "likes": 284,
      "demo": true
    },
    {
      "id": "demo-16",
      "title": "پرخوری هیجانی؛ چرا زیر استرس بیشتر می‌خوریم؟",
      "desc": "رابطه استرس و غذا خوردن، و چند راهکار ساده برای شناخت و مدیریت آن.",
      "cat": "psychology",
      "sub": "روانشناسی رژیم",
      "url": "https://eateasily.net/psychology/diet-psychology/",
      "date": "2026-05-28",
      "words": 2050,
      "min": 9,
      "views": 2087,
      "likes": 311,
      "demo": true
    },
    {
      "id": "demo-17",
      "title": "انگیزه برای لاغری؛ چطور تا آخر مسیر بمانیم؟",
      "desc": "چطور هدف‌های کوچک و واقع‌بینانه بگذاریم تا انگیزه در طول مسیر حفظ شود؟",
      "cat": "psychology",
      "sub": "روانشناسی لاغری",
      "url": "https://eateasily.net/psychology/weight-loss-psychology/",
      "date": "2026-05-21",
      "words": 2150,
      "min": 10,
      "views": 1407,
      "likes": 139,
      "demo": true
    },
    {
      "id": "demo-18",
      "title": "تصویر بدن و اعتمادبه‌نفس در مسیر لاغری",
      "desc": "نگرش ما به بدن چطور بر تصمیم‌های غذایی اثر می‌گذارد و چطور آن را بهتر کنیم؟",
      "cat": "psychology",
      "sub": "روانشناسی لاغری",
      "url": "https://eateasily.net/psychology/weight-loss-psychology/",
      "date": "2026-05-15",
      "words": 1250,
      "min": 6,
      "views": 515,
      "likes": 306,
      "demo": true
    },
    {
      "id": "demo-19",
      "title": "ورزش برای افراد با اضافه وزن زیاد؛ از کجا شروع کنیم؟",
      "desc": "شروع تدریجی و کم‌فشار برای کسانی که سال‌ها تحرک کمی داشته‌اند.",
      "cat": "workout",
      "sub": "اهداف خاص",
      "url": "https://eateasily.net/workout/goals/",
      "date": "2026-05-05",
      "words": 1650,
      "min": 8,
      "views": 2207,
      "likes": 187,
      "demo": true
    },
    {
      "id": "demo-20",
      "title": "برنامه پیاده‌روی ۴ هفته‌ای برای شروع",
      "desc": "یک برنامه ساده و قابل‌افزایش که بدون تجهیزات و در هر سنی قابل انجام است.",
      "cat": "workout",
      "sub": "برنامه ورزشی",
      "url": "https://eateasily.net/workout/plans/",
      "date": "2026-04-30",
      "words": 2100,
      "min": 10,
      "views": 2674,
      "likes": 49,
      "demo": true
    },
    {
      "id": "demo-21",
      "title": "تمرین‌های مقاومتی سبک در خانه",
      "desc": "چند حرکت ساده با وزن بدن که به حفظ توده عضلانی در دوران لاغری کمک می‌کند.",
      "cat": "workout",
      "sub": "برنامه ورزشی",
      "url": "https://eateasily.net/workout/plans/",
      "date": "2026-04-21",
      "words": 1050,
      "min": 5,
      "views": 1892,
      "likes": 96,
      "demo": true
    }
  ]
};
  root.EE_BLOG = data;
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
})(typeof window !== 'undefined' ? window : globalThis);
