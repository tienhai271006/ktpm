import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Badge, StatCard } from '@/components/common';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '@/hooks';
import { formatCurrency } from '@/utils';
import { CreateDepartmentDto } from '@/types';

const inp: React.CSSProperties = { width:'100%', background:'#F8F9FC', border:'1.5px solid #E4E8F0', borderRadius:9, padding:'10px 14px', color:'#101828', fontFamily:'inherit', fontSize:14, outline:'none', boxSizing:'border-box' };
const lbl: React.CSSProperties = { fontSize:12, fontWeight:600, color:'#4A5568', marginBottom:5, display:'block' };

const DeptForm: React.FC<{onSubmit:(d:CreateDepartmentDto)=>void;loading?:boolean;onCancel:()=>void}> = ({onSubmit,loading,onCancel}) => {
  const {register,handleSubmit,formState:{errors}} = useForm<CreateDepartmentDto>({defaultValues:{name:'',description:'',budget:undefined}});
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{marginBottom:16}}>
        <label style={lbl}>Tên phòng ban <span style={{color:'#EF4444'}}>*</span></label>
        <input style={inp} placeholder="Phòng Kỹ thuật" {...register('name',{required:'Vui lòng nhập tên phòng ban'})}/>
        {errors.name && <p style={{fontSize:11,color:'#EF4444',marginTop:3}}>{errors.name.message}</p>}
      </div>
      <div style={{marginBottom:16}}>
        <label style={lbl}>Ngân sách (VNĐ)</label>
        <input type="number" style={inp} placeholder="500000000" {...register('budget',{valueAsNumber:true})}/>
      </div>
      <div style={{marginBottom:24}}>
        <label style={lbl}>Mô tả</label>
        <textarea rows={3} style={{...inp,resize:'vertical'}} placeholder="Chức năng phòng ban..." {...register('description')}/>
      </div>
      <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #F1F5F9'}}>
        <button type="button" onClick={onCancel} style={{padding:'9px 20px',borderRadius:9,background:'#fff',border:'1.5px solid #E4E8F0',color:'#667085',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>Hủy</button>
        <button type="submit" disabled={loading} style={{padding:'9px 24px',borderRadius:9,background:'#101828',color:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit',opacity:loading?0.7:1}}>
          {loading?'Đang lưu...':'Thêm phòng ban'}
        </button>
      </div>
    </form>
  );
};

export const DepartmentPage: React.FC = () => {
  const [showModal,setShowModal] = useState(false);
  const [deleteId,setDeleteId] = useState<string|null>(null);
  const {data:depts=[],isLoading} = useDepartments();
  const createMut = useCreateDepartment();
  const deleteMut = useDeleteDepartment();

  const total = depts.reduce((s,d)=>s+(d.employee_count||0),0);
  const budget = depts.reduce((s,d)=>s+(d.budget||0),0);

  const handleSubmit = async (dto:CreateDepartmentDto) => { await createMut.mutateAsync(dto); setShowModal(false); };

  return (
    <div style={{padding:'24px 28px',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <StatCard label="Tổng phòng ban" value={depts.length} accentColor="#3B6EF8"/>
        <StatCard label="Tổng nhân viên" value={total} accentColor="#10B981"/>
        <StatCard label="Tổng ngân sách" value={formatCurrency(budget)} accentColor="#8B5CF6"/>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,background:'#101828',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Plus size={15}/> Thêm phòng ban
        </button>
      </div>

      <div style={{background:'#fff',borderRadius:14,border:'1px solid #EAECF0',overflow:'hidden',boxShadow:'0 1px 4px rgba(16,24,40,0.05)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F9FAFB'}}>
              {['Phòng ban','Trưởng phòng','Nhân viên','Ngân sách','Mô tả',''].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'12px 18px',fontSize:11,color:'#667085',fontWeight:700,letterSpacing:0.8,textTransform:'uppercase',borderBottom:'1px solid #EAECF0'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Đang tải...</td></tr>
            ) : !depts.length ? (
              <tr><td colSpan={6} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Chưa có phòng ban nào</td></tr>
            ) : depts.map((d,i)=>(
              <tr key={d.id} style={{borderBottom:i<depts.length-1?'1px solid #F9FAFB':'none'}}>
                <td style={{padding:'14px 18px',fontWeight:700,color:'#101828'}}>{d.name}</td>
                <td style={{padding:'14px 18px',fontSize:13,color:'#667085'}}>{d.manager_name||'—'}</td>
                <td style={{padding:'14px 18px'}}>
                  <span style={{background:'#EEF2FF',color:'#3B6EF8',padding:'3px 10px',borderRadius:99,fontSize:12,fontWeight:700}}>{d.employee_count||0} người</span>
                </td>
                <td style={{padding:'14px 18px',fontSize:13,fontWeight:600,color:'#101828'}}>{formatCurrency(d.budget)}</td>
                <td style={{padding:'14px 18px',fontSize:12,color:'#98A2B3',maxWidth:200}}>{d.description||'—'}</td>
                <td style={{padding:'14px 18px'}}>
                  <button onClick={()=>setDeleteId(d.id)} style={{width:30,height:30,borderRadius:7,background:'#FEF2F2',border:'1px solid #FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444'}}>
                    <Trash2 size={13}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Thêm phòng ban mới" width={480}>
        <DeptForm onSubmit={handleSubmit} loading={createMut.isPending} onCancel={()=>setShowModal(false)}/>
      </Modal>
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Xác nhận xóa" width={400}>
        <p style={{color:'#667085',marginBottom:24,fontSize:14}}>Xóa phòng ban này? Nhân viên sẽ không bị xóa theo.</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <Button variant="outline" onClick={()=>setDeleteId(null)}>Hủy</Button>
          <Button variant="danger" loading={deleteMut.isPending} onClick={()=>deleteId&&deleteMut.mutateAsync(deleteId).then(()=>setDeleteId(null))}>Xóa</Button>
        </div>
      </Modal>
    </div>
  );
};
