'use strict';

const PLANS = {
  free: {
    name: 'Başlangıç',
    displayName: 'Ücretsiz',
    ai_commands_per_month: 20,
    ai_commands_per_day: 5,
    max_rows: 10000,
    max_file_size_mb: 2,
    max_sheets: 1,
    integrations: true,
    auto_report: false,
    competitor_analysis: false,
    accounting_formulas: false,
    export_formats: ['csv'],
    support: 'none',
    color: '#6B7280',
    badge: '🆓'
  },
  pro: {
    name: 'Pro',
    displayName: 'Pro',
    ai_commands_per_month: 200,
    ai_commands_per_day: 30,
    max_rows: 100000,
    max_file_size_mb: 10,
    max_sheets: 10,
    integrations: true,
    auto_report: true,
    competitor_analysis: true,
    accounting_formulas: true,
    export_formats: ['csv', 'xlsx', 'json'],
    support: 'email',
    color: '#4F46E5',
    badge: '⭐'
  },
  promax: {
    name: 'Pro Max',
    displayName: 'Pro Max',
    ai_commands_per_month: 1500,
    ai_commands_per_day: 100,
    max_rows: 100000,
    max_file_size_mb: 50,
    max_sheets: 50,
    integrations: true,
    auto_report: true,
    competitor_analysis: true,
    accounting_formulas: true,
    export_formats: ['csv', 'xlsx', 'json', 'pdf'],
    support: 'priority',
    color: '#059669',
    badge: '⭐'
  },
  business: {
    name: 'İş',
    displayName: 'İş Planı',
    ai_commands_per_month: Infinity,
    ai_commands_per_day: Infinity,
    max_rows: 100000,
    max_file_size_mb: 50,
    max_sheets: 100,
    integrations: true,
    auto_report: true,
    competitor_analysis: true,
    accounting_formulas: true,
    export_formats: ['csv', 'xlsx', 'json', 'pdf'],
    support: 'priority',
    color: '#059669',
    badge: '🏢'
  }
};

module.exports = PLANS;
