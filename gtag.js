/* Google Ads measurement for SDLC Experts.
   Loads only for visitors outside Europe (no consent banner on this site)
   and never when the browser sends a Global Privacy Control signal. */
(function () {
  var ID = 'AW-961364697';
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  var europe = /^(Europe|Arctic)\//.test(tz) ||
    /^Atlantic\/(Azores|Madeira|Canary|Reykjavik|Faroe|Faeroe)$/.test(tz);
  if (!tz || europe || navigator.globalPrivacyControl === true) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ID);
})();
