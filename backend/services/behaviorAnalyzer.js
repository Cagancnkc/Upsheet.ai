async function getProductBehaviorData(shopDomain, productIds, sb) {
  if (!shopDomain || !productIds?.length || !sb) return {};

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 14);

  const { data: events, error } = await sb
    .from('analytics_events')
    .select('event_type, product_id')
    .eq('shop_domain', shopDomain)
    .gte('created_at', sinceDate.toISOString())
    .in('product_id', productIds.map(String));

  if (error || !events?.length) return {};

  const behaviorMap = {};
  for (const e of events) {
    if (!e.product_id) continue;
    const b = behaviorMap[e.product_id] ||= { clicks: 0, addToCart: 0, pageViews: 0 };
    if (e.event_type === 'click') b.clicks++;
    else if (e.event_type === 'add_to_cart') b.addToCart++;
    else if (e.event_type === 'page_view') b.pageViews++;
  }

  for (const b of Object.values(behaviorMap)) {
    b.conversionRate = b.clicks > 0 ? Math.round((b.addToCart / b.clicks) * 100) : null;
    b.lowConversionSignal = b.clicks >= 10 && b.conversionRate !== null && b.conversionRate < 5;
  }

  return behaviorMap;
}

module.exports = { getProductBehaviorData };
