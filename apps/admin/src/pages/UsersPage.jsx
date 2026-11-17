import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { UserService } from '../services/userService';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  Trash2,
} from 'lucide-react';

export function UsersPage() {
  const { user: currentUser, isSuperAdmin } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Confirmation dialog state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: null,
    type: 'danger',
  });

  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    institutionId: '',
    phone: '',
    batch: '',
    targetCareer: '',
  });

  const loadUsers = async () => {
    const list = await UserService.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
    const handleStoreChange = () => loadUsers();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const institutions = StorageService.getInstitutions();

  // Suspend / Activate account action
  const handleToggleStatus = (targetUser) => {
    const isActivating = targetUser.status === 'SUSPENDED';
    const newStatus = isActivating ? 'ACTIVE' : 'SUSPENDED';

    setConfirmState({
      isOpen: true,
      title: isActivating ? 'Reactivate User Account' : 'Suspend User Account',
      description: `Are you sure you want to ${isActivating ? 'reactivate' : 'suspend'} access for ${targetUser.name} (${targetUser.email})?`,
      type: isActivating ? 'warning' : 'danger',
      action: async () => {
        await UserService.updateUserStatus(targetUser.id, newStatus);
        addToast(`User account for ${targetUser.name} is now ${newStatus}.`, 'success');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        loadUsers();
      },
    });
  };

  // Delete user
  const handleDeleteUser = (targetUser) => {
    if (!isSuperAdmin) {
      addToast('Only Super Administrators can permanently delete user accounts.', 'error');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Permanently Delete User',
      description: `Are you certain you want to permanently delete ${targetUser.name}? All linked assessment records and credentials will be removed.`,
      type: 'danger',
      action: async () => {
        await UserService.deleteUser(targetUser.id);
        addToast(`User ${targetUser.name} deleted.`, 'success');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        if (selectedUser?.id === targetUser.id) setDetailModalOpen(false);
        loadUsers();
      },
    });
  };

  // Create / Invite user form submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Name and email are required.', 'error');
      return;
    }

    // Role safety check
    if ((formData.role === 'SUPER_ADMIN' || formData.role === 'ADMIN') && !isSuperAdmin) {
      addToast('Only Super Administrators can provision administrative accounts.', 'error');
      return;
    }

    const inst = institutions.find(i => i.id === formData.institutionId);

    await UserService.createUser({
      ...formData,
      institutionName: inst ? inst.name : undefined,
    });

    addToast(`Successfully created account for ${formData.name}.`, 'success');
    setCreateModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'STUDENT',
      institutionId: '',
      phone: '',
      batch: '',
      targetCareer: '',
    });
    loadUsers();
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'danger';
      case 'ADMIN':
        return 'orange';
      case 'CENTRE_OWNER':
        return 'warning';
      case 'CENTRE_STAFF':
        return 'neutral';
      case 'STUDENT':
      default:
        return 'success';
    }
  };

  const columns = [
    {
      header: 'User Profile',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              backgroundColor: '#FCEADE',
              color: '#DB5E8C',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {row.avatar || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#171717' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#77736D' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Engagement',
      accessor: 'role',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Badge variant={getRoleBadgeVariant(row.role)}>
            {row.role.replace('_', ' ')}
          </Badge>
          {row.role === 'STUDENT' && (
            <span style={{ fontSize: '0.7rem', color: '#DB5E8C', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              🔥 7-Day Streak
            </span>
          )}
          {(row.role === 'CENTRE_STAFF' || row.role === 'CENTRE_OWNER') && (
            <span style={{ fontSize: '0.7rem', color: '#77736D', fontWeight: 600 }}>
              GMeet Mentor
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Affiliation / Institution',
      accessor: 'institutionName',
      render: (row) => (
        <span style={{ color: '#171717', fontWeight: 500 }}>
          {row.institutionName || 'ZHERO Central'}
        </span>
      ),
    },
    {
      header: 'Account Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={row.status === 'ACTIVE' ? 'success' : 'danger'}
          dot
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Joined Date',
      accessor: 'registeredAt',
      render: (row) => (
        <span style={{ color: '#77736D', fontSize: '0.8rem' }}>
          {row.registeredAt}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setSelectedUser(row);
              setDetailModalOpen(true);
            }}
            title="View Details"
            style={{
              border: '1px solid #FAD1C6',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: '#77736D',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
            }}
          >
            <Eye size={13} />
            <span>Details</span>
          </button>

          {row.id !== currentUser?.id && (
            <button
              onClick={() => handleToggleStatus(row)}
              title={row.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
              style={{
                border: '1px solid #FAD1C6',
                backgroundColor: row.status === 'ACTIVE' ? '#FCEADE' : '#FAD1C6',
                color: '#DB5E8C',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {row.status === 'ACTIVE' ? <UserX size={13} /> : <UserCheck size={13} />}
              <span>{row.status === 'ACTIVE' ? 'Suspend' : 'Activate'}</span>
            </button>
          )}

          {isSuperAdmin && row.id !== currentUser?.id && (
            <button
              onClick={() => handleDeleteUser(row)}
              title="Delete User"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#DB5E8C',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Management"
        description="Search, filter, and manage student, tuition centre, and administrator accounts."
        actions={
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => setCreateModalOpen(true)}
          >
            + Add User
          </Button>
        }
      />

      {/* Users Data Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name, email, or institution..."
          filterOptions={{
            key: 'role',
            label: 'Role',
            options: [
              { label: 'All Roles', value: 'ALL' },
              { label: 'Students', value: 'STUDENT' },
              { label: 'Centre Owners', value: 'CENTRE_OWNER' },
              { label: 'Centre Staff', value: 'CENTRE_STAFF' },
              { label: 'Platform Admins', value: 'ADMIN' },
              { label: 'Super Admins', value: 'SUPER_ADMIN' },
            ],
          }}
          itemsPerPage={8}
        />
      </div>

      {/* View User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`User Dossier: ${selectedUser.name}`}
          subtitle={`ID: ${selectedUser.id} • Registered: ${selectedUser.registeredAt}`}
          footer={
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedUser.id !== currentUser?.id && (
                  <Button
                    variant={selectedUser.status === 'ACTIVE' ? 'danger' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setDetailModalOpen(false);
                      handleToggleStatus(selectedUser);
                    }}
                  >
                    {selectedUser.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                  </Button>
                )}
              </div>
              <Button variant="secondary" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Identity */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#FCEADE',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#FAD1C6',
                  color: '#DB5E8C',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedUser.avatar || 'U'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>
                  {selectedUser.name}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '4px' }}>
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role.replace('_', ' ')}
                  </Badge>
                  <Badge variant={selectedUser.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.email}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Contact Phone</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.phone || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Tuition Institution</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.institutionName || 'ZHERO Central'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Last Session Timestamp</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.lastLogin || 'Never'}</span>
              </div>

              {selectedUser.role === 'STUDENT' && (
                <>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Enrolled Batch</span>
                    <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.batch || 'General Batch'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Target Career Aspiration</span>
                    <span style={{ fontWeight: 600, color: '#171717' }}>{selectedUser.targetCareer || 'Undecided'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Readiness Score</span>
                    <span style={{ fontWeight: 700, color: '#DB5E8C' }}>{selectedUser.readiness ?? 0}%</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Provision New User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision New User"
        subtitle="Create an authorized student, tuition staff, or platform operator account."
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="e.g. Sandra Mathews"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              className="admin-input"
              placeholder="sandra@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Role *
              </label>
              <select
                className="admin-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="CENTRE_OWNER">Tuition Centre Owner</option>
                <option value="CENTRE_STAFF">Tuition Centre Staff</option>
                <option value="ADMIN" disabled={!isSuperAdmin}>
                  Platform Admin {!isSuperAdmin ? '(Super Admin Only)' : ''}
                </option>
                <option value="SUPER_ADMIN" disabled={!isSuperAdmin}>
                  Super Admin {!isSuperAdmin ? '(Super Admin Only)' : ''}
                </option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Affiliation (Centre)
              </label>
              <select
                className="admin-input"
                value={formData.institutionId}
                onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
              >
                <option value="">ZHERO Central / Independent</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Contact Phone
            </label>
            <input
              type="tel"
              className="admin-input"
              placeholder="+91 98470 xxxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {formData.role === 'STUDENT' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Batch Tag
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="2026 Batch A"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Target Career
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. AI / ML Specialist"
                  value={formData.targetCareer}
                  onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create User Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Safeguard Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.action}
        title={confirmState.title}
        description={confirmState.description}
        type={confirmState.type}
      />
    </div>
  );
}
