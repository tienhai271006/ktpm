import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Briefcase, Award, ArrowRight, MoreHorizontal } from 'lucide-react';
import { useEmployeeStats, useCandidateStats, useCandidates, useEmployees } from '@/hooks';
import { formatCurrency, STAGE_LABEL, getInitials, getAvatarColor } from '@/utils';

const STAGE_COLOR: Record<string, string> = {
  applied:'#94A3B8', screening:'#3B82F6', interview:'#F59E0B', offer:'#10B981', hired:'#10B981', rejected:'#EF4444',
};

const Av: React.FC<{name:string;size?:number}> = ({name,size=38}) => {
  const {bg,color} = getAvatarColor(name);
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.35,flexShrink:0}}>{getInitials(name)}</div>;
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {data:es} = useEmployeeStats();
  const {data:cs} = useCandidateStats();
  const {data:emps} = useEmployees({limit:6,page:1});
  const {data:cands} = useCandidates({page:1});

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC',minHeight:'100vh'}}>
      {/* Top header strip */}
      <div style={{background:'#fff',borderBottom:'1px solid #EAECF0',padding:'18px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#101828',fontFamily:"'Sora',sans-serif"}}>Xin chào, {' '}<span style={{color:'#3B6EF8'}}>Admin</span> 👋</div>
          <div style={{fontSize:13,color:'#667085',marginTop:2}}>Đây là tổng quan hệ thống hôm nay</div>
        </div>
        <button onClick={()=>navigate('/employees')} style={{display:'flex',alignItems:'center',gap:6,background:'#3B6EF8',color:'#fff',border:'none',borderRadius:10,padding:'10px 18px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          + Thêm nhân viên
        </button>
      </div>

      <div style={{padding:'28px 32px'}}>
        {/* KPI row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
          {[
            {label:'Nhân viên',      val:es?.total||0,     sub:`+${es?.new_this_month||0} tháng này`,  icon:<Users size={20}/>,      color:'#3B6EF8',  bg:'#EEF2FF'},
            {label:'Đang làm',       val:es?.active||0,    sub:`${es?.on_leave||0} đang nghỉ phép`,   icon:<Award size={20}/>,      color:'#10B981',  bg:'#ECFDF5'},
            {label:'Ứng viên',       val:cs?.total||0,     sub:`+${cs?.new_this_week||0} tuần này`,   icon:<TrendingUp size={20}/>, color:'#F59E0B',  bg:'#FFFBEB'},
            {label:'Đề xuất offer',  val:cs?.offer||0,     sub:`${cs?.hired||0} đã tuyển`,            icon:<Briefcase size={20}/>,  color:'#8B5CF6',  bg:'#F5F3FF'},
          ].map(k=>(
            <div key={k.label} style={{background:'#fff',borderRadius:16,padding:'22px 24px',border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:k.bg,display:'flex',alignItems:'center',justifyContent:'center',color:k.color}}>{k.icon}</div>
                <MoreHorizontal size={16} color="#D0D5DD"/>
              </div>
              <div style={{fontSize:30,fontWeight:800,color:'#101828',fontFamily:"'Sora',sans-serif",lineHeight:1}}>{k.val}</div>
              <div style={{fontSize:12,color:'#667085',marginTop:6}}>{k.label}</div>
              <div style={{fontSize:11,color:k.color,fontWeight:600,marginTop:4}}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:20,marginBottom:20}}>
          {/* Employee list */}
          <div style={{background:'#fff',borderRadius:16,border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)',overflow:'hidden'}}>
            <div style={{padding:'18px 22px',borderBottom:'1px solid #F2F4F7',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:15,fontWeight:700,color:'#101828'}}>Nhân viên mới nhất</div>
              <button onClick={()=>navigate('/employees')} style={{display:'flex',alignItems:'center',gap:4,color:'#3B6EF8',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:600}}>Xem tất cả <ArrowRight size={14}/></button>
            </div>
            {!emps?.data.length ? (
              <div style={{padding:'40px',textAlign:'center',color:'#98A2B3',fontSize:13}}>Chưa có dữ liệu</div>
            ) : emps.data.slice(0,6).map((emp,i)=>(
              <div key={emp.id} onClick={()=>navigate('/employees')} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 22px',borderBottom:i<5?'1px solid #F9FAFB':'none',cursor:'pointer',transition:'background 0.12s'}}
                onMouseEnter={e=>(e.currentTarget.style.background='#F9FAFB')} onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                <Av name={emp.full_name}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#101828',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{emp.full_name}</div>
                  <div style={{fontSize:12,color:'#667085'}}>{emp.position}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:'#101828'}}>{formatCurrency(emp.salary)}</div>
                  <div style={{fontSize:11,color:'#98A2B3'}}>{emp.department_name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline mini */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)',padding:'18px 22px'}}>
              <div style={{fontSize:15,fontWeight:700,color:'#101828',marginBottom:16}}>Pipeline tuyển dụng</div>
              {[
                {label:'Đã nộp',    val:cs?.applied||0,   color:'#94A3B8'},
                {label:'Sàng lọc',  val:cs?.screening||0, color:'#3B82F6'},
                {label:'Phỏng vấn', val:cs?.interview||0, color:'#F59E0B'},
                {label:'Đề xuất',   val:cs?.offer||0,     color:'#10B981'},
              ].map(row=>{
                const total = Number(cs?.total)||1;
                const pct = Math.round((Number(row.val)/total)*100);
                return (
                  <div key={row.label} style={{marginBottom:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                      <span style={{fontSize:12,color:'#667085',fontWeight:500}}>{row.label}</span>
                      <span style={{fontSize:12,fontWeight:700,color:'#101828'}}>{row.val}</span>
                    </div>
                    <div style={{height:6,background:'#F2F4F7',borderRadius:99}}>
                      <div style={{height:6,background:row.color,borderRadius:99,width:`${pct}%`,transition:'width 0.5s ease'}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent candidates mini */}
            <div style={{background:'#fff',borderRadius:16,border:'1px solid #EAECF0',boxShadow:'0 1px 4px rgba(16,24,40,0.05)',overflow:'hidden',flex:1}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid #F2F4F7',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:14,fontWeight:700,color:'#101828'}}>Ứng viên gần đây</div>
                <button onClick={()=>navigate('/recruitment/candidates')} style={{color:'#3B6EF8',background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:600}}>Xem →</button>
              </div>
              {!cands?.data.length ? (
                <div style={{padding:24,textAlign:'center',color:'#98A2B3',fontSize:12}}>Chưa có dữ liệu</div>
              ) : cands.data.slice(0,4).map(c=>(
                <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderBottom:'1px solid #F9FAFB'}}>
                  <Av name={c.full_name} size={32}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:'#101828',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.full_name}</div>
                    <div style={{fontSize:11,color:'#98A2B3',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.job_title}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,background:STAGE_COLOR[c.stage]+'18',color:STAGE_COLOR[c.stage],whiteSpace:'nowrap'}}>{STAGE_LABEL[c.stage]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
