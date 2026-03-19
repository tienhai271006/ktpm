import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@hrm.vn');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { token, user } = await authService.login({ email, password });
      setAuth(token, user); navigate('/');
    } catch { toast.error('Email hoặc mật khẩu không đúng'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#EEF2FF 0%,#F4F6FA 50%,#F0F4FF 100%)', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:40 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#3B6EF8,#6B4EF8)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:20, fontFamily:"'Sora',sans-serif", boxShadow:'0 4px 14px rgba(59,110,248,0.35)' }}>H</div>
            <div>
              <div style={{ fontFamily:"'Sora',sans-serif", fontSize:20, fontWeight:800, color:'#0F1623' }}>HRM Pro</div>
              <div style={{ fontSize:11, color:'#8896AD', fontWeight:500 }}>Hệ thống quản lý nhân sự</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:28, fontWeight:800, color:'#0F1623', marginBottom:8 }}>Đăng nhập</h1>
          <p style={{ fontSize:14, color:'#8896AD', marginBottom:32 }}>Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A5568', marginBottom:7 }}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
                style={{ width:'100%', background:'#fff', border:'1.5px solid #E4E8F0', borderRadius:10, padding:'11px 16px', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#0F1623', transition:'border-color 0.15s' }}
                onFocus={e=>e.target.style.borderColor='#3B6EF8'} onBlur={e=>e.target.style.borderColor='#E4E8F0'}
              />
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#4A5568', marginBottom:7 }}>Mật khẩu</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required
                style={{ width:'100%', background:'#fff', border:'1.5px solid #E4E8F0', borderRadius:10, padding:'11px 16px', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#0F1623', transition:'border-color 0.15s' }}
                onFocus={e=>e.target.style.borderColor='#3B6EF8'} onBlur={e=>e.target.style.borderColor='#E4E8F0'}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#3B6EF8,#6B4EF8)', color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:14, fontWeight:700, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', opacity:loading?0.8:1, boxShadow:'0 4px 14px rgba(59,110,248,0.35)', transition:'all 0.15s' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </button>
          </form>

          <div style={{ marginTop:24, padding:'14px 16px', background:'#EEF2FF', borderRadius:10, fontSize:12, color:'#4A5568', display:'flex', gap:8, alignItems:'center' }}>
            <span>💡</span>
            <span><strong style={{ color:'#3B6EF8' }}>Demo:</strong> admin@hrm.vn · Admin@123</span>
          </div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div style={{ width:480, background:'linear-gradient(135deg,#3B6EF8 0%,#6B4EF8 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:48, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'relative', color:'#fff', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:20 }}>👥</div>
          <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:26, fontWeight:800, marginBottom:12 }}>Quản lý nhân sự toàn diện</h2>
          <p style={{ fontSize:14, opacity:0.8, lineHeight:1.7, maxWidth:320 }}>Hồ sơ nhân viên, tuyển dụng, chấm công — tất cả trong một nền tảng duy nhất.</p>
          <div style={{ display:'flex', gap:12, marginTop:32, justifyContent:'center', flexWrap:'wrap' }}>
            {['Hồ sơ nhân viên','Pipeline tuyển dụng','Chấm công','Báo cáo'].map(f => (
              <span key={f} style={{ background:'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600 }}>✓ {f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
