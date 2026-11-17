/* Shared scripts for SDLC Experts inner pages: local-currency prices and the booking pop-up. */
/* Prices are set in NIS. Each market converts with one multiplier
   (local rate for comparable senior AI consulting / Israeli rate),
   then rounds UP: to the nearest 100 for amounts of 1,000+, to the nearest 10 below that. */
(function(){
  var MARKETS = {
    ILS: { factor: 1,    symbol: '\u20aa', vat: true,  note: 'Prices in NIS, before VAT.' },
    USD: { factor: 0.31, symbol: '$',      vat: false, note: 'Prices in USD.' },
    EUR: { factor: 0.25, symbol: '\u20ac', vat: false, note: 'Prices in EUR.' }
  };
  function roundUp(v){ var step = v >= 1000 ? 100 : 10; return Math.ceil(v / step - 1e-9) * step; }
  function detect(){
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
    if (tz === 'Asia/Jerusalem' || tz === 'Asia/Tel_Aviv') return 'ILS';
    if (tz.indexOf('Europe/') === 0) return 'EUR';
    return 'USD';
  }
  function apply(cur){
    var m = MARKETS[cur];
    document.querySelectorAll('[data-ils]').forEach(function(el){
      var base = Number(el.getAttribute('data-ils'));
      var v = cur === 'ILS' ? base : roundUp(base * m.factor);
      el.textContent = m.symbol + v.toLocaleString('en-US');
    });
    document.querySelectorAll('.vat').forEach(function(el){ el.hidden = !m.vat; });
    var note = document.getElementById('price-note'); if (note) note.textContent = m.note;
  }
  try { localStorage.removeItem('currency'); } catch(e){}
  apply(detect());
})();

/* Book-a-demo pop-up. Cal.com's embed loads only when someone clicks a booking link.
   A completed booking sends the visitor to /thanks/ (used for ad conversion tracking).
   If the pop-up can't load, the visitor goes to the regular cal.com booking page. */
(function(){
  var CAL_LINK = 'sdlc-experts/30min';
  var FULL_URL = 'https://cal.com/' + CAL_LINK;
  var ns = 'demo', ready = false;
  function loadCal(){
    if (window.Cal && window.Cal.ns && window.Cal.ns[ns]) return;
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", ns, { origin: "https://app.cal.com" });
    Cal.ns[ns]("ui", { layout: "month_view", hideEventTypeDetails: false });
    Cal.ns[ns]("on", { action: "linkReady", callback: function(){ ready = true; } });
    Cal.ns[ns]("on", { action: "bookingSuccessfulV2", callback: function(){
      setTimeout(function(){ window.location.href = '/thanks/'; }, 1500);
    }});
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="' + FULL_URL + '"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    loadCal();
    Cal.ns[ns]("modal", { calLink: CAL_LINK, config: { layout: "month_view" } });
    var started = Date.now();
    (function check(){
      if (ready || document.querySelector('cal-modal-box')) return;
      if (Date.now() - started > 6000) { window.open(FULL_URL, '_blank', 'noopener'); return; }
      setTimeout(check, 300);
    })();
  });
})();
