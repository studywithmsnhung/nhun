/* ============================================================
   Hệ thống bài giảng — UX/JS chung
   - Active TOC highlight (scrollspy)
   - Mini-quiz click handler
   - Index search filter
   ============================================================ */
(function () {
  'use strict';

  // ---------- scrollspy for lesson TOC ----------
  function scrollSpy() {
    var links = document.querySelectorAll('.lesson-toc a[href^="#"]');
    if (!links.length) return;
    var idMap = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) idMap[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var id = e.target.id;
        if (!idMap[id]) return;
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          idMap[id].classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    Object.keys(idMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // ---------- quiz click ----------
  function bindQuizzes() {
    document.querySelectorAll('.quiz').forEach(function (q) {
      var fb = q.querySelector('.feedback');
      q.querySelectorAll('.opt').forEach(function (o) {
        o.addEventListener('click', function () {
          var correct = o.dataset.correct === '1';
          // reset siblings
          q.querySelectorAll('.opt').forEach(function (x) { x.classList.remove('correct','wrong'); });
          if (correct) {
            o.classList.add('correct');
            if (fb) { fb.textContent = o.dataset.explain || 'Chính xác!'; fb.className = 'feedback ok'; }
          } else {
            o.classList.add('wrong');
            // also highlight correct one softly
            var c = q.querySelector('.opt[data-correct="1"]');
            if (c) c.classList.add('correct');
            if (fb) { fb.textContent = o.dataset.explain || 'Chưa đúng. Đáp án đúng đã được tô xanh.'; fb.className = 'feedback no'; }
          }
        });
      });
    });
  }

  // ---------- index search ----------
  function bindSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var cards = document.querySelectorAll('.group-card');
    var noResult = document.getElementById('noResult');
    function norm(s) {
      // NFD tách dấu Việt thành combining marks (U+0300–U+036F) rồi strip,
      // giúp người gõ "thoi gian" match "thời gian", "ne" match "néng"…
      return (s || '').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    input.addEventListener('input', function () {
      var q = norm(input.value.trim());
      var anyVisible = false;
      cards.forEach(function (c) {
        // Search across BOTH data-search alias and the card's visible text
        // → user gõ "câu đặc biệt", "bị động", "le", "ba"… đều match.
        var hay = norm((c.dataset.search || '') + ' ' + (c.textContent || ''));
        var match = !q || hay.indexOf(q) !== -1;
        c.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      if (noResult) noResult.style.display = anyVisible ? 'none' : '';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    scrollSpy();
    bindQuizzes();
    bindSearch();
  });
})();
