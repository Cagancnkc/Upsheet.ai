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

  // Page view
  document.addEventListener('DOMContentLoaded', () => {
    send('page_view', {});
  });

  // Click tracking
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, [data-product-id]');
    if (!target) return;

    const productId = target.getAttribute('data-product-id') ||
                      target.closest('[data-product-id]')?.getAttribute('data-product-id') ||
                      null;

    send('click', {
      element_id: target.id || target.className,
      product_id: productId
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
})();
