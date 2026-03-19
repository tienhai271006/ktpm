import React from 'react';
import { X } from 'lucide-react';
import { getInitials, getAvatarColor } from '@/utils';

// BADGE
type BV = 'green'|'amber'|'red'|'blue'|'purple'|'gray';
const bv: Record<BV, React.CSSProperties> = {
  green:  { background:'#ECFDF5', color:'#059669' },
  amber:  { background:'#FFFBEB', color:'#B45309' },
  red:    { background:'#FEF2F2', color:'#DC2626' },
  blue:   { background:'#EEF2FF', color:'#3B6EF8' },
  purple: { background:'#F5F3FF', color:'#7C3AED' },
  gray:   { background:'#F1F5F9', color:'#64748B' },
};
export const Badge: React.FC<{ children: React.ReactNode; variant?: BV }> = ({ children, variant='gray' }) => (
  <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:0.2, whiteSpace:'nowrap', ...bv[variant] }}>{children}</span>
);

// BUTTON
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?:'primary'|'outline'|'ghost'|'danger'; size?:'sm'|'md'; loading?:boolean; }
export const Button: React.FC<BtnProps> = ({ variant='primary', size='md', loading, children, disabled, style, ...rest }) => {
  const vs: Record<string, React.CSSProperties> = {
    primary: { background:'#3B6EF8', color:'#fff', border:'none', boxShadow:'0 1px 2px rgba(59,110,248,0.3)' },
    outline: { background:'#fff', border:'1px solid #E4E8F0', color:'#4A5568' },
    ghost:   { background:'transparent', border:'none', color:'#64748B' },
    danger:  { background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#DC2626' },
  };
  return (
    <button disabled={disabled||loading} style={{ display:'inline-flex', alignItems:'center', gap:6, borderRadius:8, fontFamily:'inherit', cursor:disabled||loading?'not-allowed':'pointer', transition:'all 0.15s', fontWeight:600, whiteSpace:'nowrap', padding:size==='sm'?'5px 12px':'8px 16px', fontSize:size==='sm'?12:13, opacity:disabled||loading?0.6:1, ...vs[variant], ...style }} {...rest}>
      {loading ? '...' : children}
    </button>
  );
};

// MODAL
export const Modal: React.FC<{ open:boolean; onClose:()=>void; title:string; children:React.ReactNode; width?:number }> = ({ open, onClose, title, children, width=560 }) => {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,22,35,0.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:16, width, maxWidth:'95vw', maxHeight:'88vh', overflowY:'auto', padding:28, boxShadow:'0 20px 60px rgba(15,22,35,0.18)', animation:'fadeUp 0.18s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:'#0F1623' }}>{title}</h2>
          <button onClick={onClose} style={{ background:'#F1F5F9', border:'none', cursor:'pointer', color:'#64748B', padding:6, borderRadius:8, display:'flex', alignItems:'center' }}><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// AVATAR
export const Avatar: React.FC<{ name:string; size?:number }> = ({ name, size=34 }) => {
  const { bg, color } = getAvatarColor(name);
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:size*0.36, flexShrink:0, border:'2px solid rgba(255,255,255,0.8)' }}>{getInitials(name)}</div>;
};

// STAT CARD
export const StatCard: React.FC<{ label:string; value:string|number; delta?:string; icon?:React.ReactNode; accentColor?:string }> = ({ label, value, delta, icon, accentColor='#3B6EF8' }) => (
  <div style={{ background:'#fff', border:'1px solid #E4E8F0', borderRadius:14, padding:'20px 22px', boxShadow:'0 1px 3px rgba(15,22,35,0.06)', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:0, left:0, width:4, bottom:0, background:accentColor, borderRadius:'14px 0 0 14px' }}/>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <div>
        <div style={{ fontSize:12, color:'#8896AD', fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginBottom:8 }}>{label}</div>
        <div style={{ fontSize:32, fontWeight:800, color:'#0F1623', fontFamily:"'Sora',sans-serif", lineHeight:1 }}>{value}</div>
        {delta && <div style={{ fontSize:12, color:'#12B76A', fontWeight:600, marginTop:6 }}>{delta}</div>}
      </div>
      {icon && <div style={{ width:44, height:44, borderRadius:12, background:`${accentColor}14`, display:'flex', alignItems:'center', justifyContent:'center', color:accentColor }}>{icon}</div>}
    </div>
  </div>
);

// FIELD
export const Field: React.FC<{ label:string; error?:string; children:React.ReactNode; full?:boolean }> = ({ label, error, children, full }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6, gridColumn:full?'1 / -1':undefined }}>
    <label style={{ fontSize:12, color:'#4A5568', fontWeight:600 }}>{label}</label>
    {children}
    {error && <span style={{ fontSize:11, color:'#DC2626' }}>{error}</span>}
  </div>
);

const inp: React.CSSProperties = { background:'#F8F9FC', border:'1px solid #E4E8F0', borderRadius:8, padding:'10px 14px', color:'#0F1623', fontFamily:'inherit', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box', transition:'border-color 0.15s' };
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (p) => <input {...p} style={{ ...inp, ...p.style }} onFocus={e=>e.target.style.borderColor='#3B6EF8'} onBlur={e=>e.target.style.borderColor='#E4E8F0'}/>;
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...p }) => <select {...p} style={{ ...inp, ...p.style }}>{children}</select>;
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (p) => <textarea {...p} style={{ ...inp, resize:'vertical', ...p.style }}/>;
export const Loading: React.FC<{ text?:string }> = ({ text='Đang tải...' }) => <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60, color:'#8896AD', fontSize:14, gap:8 }}>⏳ {text}</div>;
export const Empty: React.FC<{ text?:string }> = ({ text='Không có dữ liệu' }) => <div style={{ textAlign:'center', padding:48, color:'#8896AD', fontSize:14 }}>📭 {text}</div>;
