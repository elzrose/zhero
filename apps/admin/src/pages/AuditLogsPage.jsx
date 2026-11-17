import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AuditService } from '../services/auditService';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { Download, Clock } from 'lucide-react';

export function AuditLogsPage() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    setLogs(AuditService.getLogs());
  };

  useEffect(() => {
    loadLogs();
    const handleStoreChange = () => loadLogs();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const handleExportLogs = () => {
    AnalyticsService.exportToCsv('ZHERO_Administrative_Audit_Trail', logs);
    addToast('Audit log records exported to CSV', 'success');
  };

  const getActionBadgeVariant = (action) => {
    if (action.includes('APPROVED')) return 'success';
    if (action.includes('REJECTED') || action.includes('DELETED') || action.includes('SUSPENDED')) return 'danger';
    if (action.includes('UPDATED') || action.includes('CONFIG')) return 'warning';
    return 'neutral';
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      width: '160px',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#77736D', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          {row.timestamp}
        </span>
      ),
    },
    {
      header: 'Administrator',
      accessor: 'admin',
      render: (row) => (
        <div style={{ fontWeight: 600, color: '#171717', fontSize: '0.85rem' }}>
          {row.admin}
        </div>
      ),
    },
    {
      header: 'Action Taken',
      accessor: 'action',
      render: (row) => (
        <Badge variant={getActionBadgeVariant(row.action)}>
          {row.action}
        </Badge>
      ),
    },
    {
      header: 'Target Entity',
      accessor: 'target',
      render: (row) => (
        <span style={{ fontWeight: 600, color: '#DB5E8C', fontSize: '0.85rem' }}>
          {row.target}
        </span>
      ),
    },
    {
      header: 'Event Details',
      accessor: 'details',
      render: (row) => (
        <span style={{ color: '#77736D', fontSize: '0.825rem' }}>
          {row.details}
        </span>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      align: 'right',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', color: '#9E9B95' }}>
          {row.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Audit Logs"
        description="Audit trail of centre approvals, status updates, role changes, and administrative actions."
        actions={
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleExportLogs}
          >
            Export Audit Logs (CSV)
          </Button>
        }
      />

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={logs}
          searchPlaceholder="Search audit events by admin, target, action, or details..."
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
