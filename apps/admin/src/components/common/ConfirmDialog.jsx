import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this administrative change?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
}) {
  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  const iconBg = isWarning ? '#FAD1C6' : '#FCEADE';
  const iconColor = '#DB5E8C';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {isDanger && <AlertCircle size={22} />}
          {isWarning && <AlertTriangle size={22} />}
          {!isDanger && !isWarning && <Info size={22} />}
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', color: '#171717', lineHeight: 1.5, fontWeight: 500 }}>
            {description}
          </p>
          {isDanger && (
            <p style={{ fontSize: '0.8rem', color: '#DB5E8C', marginTop: '0.5rem', fontWeight: 600 }}>
              Warning: This action will be permanently recorded in the administrative audit logs.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
