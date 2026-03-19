import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign } from 'lucide-react';
import { Employee } from '@/types';
import { Avatar, Badge } from '@/components/common';
import { formatDate, formatCurrency, STATUS_LABEL, CONTRACT_TYPE_LABEL } from '@/utils';

const STATUS_BADGE: Record<string, 'green' | 'amber' | 'red'> = {
  active: 'green', 'on-leave': 'amber', inactive: 'red',
};

interface Props {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <span style={{ color: '#6b7280', flexShrink: 0, marginTop: 2 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value || '—'}</div>
    </div>
  </div>
);

export const EmployeeDetailPanel: React.FC<Props> = ({ employee, onClose, onEdit }) => {
  if (!employee) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 140 }}/>
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, background: '#181c27', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 150, overflowY: 'auto', animation: 'slideInRight 0.2s ease' }}>
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <Avatar name={employee.full_name} size={56}/>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 }}><X size={18}/></button>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{employee.full_name}</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>{employee.position} · {employee.department_name || '—'}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant={STATUS_BADGE[employee.status]}>{STATUS_LABEL[employee.status]}</Badge>
            <Badge variant="blue">{CONTRACT_TYPE_LABEL[employee.contract_type]}</Badge>
            <span style={{ fontSize: 12, color: '#6b7280', background: '#1f2335', padding: '3px 10px', borderRadius: 20 }}>{employee.employee_code}</span>
          </div>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Liên hệ</div>
          <InfoRow icon={<Mail size={14}/>} label="Email" value={employee.email}/>
          <InfoRow icon={<Phone size={14}/>} label="Điện thoại" value={employee.phone}/>
          <InfoRow icon={<MapPin size={14}/>} label="Địa chỉ" value={employee.address || ''}/>
          <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1.5, margin: '20px 0 8px' }}>Công việc</div>
          <InfoRow icon={<Briefcase size={14}/>} label="Chức vụ" value={employee.position}/>
          <InfoRow icon={<Calendar size={14}/>} label="Ngày vào làm" value={formatDate(employee.join_date)}/>
          <InfoRow icon={<DollarSign size={14}/>} label="Hợp đồng" value={CONTRACT_TYPE_LABEL[employee.contract_type]}/>
          <div style={{ marginTop: 20, background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Lương tháng</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#4f8ef7' }}>{formatCurrency(employee.salary)}</div>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10 }}>
          <button onClick={() => onEdit(employee)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: '#4f8ef7', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit' }}>Chỉnh sửa</button>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 8, background: 'transparent', color: '#9ca3af', border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Đóng</button>
        </div>
      </div>
      <style>{'@keyframes slideInRight { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }'}</style>
    </>
  );
};
