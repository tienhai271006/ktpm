import React from 'react';
import { PageShell, TableCard, Th, Td, Tr } from '@/components/layout/PageShell';
import { Badge, StatCard } from '@/components/common';

const DEMO = [
  { name:'Nguyễn Văn An', dept:'Kỹ thuật', checkin:'08:02', checkout:'17:30', total:'9.5h', status:'on-time' },
  { name:'Trần Thị Hoa', dept:'Marketing', checkin:'09:15', checkout:'18:00', total:'8.75h', status:'late' },
  { name:'Lê Minh Khoa', dept:'Sales', checkin:'07:45', checkout:'19:00', total:'11.25h', status:'overtime' },
  { name:'Phạm Thị Lan', dept:'Tài chính', checkin:'08:00', checkout:'17:00', total:'9h', status:'on-time' },
  { name:'Vũ Đình Nam', dept:'HR', checkin:'—', checkout:'—', total:'0', status:'absent' },
  { name:'Đặng Thị Mai', dept:'Kỹ thuật', checkin:'08:30', checkout:'17:30', total:'9h', status:'on-time' },
  { name:'Hoàng Văn Tú', dept:'Kỹ thuật', checkin:'07:50', checkout:'18:30', total:'10.5h', status:'overtime' },
];

const STATUS_PROPS: Record<string, { label:string; variant:'green'|'amber'|'red'|'blue' }> = {
  'on-time': { label:'Đúng giờ', variant:'green' },
  'late':    { label:'Đi muộn', variant:'amber' },
  'overtime':{ label:'Làm thêm', variant:'blue' },
  'absent':  { label:'Vắng mặt', variant:'red' },
};

export const AttendancePage: React.FC = () => {
  const onTime   = DEMO.filter(d => d.status==='on-time').length;
  const late     = DEMO.filter(d => d.status==='late').length;
  const absent   = DEMO.filter(d => d.status==='absent').length;
  const overtime = DEMO.filter(d => d.status==='overtime').length;

  return (
    <PageShell title="Chấm công — Hôm nay">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        <StatCard label="Đúng giờ" value={onTime} accentColor="#22c87a"/>
        <StatCard label="Đi muộn"  value={late}   accentColor="#f5a623"/>
        <StatCard label="Vắng mặt" value={absent} accentColor="#f25c5c"/>
        <StatCard label="Làm thêm" value={overtime} accentColor="#4f8ef7"/>
      </div>
      <TableCard>
        <thead><tr><Th>Nhân viên</Th><Th>Phòng ban</Th><Th>Vào làm</Th><Th>Ra về</Th><Th>Tổng giờ</Th><Th>Trạng thái</Th></tr></thead>
        <tbody>
          {DEMO.map(row => (
            <Tr key={row.name}>
              <Td><span style={{ fontWeight:500 }}>{row.name}</span></Td>
              <Td style={{ color:'#9ca3af' }}>{row.dept}</Td>
              <Td>{row.checkin}</Td>
              <Td>{row.checkout}</Td>
              <Td>{row.total}</Td>
              <Td><Badge variant={STATUS_PROPS[row.status].variant}>{STATUS_PROPS[row.status].label}</Badge></Td>
            </Tr>
          ))}
        </tbody>
      </TableCard>
      <div style={{ marginTop:12, fontSize:12, color:'#6b7280', textAlign:'center' }}>
        Chức năng chấm công đầy đủ sẽ được tích hợp với thiết bị chấm công vân tay / thẻ từ
      </div>
    </PageShell>
  );
};
