import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { Modal, Button } from '@/components/common';
import { CandidateForm } from '@/components/recruitment/RecruitmentForms';
import { usePipeline, useCreateCandidate, useMoveStage } from '@/hooks';
import { getInitials, getAvatarColor, formatDate } from '@/utils';
import { Candidate, CandidateStage, CreateCandidateDto } from '@/types';

const STAGES: {key:CandidateStage;label:string;color:string;bg:string;next?:CandidateStage;prev?:CandidateStage}[] = [
  {key:'applied',   label:'Đã nộp',    color:'#64748B', bg:'#F8FAFC', next:'screening'},
  {key:'screening', label:'Sàng lọc',  color:'#3B82F6', bg:'#EFF6FF', next:'interview', prev:'applied'},
  {key:'interview', label:'Phỏng vấn', color:'#F59E0B', bg:'#FFFBEB', next:'offer',     prev:'screening'},
  {key:'offer',     label:'Đề xuất',   color:'#10B981', bg:'#ECFDF5', next:'hired',     prev:'interview'},
];

const Av: React.FC<{name:string;size?:number}> = ({name,size=28}) => {
  const {bg,color} = getAvatarColor(name);
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.34,flexShrink:0}}>{getInitials(name)}</div>;
};

const KanbanCard: React.FC<{c:Candidate;onNext?:()=>void;onPrev?:()=>void}> = ({c,onNext,onPrev}) => (
  <div style={{background:'#fff',borderRadius:12,padding:14,boxShadow:'0 1px 3px rgba(16,24,40,0.08)',border:'1px solid #EAECF0',transition:'box-shadow 0.15s,transform 0.15s',cursor:'default'}}
    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 4px 12px rgba(16,24,40,0.12)';(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';}}
    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 1px 3px rgba(16,24,40,0.08)';(e.currentTarget as HTMLElement).style.transform='none';}}>
    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
      <Av name={c.full_name}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:700,color:'#101828',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.full_name}</div>
        <div style={{fontSize:11,color:'#98A2B3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.job_title||'—'}</div>
      </div>
      {c.score!=null && <span style={{fontSize:10,fontWeight:700,background:'#EEF2FF',color:'#3B6EF8',padding:'2px 7px',borderRadius:99}}>{c.score}</span>}
    </div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
      <span style={{fontSize:10,color:'#98A2B3'}}>{formatDate(c.applied_date)}</span>
      <div style={{display:'flex',gap:4}}>
        {onPrev && <button onClick={onPrev} style={{width:24,height:24,borderRadius:6,background:'#F9FAFB',border:'1px solid #EAECF0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#667085'}}><ChevronLeft size={12}/></button>}
        {onNext && <button onClick={onNext} style={{width:24,height:24,borderRadius:6,background:'#EEF2FF',border:'1px solid #BFDBFE',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#3B6EF8'}}><ChevronRight size={12}/></button>}
      </div>
    </div>
  </div>
);

export const PipelinePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {data:pipeline,isLoading} = usePipeline();
  const createMut = useCreateCandidate();
  const moveMut = useMoveStage();

  const handleCreate = async (dto: CreateCandidateDto) => {
    await createMut.mutateAsync(dto); setShowModal(false);
  };

  return (
    <div style={{padding:'24px 28px',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <div style={{fontSize:13,color:'#667085'}}>Kéo thả hoặc dùng nút mũi tên để chuyển giai đoạn</div>
        </div>
        <button onClick={()=>setShowModal(true)} style={{display:'flex',alignItems:'center',gap:6,background:'#101828',color:'#fff',border:'none',borderRadius:10,padding:'9px 16px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Plus size={15}/> Thêm ứng viên
        </button>
      </div>

      {isLoading ? (
        <div style={{textAlign:'center',padding:60,color:'#98A2B3'}}>Đang tải pipeline...</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          {STAGES.map(stage=>{
            const candidates = pipeline?.[stage.key]||[];
            return (
              <div key={stage.key}>
                {/* Column header */}
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,padding:'10px 14px',background:'#fff',borderRadius:10,border:`1px solid ${stage.color}30`,boxShadow:'0 1px 2px rgba(16,24,40,0.04)'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:stage.color,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:700,color:stage.color,flex:1}}>{stage.label}</span>
                  <span style={{fontSize:11,fontWeight:700,background:stage.bg,color:stage.color,padding:'2px 8px',borderRadius:99,border:`1px solid ${stage.color}30`}}>{candidates.length}</span>
                </div>
                {/* Cards */}
                <div style={{display:'flex',flexDirection:'column',gap:10,minHeight:200}}>
                  {candidates.map(c=>(
                    <KanbanCard key={c.id} c={c}
                      onNext={stage.next?()=>moveMut.mutate({id:c.id,stage:stage.next!}):undefined}
                      onPrev={stage.prev?()=>moveMut.mutate({id:c.id,stage:stage.prev!}):undefined}
                    />
                  ))}
                  {!candidates.length && (
                    <div style={{border:'2px dashed #E4E8F0',borderRadius:12,padding:'24px 16px',textAlign:'center',color:'#CBD5E1',fontSize:12}}>Không có ứng viên</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Thêm ứng viên mới" width={580}>
        <CandidateForm onSubmit={handleCreate} loading={createMut.isPending} onCancel={()=>setShowModal(false)}/>
      </Modal>
    </div>
  );
};
