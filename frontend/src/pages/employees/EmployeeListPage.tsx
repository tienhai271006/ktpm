import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { Modal, Button, Field, Input, Select, Textarea, Badge } from '@/components/common';
import { FilterSelect } from '@/components/layout/PageShell';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { EmployeeDetailPanel } from '@/components/employees/EmployeeDetailPanel';
import { useEmployees, useDepartments, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks';
import { formatDate, formatCurrency, STATUS_LABEL, CONTRACT_TYPE_LABEL } from '@/utils';
import { Employee, CreateEmployeeDto, EmployeeFilter } from '@/types';
import { getInitials, getAvatarColor } from '@/utils';

const STATUS_BADGE: Record<string,'green'|'amber'|'red'> = { active:'green','on-leave':'amber',inactive:'red' };

const Av: React.FC<{name:string}> = ({name}) => {
  const {bg,color} = getAvatarColor(name);
  return <div style={{width:36,height:36,borderRadius:'50%',background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,flexShrink:0}}>{getInitials(name)}</div>;
};

export const EmployeeListPage: React.FC = () => {
  const [filter, setFilter] = useState<EmployeeFilter>({page:1,limit:20});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee|null>(null);
  const [viewing, setViewing] = useState<Employee|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const {data, isLoading} = useEmployees({...filter, search:search||undefined});
  const {data:depts=[]} = useDepartments();
  const createMut = useCreateEmployee();
  const updateMut = useUpdateEmployee();
  const deleteMut = useDeleteEmployee();

  const handleSubmit = async (dto: CreateEmployeeDto) => {
    if (editing) await updateMut.mutateAsync({id:editing.id,dto});
    else await createMut.mutateAsync(dto);
    setShowModal(false); setEditing(null);
  };

  return (
    <div style={{padding:'24px 28px',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      {/* Toolbar */}
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #EAECF0',borderRadius:10,padding:'8px 14px',flex:'1 1 200px',maxWidth:300,boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
          <Search size={14} color="#98A2B3"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm nhân viên..." style={{background:'none',border:'none',outline:'none',color:'#101828',fontFamily:'inherit',fontSize:13,width:'100%'}}/>
        </div>
        <FilterSelect value={filter.department_id||''} onChange={e=>setFilter(f=>({...f,department_id:e.target.value||undefined}))}>
          <option value="">Tất cả phòng ban</option>
          {depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </FilterSelect>
        <FilterSelect value={filter.status||''} onChange={e=>setFilter(f=>({...f,status:(e.target.value||undefined) as EmployeeFilter['status']}))}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang làm</option>
          <option value="on-leave">Nghỉ phép</option>
          <option value="inactive">Nghỉ việc</option>
        </FilterSelect>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {data && <span style={{fontSize:12,color:'#98A2B3',fontWeight:500}}>{data.pagination.total} nhân viên</span>}
          <button onClick={()=>{setEditing(null);setShowModal(true);}} style={{display:'flex',alignItems:'center',gap:6,background:'#101828',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Plus size={15}/> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{background:'#fff',borderRadius:14,border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F9FAFB'}}>
              {['Nhân viên','Phòng ban','Chức vụ','Hợp đồng','Ngày vào','Lương','Trạng thái',''].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'12px 18px',fontSize:11,color:'#667085',fontWeight:700,letterSpacing:0.8,textTransform:'uppercase',borderBottom:'1px solid #EAECF0',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Đang tải...</td></tr>
            ) : !data?.data.length ? (
              <tr><td colSpan={8} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Không tìm thấy nhân viên nào</td></tr>
            ) : data.data.map((emp,i)=>(
              <tr key={emp.id} style={{borderBottom:i<data.data.length-1?'1px solid #F9FAFB':'none',transition:'background 0.1s'}}
                onMouseEnter={e=>(e.currentTarget.style.background='#F9FAFB')} onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                <td style={{padding:'14px 18px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <Av name={emp.full_name}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'#101828'}}>{emp.full_name}</div>
                      <div style={{fontSize:11,color:'#98A2B3'}}>{emp.employee_code}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'14px 18px',fontSize:13,color:'#667085'}}>{emp.department_name||'—'}</td>
                <td style={{padding:'14px 18px',fontSize:13,color:'#101828',fontWeight:500}}>{emp.position}</td>
                <td style={{padding:'14px 18px'}}><Badge variant="blue">{CONTRACT_TYPE_LABEL[emp.contract_type]}</Badge></td>
                <td style={{padding:'14px 18px',fontSize:12,color:'#667085'}}>{formatDate(emp.join_date)}</td>
                <td style={{padding:'14px 18px',fontSize:13,fontWeight:600,color:'#101828'}}>{formatCurrency(emp.salary)}</td>
                <td style={{padding:'14px 18px'}}><Badge variant={STATUS_BADGE[emp.status]}>{STATUS_LABEL[emp.status]}</Badge></td>
                <td style={{padding:'14px 18px'}}>
                  <div style={{display:'flex',gap:4}}>
                    <button onClick={()=>setViewing(emp)} style={{width:30,height:30,borderRadius:7,background:'#F7F8FC',border:'1px solid #EAECF0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#667085'}}><Eye size={13}/></button>
                    <button onClick={()=>{setEditing(emp);setShowModal(true);}} style={{width:30,height:30,borderRadius:7,background:'#F7F8FC',border:'1px solid #EAECF0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#667085'}}><Pencil size={13}/></button>
                    <button onClick={()=>setDeleteId(emp.id)} style={{width:30,height:30,borderRadius:7,background:'#FEF2F2',border:'1px solid #FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444'}}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages>1 && (
        <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:20}}>
          {Array.from({length:data.pagination.totalPages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setFilter(f=>({...f,page:p}))} style={{width:34,height:34,borderRadius:8,border:'1px solid #EAECF0',background:filter.page===p?'#101828':'#fff',color:filter.page===p?'#fff':'#667085',cursor:'pointer',fontSize:13,fontWeight:500}}>{p}</button>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={showModal} onClose={()=>{setShowModal(false);setEditing(null);}} title={editing?'Chỉnh sửa nhân viên':'Thêm nhân viên mới'} width={620}>
        <EmployeeForm initial={editing||undefined} onSubmit={handleSubmit} loading={createMut.isPending||updateMut.isPending} onCancel={()=>{setShowModal(false);setEditing(null);}}/>
      </Modal>

      {/* View detail panel */}
      <EmployeeDetailPanel employee={viewing} onClose={()=>setViewing(null)} onEdit={emp=>{setViewing(null);setEditing(emp);setShowModal(true);}}/>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Xác nhận xóa" width={400}>
        <p style={{color:'#667085',marginBottom:24,fontSize:14}}>Bạn có chắc muốn xóa nhân viên này? Hành động này không thể hoàn tác.</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <Button variant="outline" onClick={()=>setDeleteId(null)}>Hủy</Button>
          <Button variant="danger" loading={deleteMut.isPending} onClick={()=>deleteId&&deleteMut.mutateAsync(deleteId).then(()=>setDeleteId(null))}>Xóa nhân viên</Button>
        </div>
      </Modal>
    </div>
  );
};
