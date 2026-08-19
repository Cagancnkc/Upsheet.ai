async function getProductBehaviorData(shopDomain, productIds, sb) {
  if (!shopDomain || !productIds?.length || !sb) return {};

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 14);

  const { data: events, error } = await sb
    .from('analytics_events')
    .select('event_type, product_id, session_id')
    .eq('shop_domain', shopDomain)
    .gte('created_at', sinceDate.toISOString())
    .in('product_id', productIds.map(String));

  if (error || !events?.length) return {};

  const behaviorMap = {};

  const purchaseSessions = new Set(
    events.filter(e => e.event_type === 'purchase' && e.session_id).map(e => e.session_id)
  );

  for (const e of events) {
    if (!e.product_id) continue;
    const b = behaviorMap[e.product_id] ||= {
      views: 0, clicks: 0, addToCart: 0,
      sessionsViewed: new Set(), sessionsClicked: new Set(), sessionsCarted: new Set(),
    };
    if (e.event_type === 'page_view') {
      b.views++;
      if (e.session_id) b.sessionsViewed.add(e.session_id);
    } else if (e.event_type === 'click') {
      b.clicks++;
      if (e.session_id) b.sessionsClicked.add(e.session_id);
    } else if (e.event_type === 'add_to_cart') {
      b.addToCart++;
      if (e.session_id) b.sessionsCarted.add(e.session_id);
    }
  }

  for (const [, b] of Object.entries(behaviorMap)) {
    b.clickThroughRate = b.sessionsViewed.size > 0
      ? Math.round((b.sessionsClicked.size / b.sessionsViewed.size) * 1000) / 10 : 0;

    b.addToCartRate = b.sessionsClicked.size > 0
      ? Math.round((b.sessionsCarted.size / b.sessionsClicked.size) * 1000) / 10 : 0;

    const cartedButNotPurchased = [...b.sessionsCarted].filter(sid => !purchaseSessions.has(sid));
    b.cartAbandonmentRate = b.sessionsCarted.size > 0
      ? Math.round((cartedButNotPurchased.length / b.sessionsCarted.size) * 1000) / 10 : 0;

    if (b.sessionsViewed.size >= 10 && b.clickThroughRate < 10) {
      b.diagnosedPattern = 'low_click_through';
    } else if (b.sessionsClicked.size >= 10 && b.addToCartRate < 10) {
      b.diagnosedPattern = 'low_cart_add';
    } else if (b.sessionsCarted.size >= 5 && b.cartAbandonmentRate > 70) {
      b.diagnosedPattern = 'high_cart_abandonment';
    } else {
      b.diagnosedPattern = null;
    }

    // pageViews korunuyor (mevcut sort mantığı için)
    b.pageViews = b.views;

    delete b.sessionsViewed;
    delete b.sessionsClicked;
    delete b.sessionsCarted;
  }

  return behaviorMap;
}

module.exports = { getProductBehaviorData };
