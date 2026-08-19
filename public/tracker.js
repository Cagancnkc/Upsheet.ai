/* Shopify Visitor Analytics Tracker */
(function() {
  'use strict';

  const ENDPOINT = (function() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('/tracker.js')) {
        return src.split('/tracker.js')[0] + '/api/analytics/track';
      }
    }
    return 'https://api.mocksheets.com/api/analytics/track';
  })();

  const shopDomain = window.Shopify?.shop || location.hostname;
  let sessionId = sessionStorage.getItem('ms_sid');
  if (!sessionId) {
    sessionId = 'sid_' + Math.random().toString(36).substr(2, 16);
    sessionStorage.setItem('ms_sid', sessionId);
  }

  var sessionStartTime = Date.now();

  function send(eventType, payload) {
    const data = {
      shop_domain: shopDomain,
      event_type: eventType,
      session_id: sessionId,
      page_url: location.href,
      ...payload
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {});
    }
  }

  function sendSessionDuration() {
    var durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
    if (durationSeconds < 1 || durationSeconds > 1800) return;
    send('session_duration', { duration_seconds: durationSeconds });
  }

  window.addEventListener('beforeunload', sendSessionDuration);
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') sendSessionDuration();
  });

  // Page view
  document.addEventListener('DOMContentLoaded', () => {
    send('page_view', {});
  });

  // Click tracking
  document.addEventListener('click', (e) => {
    const xPercent = Math.round((e.clientX / window.innerWidth) * 100);
    const yPercent = Math.round(((e.clientY + window.scrollY) / document.documentElement.scrollHeight) * 100);

    const target = e.target.closest('button, a, [data-product-id]');
    if (!target) return;

    const productId = target.getAttribute('data-product-id') ||
                      target.closest('[data-product-id]')?.getAttribute('data-product-id') ||
                      null;

    send('click', {
      element_id: target.id || target.className,
      product_id: productId,
      page_path: location.pathname,
      click_x_percent: xPercent,
      click_y_percent: yPercent,
    });
  }, true);

  // Scroll tracking — 25/50/75/100%
  let scrollMilestones = new Set();
  let lastScrollTime = 0;

  function trackScroll() {
    const now = Date.now();
    if (now - lastScrollTime < 500) return;
    lastScrollTime = now;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / docHeight) * 100);
    for (const milestone of [25, 50, 75, 100]) {
      if (scrollPercent >= milestone && !scrollMilestones.has(milestone)) {
        scrollMilestones.add(milestone);
        send('scroll', { scroll_depth: milestone });
      }
    }
  }

  window.addEventListener('scroll', trackScroll, { passive: true });

  // Add to cart tracking
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form');
    if (!form) return;

    const action = form.getAttribute('action') || '';
    if (action.includes('/cart/add')) {
      send('add_to_cart', {
        element_id: form.id || form.className
      });
    }
  }, true);

  // Screenshot capture — once per page per session
  var API_BASE = ENDPOINT.replace('/api/analytics/track', '');
  var screenshotKey = '_ms_ss_' + location.pathname;

  function captureAndUploadScreenshot() {
    if (sessionStorage.getItem(screenshotKey)) return;
    if (typeof html2canvas === 'undefined') {
      console.warn('[Mocksheets] html2canvas yüklenmedi');
      return;
    }

    setTimeout(function() {
      html2canvas(document.body, {
        scale: 0.5,
        useCORS: true,
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      }).then(function(canvas) {
        canvas.toBlob(function(blob) {
          if (!blob) return;
          var fd = new FormData();
          fd.append('screenshot', blob, 'screenshot.jpg');
          fd.append('shop_domain', shopDomain);
          fd.append('page_path', location.pathname);
          fd.append('page_width', document.documentElement.scrollWidth);
          fd.append('page_height', document.documentElement.scrollHeight);
          fetch(API_BASE + '/api/analytics/upload-screenshot', { method: 'POST', body: fd }).catch(function() {});
          sessionStorage.setItem(screenshotKey, '1');
        }, 'image/jpeg', 0.6);
      }).catch(function(err) {
        console.warn('[Mocksheets] Ekran görüntüsü alınamadı:', err);
      });
    }, 2000);
  }

  if (document.readyState === 'complete') {
    captureAndUploadScreenshot();
  } else {
    window.addEventListener('load', captureAndUploadScreenshot);
  }

  // Purchase / thank-you page detection
  if (window.location.pathname.includes('/thank_you') ||
      window.location.pathname.includes('/order-confirmation') ||
      (window.Shopify && window.Shopify.checkout)) {
    var orderTotal = (window.Shopify && window.Shopify.checkout)
      ? window.Shopify.checkout.total_price : null;
    send('purchase', { order_total: orderTotal });
  }
})();
