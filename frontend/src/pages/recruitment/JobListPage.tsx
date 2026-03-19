import React, { useState } from 'react';
import { Plus, Trash2, Users, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal, Button, Badge, StatCard } from '@/components/common';
import { JobForm } from '@/components/recruitment/RecruitmentForms';
import { useJobs, useCreateJob, useDeleteJob, useUpdateJob } from '@/hooks';
import { formatDate, JOB_TYPE_LABEL } from '@/utils';
import { CreateJobDto, JobPosition } from '@/types';

const STATUS_MAP: Record<string,{label:string;variant:'green'|'amber'|'red'}> = {
  open:{label:'Đang mở',variant:'green'}, paused:{label:'Tạm dừng',variant:'amber'}, closed:{label:'Đã đóng',variant:'red'},
};

export const JobListPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const {data:jobs=[],isLoading} = useJobs({status:statusFilter||undefined});
  const createMut = useCreateJob();
  const deleteMut = useDeleteJob();
  const updateMut = useUpdateJob();

  const handleCreate = async (dto: CreateJobDto) => { await createMut.mutateAsync(dto); setShowModal(false); };

  return (
    <div style={{padding:'24px 28px',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <StatCard label="Vị trí đang mở"  value={jobs.filter(j=>j.status==='open').length} accentColor="#10B981"/>
        <StatCard label="Tổng vị trí"      value={jobs.length} accentColor="#3B6EF8"/>
        <StatCard label="Tổng ứng viên"    value={jobs.reduce((s,j)=>s+(j.candidate_count||0),0)} accentColor="#F59E0B"/>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:18}}>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{background:'#fff',border:'1px solid #EAECF0',borderRadius:9,padding:'8px 12px',fontSize:13,fontFamily:'inherit',outline:'none',color:'#4A5568',boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
          <option value="">Tất cả trạng thái</option>
          <option value="open">Đang mở</option>
          <option value="paused">Tạm dừng</option>
          <option value="closed">Đã đóng</option>
        </select>
        <div style={{marginLeft:'auto'}}>
          <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,background:'#101828',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Plus size={15}/> Đăng vị trí
          </button>
        </div>
      </div>

      {/* Cards grid */}
      {isLoading ? <div style={{textAlign:'center',padding:60,color:'#98A2B3'}}>Đang tải...</div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {jobs.map(job=>{
            const pct = Math.min(100,Math.round(((job.candidate_count||0)/Math.max(1,job.headcount))*100));
            const sm = STATUS_MAP[job.status];
            return (
              <div key={job.id} style={{background:'#fff',borderRadius:14,border:'1px solid #EAECF0',padding:20,boxShadow:'0 1px 4px rgba(16,24,40,0.05)',transition:'box-shadow 0.15s'}}
                onMouseEnter={e=>(e.currentTarget.style.boxShadow='0 4px 16px rgba(16,24,40,0.10)')} onMouseLeave={e=>(e.currentTarget.style.boxShadow='0 1px 4px rgba(16,24,40,0.05)')}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <div style={{flex:1,paddingRight:8}}>
                    <div style={{fontSize:14,fontWeight:700,color:'#101828',marginBottom:3}}>{job.title}</div>
                    <div style={{fontSize:12,color:'#98A2B3'}}>🏢 {job.department_name||'—'}</div>
                  </div>
                  <Badge variant={sm.variant}>{sm.label}</Badge>
                </div>

                <div style={{display:'flex',gap:16,marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#667085'}}>
                    <Users size={12}/> {job.candidate_count||0}/{job.headcount}
                  </div>
                  {job.deadline && <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'#667085'}}>
                    <Clock size={12}/> {formatDate(job.deadline)}
                  </div>}
                  <div style={{fontSize:12,color:'#667085'}}>{JOB_TYPE_LABEL[job.job_type]}</div>
                </div>

                {job.salary_min && job.salary_max && (
                  <div style={{fontSize:12,color:'#667085',marginBottom:12}}>💰 {(job.salary_min/1e6).toFixed(0)}–{(job.salary_max/1e6).toFixed(0)} triệu/tháng</div>
                )}

                <div style={{marginBottom:14}}>
                  <div style={{height:5,background:'#F2F4F7',borderRadius:99}}>
                    <div style={{height:5,borderRadius:99,background:job.status==='open'?'#10B981':'#94A3B8',width:`${pct}%`,transition:'width 0.4s'}}/>
                  </div>
                  <div style={{fontSize:10,color:'#98A2B3',marginTop:4}}>{pct}% chỉ tiêu</div>
                </div>

                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>updateMut.mutate({id:job.id,dto:{status:job.status==='open'?'closed':'open'}})} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'7px',borderRadius:8,border:'1px solid #EAECF0',background:'#F9FAFB',cursor:'pointer',fontSize:12,color:'#667085',fontFamily:'inherit',fontWeight:500}}>
                    {job.status==='open'?<ToggleRight size={14} color="#10B981"/>:<ToggleLeft size={14}/>}
                    {job.status==='open'?'Đóng vị trí':'Mở lại'}
                  </button>
                  <button onClick={()=>setDeleteId(job.id)} style={{width:34,height:34,borderRadius:8,background:'#FEF2F2',border:'1px solid #FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444'}}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add card */}
          <div onClick={()=>setShowModal(true)} style={{border:'2px dashed #EAECF0',borderRadius:14,padding:20,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer',minHeight:200,color:'#CBD5E1',transition:'all 0.15s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#3B6EF8';(e.currentTarget as HTMLElement).style.color='#3B6EF8';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='#EAECF0';(e.currentTarget as HTMLElement).style.color='#CBD5E1';}}>
            <Plus size={28}/><span style={{fontSize:13,fontWeight:600}}>Đăng vị trí mới</span>
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Đăng vị trí tuyển dụng" width={620}>
        <JobForm onSubmit={handleCreate} loading={createMut.isPending} onCancel={()=>setShowModal(false)}/>
      </Modal>
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Xác nhận xóa" width={400}>
        <p style={{color:'#667085',marginBottom:24,fontSize:14}}>Xóa vị trí này? Tất cả ứng viên liên quan cũng sẽ bị xóa.</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <Button variant="outline" onClick={()=>setDeleteId(null)}>Hủy</Button>
          <Button variant="danger" loading={deleteMut.isPending} onClick={()=>deleteId&&deleteMut.mutateAsync(deleteId).then(()=>setDeleteId(null))}>Xóa</Button>
        </div>
      </Modal>
    </div>
  );
};
