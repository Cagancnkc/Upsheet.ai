var MOCKSHEETS_PLANS = {
  free:     { name: 'Ücretsiz', commands_per_month: 20 },
  pro:      { name: 'Pro',      commands_per_month: 500 },
  business: { name: 'Business', commands_per_month: -1 }
};

function getUserPlan() {
  try { return JSON.parse(localStorage.getItem('mocksheets_plan'))?.plan || 'free'; }
  catch { return 'free'; }
}

function isPro() {
  var p = getUserPlan();
  return p === 'pro' || p === 'business';
}

function isBusiness() {
  return getUserPlan() === 'business';
}
