import React, { useState } from 'react';
import { Plus, Search, Trash2, ChevronRight } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/common';
import { CandidateForm } from '@/components/recruitment/RecruitmentForms';
import { useCandidates, useCreateCandidate, useDeleteCandidate, useMoveStage, useJobs } from '@/hooks';
import { formatDate, STAGE_LABEL, getInitials, getAvatarColor } from '@/utils';
import { CreateCandidateDto, CandidateStage } from '@/types';

const STAGE_BADGE: Record<string,'gray'|'blue'|'amber'|'green'|'red'> = {
  applied:'gray',screening:'blue',interview:'amber',offer:'green',hired:'green',rejected:'red',
};
const STAGE_ORDER: CandidateStage[] = ['applied','screening','interview','offer','hired'];

const Av: React.FC<{name:string}> = ({name}) => {
  const {bg,color} = getAvatarColor(name);
  return <div style={{width:34,height:34,borderRadius:'50%',background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:11,flexShrink:0}}>{getInitials(name)}</div>;
};

export const CandidateListPage: React.FC = () => {
  const [stageFilter, setStageFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [page, setPage] = useState(1);

  const {data,isLoading} = useCandidates({stage:stageFilter||undefined,job_id:jobFilter||undefined,search:search||undefined,page});
  const {data:jobs=[]} = useJobs();
  const createMut = useCreateCandidate();
  const deleteMut = useDeleteCandidate();
  const moveMut = useMoveStage();

  const getNext = (cur: CandidateStage) => { const i=STAGE_ORDER.indexOf(cur); return i>=0&&i<STAGE_ORDER.length-1?STAGE_ORDER[i+1]:undefined; };

  return (
    <div style={{padding:'24px 28px',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      {/* Toolbar */}
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #EAECF0',borderRadius:10,padding:'8px 14px',flex:'1 1 180px',maxWidth:260,boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
          <Search size={14} color="#98A2B3"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm ứng viên..." style={{background:'none',border:'none',outline:'none',color:'#101828',fontFamily:'inherit',fontSize:13,width:'100%'}}/>
        </div>
        <select value={stageFilter} onChange={e=>{setStageFilter(e.target.value);setPage(1);}} style={{background:'#fff',border:'1px solid #EAECF0',borderRadius:9,padding:'8px 12px',fontSize:13,fontFamily:'inherit',outline:'none',color:'#4A5568',boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
          <option value="">Tất cả giai đoạn</option>
          {Object.entries(STAGE_LABEL).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
        <select value={jobFilter} onChange={e=>{setJobFilter(e.target.value);setPage(1);}} style={{background:'#fff',border:'1px solid #EAECF0',borderRadius:9,padding:'8px 12px',fontSize:13,fontFamily:'inherit',outline:'none',color:'#4A5568',boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
          <option value="">Tất cả vị trí</option>
          {jobs.map(j=><option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          {data && <span style={{fontSize:12,color:'#98A2B3',fontWeight:500}}>{data.pagination.total} ứng viên</span>}
          <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,background:'#101828',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Plus size={15}/> Thêm ứng viên
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{background:'#fff',borderRadius:14,border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F9FAFB'}}>
              {['Ứng viên','Vị trí','Ngày nộp','Kinh nghiệm','Nguồn','Điểm','Giai đoạn',''].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'12px 18px',fontSize:11,color:'#667085',fontWeight:700,letterSpacing:0.8,textTransform:'uppercase',borderBottom:'1px solid #EAECF0',whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Đang tải...</td></tr>
            ) : !data?.data.length ? (
              <tr><td colSpan={8} style={{padding:48,textAlign:'center',color:'#98A2B3',fontSize:13}}>Không tìm thấy ứng viên</td></tr>
            ) : data.data.map((c,i)=>{
              const next = getNext(c.stage);
              return (
                <tr key={c.id} style={{borderBottom:i<data.data.length-1?'1px solid #F9FAFB':'none',transition:'background 0.1s'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='#F9FAFB')} onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                  <td style={{padding:'13px 18px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <Av name={c.full_name}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#101828'}}>{c.full_name}</div>
                        <div style={{fontSize:11,color:'#98A2B3'}}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'13px 18px',fontSize:12,color:'#667085'}}>{c.job_title||'—'}</td>
                  <td style={{padding:'13px 18px',fontSize:12,color:'#667085'}}>{formatDate(c.applied_date)}</td>
                  <td style={{padding:'13px 18px',fontSize:13,color:'#101828',fontWeight:500}}>{c.experience_years} năm</td>
                  <td style={{padding:'13px 18px',fontSize:12,color:'#667085'}}>{c.source||'—'}</td>
                  <td style={{padding:'13px 18px'}}>
                    {c.score!=null ? <span style={{fontSize:12,fontWeight:700,background:'#EEF2FF',color:'#3B6EF8',padding:'3px 9px',borderRadius:99}}>{c.score}/100</span> : <span style={{color:'#CBD5E1'}}>—</span>}
                  </td>
                  <td style={{padding:'13px 18px'}}><Badge variant={STAGE_BADGE[c.stage]}>{STAGE_LABEL[c.stage]}</Badge></td>
                  <td style={{padding:'13px 18px'}}>
                    <div style={{display:'flex',gap:5}}>
                      {next && <button onClick={()=>moveMut.mutate({id:c.id,stage:next})} style={{display:'flex',alignItems:'center',gap:3,padding:'5px 9px',borderRadius:7,background:'#EEF2FF',border:'1px solid #BFDBFE',cursor:'pointer',color:'#3B6EF8',fontSize:11,fontWeight:600,fontFamily:'inherit',whiteSpace:'nowrap'}}>
                        <ChevronRight size={11}/>{STAGE_LABEL[next]}
                      </button>}
                      <button onClick={()=>setDeleteId(c.id)} style={{width:28,height:28,borderRadius:7,background:'#FEF2F2',border:'1px solid #FCA5A5',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444'}}><Trash2 size={11}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages>1 && (
        <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:18}}>
          {Array.from({length:data.pagination.totalPages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{width:34,height:34,borderRadius:8,border:'1px solid #EAECF0',background:page===p?'#101828':'#fff',color:page===p?'#fff':'#667085',cursor:'pointer',fontSize:13}}>{p}</button>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Thêm ứng viên mới" width={580}>
        <CandidateForm onSubmit={async (dto:CreateCandidateDto)=>{await createMut.mutateAsync(dto);setShowModal(false);}} loading={createMut.isPending} onCancel={()=>setShowModal(false)}/>
      </Modal>
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Xác nhận xóa" width={400}>
        <p style={{color:'#667085',marginBottom:24,fontSize:14}}>Xóa ứng viên này khỏi hệ thống?</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <Button variant="outline" onClick={()=>setDeleteId(null)}>Hủy</Button>
          <Button variant="danger" loading={deleteMut.isPending} onClick={()=>deleteId&&deleteMut.mutateAsync(deleteId).then(()=>setDeleteId(null))}>Xóa</Button>
        </div>
      </Modal>
    </div>
  );
};
