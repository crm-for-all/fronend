import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  BarChart3, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { statsApi } from '../../api/stats';
import type { OverviewStats, TimeSeriesResponse, TimePeriod } from '../../types';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import './Dashboard.scss';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesResponse | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('last_7_days');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ov, ts] = await Promise.all([
        statsApi.getOverview(),
        statsApi.getTimeSeries(period)
      ]);
      setOverview(ov);
      setTimeSeries(ts);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalCustomers = overview?.by_status.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const withStatus = overview?.by_status.filter(s => s.status_id !== null).reduce((acc, curr) => acc + curr.count, 0) || 0;
  const withoutStatus = overview?.by_status.find(s => s.status_id === null)?.count || 0;

  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'last_3_days', label: t('last_3_days', 'Last 3 Days') },
    { value: 'last_7_days', label: t('last_7_days', 'Last 7 Days') },
    { value: 'last_12_days', label: t('last_12_days', 'Last 12 Days') },
    { value: 'last_3_months_weekly', label: t('last_3_months_weekly', 'Last 3 Months') },
    { value: 'last_12_months', label: t('last_12_months', 'Last 12 Months') },
  ];

  if (isLoading && !overview) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="dashboard-header">
        <div>
          <h1>{t('dashboard_title', 'Dashboard')}</h1>
          <p>{t('dashboard_subtitle_stats', 'Overview of your customer base and growth.')}</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {t('refresh', 'Refresh')}
        </Button>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">{t('total_customers', 'Total Customers')}</span>
            <span className="stat-card__value">{totalCustomers}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <UserCheck size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">{t('with_status', 'With Status')}</span>
            <span className="stat-card__value">{withStatus}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <UserMinus size={24} />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__label">{t('no_status', 'No Status')}</span>
            <span className="stat-card__value">{withoutStatus}</span>
          </div>
        </Card>
      </div>

      <div className="charts-main">
        <Card className="chart-container time-series-chart">
          <div className="chart-header">
            <div className="chart-title">
              <Calendar size={18} />
              <h3>{t('customer_growth', 'Customer Growth')}</h3>
            </div>
            <div className="period-toggles">
              {periods.map(p => (
                <button 
                  key={p.value}
                  className={period === p.value ? 'active' : ''}
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeries?.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-tertiary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-tertiary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  orientation="left"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px',
                    color: 'var(--color-primary)'
                  }}
                  itemStyle={{ color: 'var(--color-tertiary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--color-tertiary)" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="stats-breakdown">
        <Card className="breakdown-card">
          <div className="chart-title mb-6">
            <BarChart3 size={18} />
            <h3>{t('by_status_breakdown', 'By Status')}</h3>
          </div>
          <div className="breakdown-list">
            {overview?.by_status.map((item, idx) => (
              <div key={idx} className="breakdown-item">
                <div className="breakdown-item__info">
                  <span className="breakdown-item__name">
                    {item.status_name || t('no_status', 'No Status')}
                  </span>
                  <span className="breakdown-item__count">{item.count}</span>
                </div>
                <div className="breakdown-progress">
                  <div 
                    className="breakdown-progress__fill" 
                    style={{ 
                      width: `${(item.count / (totalCustomers || 1)) * 100}%`,
                      backgroundColor: 'var(--color-tertiary)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="breakdown-card">
          <div className="chart-title mb-6">
            <BarChart3 size={18} />
            <h3>{t('by_tag_breakdown', 'By Tag')}</h3>
          </div>
          <div className="tag-stats-grid">
            {overview?.by_tag.map((tag, idx) => (
              <div key={idx} className="tag-stat-pill">
                <span className="tag-stat-pill__name">{tag.tag_name}</span>
                <span className="tag-stat-pill__divider"></span>
                <span className="tag-stat-pill__count">{tag.count}</span>
              </div>
            ))}
            {(!overview?.by_tag || overview.by_tag.length === 0) && (
              <p className="no-data-msg">{t('no_tags_found', 'No tags found.')}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
