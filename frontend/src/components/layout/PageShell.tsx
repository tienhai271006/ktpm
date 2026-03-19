import React from 'react';
import { Search } from 'lucide-react';

interface PageShellProps { title:string; subtitle?:string; action?:React.ReactNode; children:React.ReactNode; search?:{ value:string; onChange:(v:string)=>void; placeholder?:string }; }
export const PageShell: React.FC<PageShellProps> = ({ title, subtitle, action, children, search }) => (
  <div style={{ minHeight:'100vh' }}>
    <div style={{ background:'#fff', borderBottom:'1px solid #E4E8F0', padding:'0 28px', height:64, display:'flex', alignItems:'center', gap:16, position:'sticky', top:0, zIndex:50 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:17, fontWeight:700, color:'#0F1623', fontFamily:"'Sora',sans-serif" }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:'#8896AD', marginTop:1 }}>{subtitle}</div>}
      </div>
      {search && (
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#F8F9FC', border:'1px solid #E4E8F0', borderRadius:9, padding:'7px 14px', width:220 }}>
          <Search size={14} color="#8896AD"/>
          <input value={search.value} onChange={e=>search.onChange(e.target.value)} placeholder={search.placeholder||'Tìm kiếm...'} style={{ background:'none', border:'none', outline:'none', color:'#0F1623', fontFamily:'inherit', fontSize:13, width:'100%' }}/>
        </div>
      )}
      {action}
    </div>
    <div style={{ padding:24 }}>{children}</div>
  </div>
);

export const TableCard: React.FC<{ children:React.ReactNode }> = ({ children }) => (
  <div style={{ background:'#fff', border:'1px solid #E4E8F0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 3px rgba(15,22,35,0.06)' }}>
    <table style={{ width:'100%', borderCollapse:'collapse' }}>{children}</table>
  </div>
);

export const Th: React.FC<{ children:React.ReactNode; style?:React.CSSProperties }> = ({ children, style }) => (
  <th style={{ textAlign:'left', padding:'11px 18px', fontSize:11, color:'#8896AD', letterSpacing:0.8, textTransform:'uppercase', fontWeight:700, borderBottom:'1px solid #F1F5F9', background:'#F8F9FC', whiteSpace:'nowrap', ...style }}>{children}</th>
);

export const Td: React.FC<{ children:React.ReactNode; style?:React.CSSProperties }> = ({ children, style }) => (
  <td style={{ padding:'13px 18px', fontSize:13, borderBottom:'1px solid #F8F9FC', color:'#0F1623', ...style }}>{children}</td>
);

export const Tr: React.FC<{ children:React.ReactNode; onClick?:()=>void }> = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ cursor:onClick?'pointer':'default', transition:'background 0.1s' }}
    onMouseEnter={e=>{ if(onClick)(e.currentTarget as HTMLElement).style.background='#F8F9FC'; }}
    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
    {children}
  </tr>
);

export const FilterRow: React.FC<{ children:React.ReactNode }> = ({ children }) => (
  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:16 }}>{children}</div>
);

export const FilterSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...p }) => (
  <select {...p} style={{ background:'#fff', border:'1px solid #E4E8F0', color:'#4A5568', borderRadius:8, padding:'7px 12px', fontSize:13, fontFamily:'inherit', outline:'none', cursor:'pointer', boxShadow:'0 1px 2px rgba(15,22,35,0.04)', ...p.style }}>{children}</select>
);
