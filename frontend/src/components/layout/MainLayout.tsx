import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Clock, Target, Briefcase, ClipboardList, LogOut, Settings, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials, getAvatarColor } from '@/utils';

const MENU = [
  { group:'Menu', items:[
    { to:'/',           label:'Dashboard',      icon:LayoutDashboard, end:true  },
  ]},
  { group:'Nhân viên', items:[
    { to:'/employees',   label:'Hồ sơ nhân viên',icon:Users,       end:false },
    { to:'/departments', label:'Phòng ban',       icon:Building2,   end:false },
    { to:'/attendance',  label:'Chấm công',       icon:Clock,       end:false },
  ]},
  { group:'Tuyển dụng', items:[
    { to:'/recruitment/pipeline',   label:'Pipeline',         icon:Target,        end:false },
    { to:'/recruitment/jobs',       label:'Vị trí tuyển dụng',icon:Briefcase,     end:false },
    { to:'/recruitment/candidates', label:'Ứng viên',         icon:ClipboardList, end:false },
  ]},
];

const Av: React.FC<{name:string;size?:number}> = ({name,size=36}) => {
  const {bg,color} = getAvatarColor(name);
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.34,flexShrink:0}}>{getInitials(name)}</div>;
};

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Page title from route
  const titles: Record<string,string> = {
    '/':'Dashboard', '/employees':'Hồ sơ nhân viên', '/departments':'Phòng ban',
    '/attendance':'Chấm công', '/recruitment/pipeline':'Pipeline tuyển dụng',
    '/recruitment/jobs':'Vị trí tuyển dụng', '/recruitment/candidates':'Ứng viên',
  };
  const pageTitle = titles[location.pathname] || 'HRM Pro';

  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#F7F8FC'}}>
      {/* Sidebar */}
      <aside style={{width:240,background:'#101828',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,height:'100%',zIndex:100}}>
        {/* Logo */}
        <div style={{padding:'22px 20px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#3B6EF8,#6B4EF8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:17,fontFamily:"'Sora',sans-serif",flexShrink:0}}>H</div>
            <div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:800,color:'#fff',letterSpacing:-0.3}}>HRM Pro</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',fontWeight:500,letterSpacing:0.8,textTransform:'uppercase'}}>v2.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,overflowY:'auto',padding:'14px 12px'}}>
          {MENU.map(g=>(
            <div key={g.group} style={{marginBottom:6}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.25)',fontWeight:700,letterSpacing:1.2,textTransform:'uppercase',padding:'6px 8px 4px',marginBottom:2}}>{g.group}</div>
              {g.items.map(item=>(
                <NavLink key={item.to} to={item.to} end={item.end} style={({isActive})=>({
                  display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:8,
                  textDecoration:'none',fontSize:13,fontWeight:500,marginBottom:1,
                  color: isActive?'#fff':'rgba(255,255,255,0.5)',
                  background: isActive?'rgba(59,110,248,0.9)':'transparent',
                  transition:'all 0.12s',
                })}>
                  <item.icon size={16} strokeWidth={1.8}/>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{padding:'12px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 8px',borderRadius:10,background:'rgba(255,255,255,0.05)'}}>
            <Av name={user?.full_name||'Admin'} size={34}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.full_name}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',textTransform:'capitalize'}}>{user?.role}</div>
            </div>
            <button onClick={()=>{logout();navigate('/login');}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',padding:4,display:'flex',alignItems:'center',borderRadius:6,flexShrink:0}} title="Đăng xuất">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{marginLeft:240,flex:1,display:'flex',flexDirection:'column'}}>
        {/* Top bar */}
        <div style={{height:58,background:'#fff',borderBottom:'1px solid #EAECF0',display:'flex',alignItems:'center',padding:'0 28px',gap:16,position:'sticky',top:0,zIndex:50}}>
          <div style={{flex:1,fontSize:16,fontWeight:700,color:'#101828',fontFamily:"'Sora',sans-serif"}}>{pageTitle}</div>
          <button style={{width:36,height:36,borderRadius:9,background:'#F7F8FC',border:'1px solid #EAECF0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#667085'}}><Bell size={16}/></button>
          <button style={{width:36,height:36,borderRadius:9,background:'#F7F8FC',border:'1px solid #EAECF0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#667085'}}><Settings size={16}/></button>
          <Av name={user?.full_name||'Admin'} size={34}/>
        </div>
        <div style={{flex:1}}><Outlet/></div>
      </div>
    </div>
  );
};
