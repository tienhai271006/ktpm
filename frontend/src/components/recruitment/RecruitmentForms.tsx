import React from 'react';
import { useForm } from 'react-hook-form';
import { useDepartments, useJobs } from '@/hooks';
import { CreateCandidateDto, CreateJobDto } from '@/types';

const inp: React.CSSProperties = {
  width: '100%', background: '#F8F9FC', border: '1.5px solid #E4E8F0',
  borderRadius: 9, padding: '10px 14px', color: '#101828',
  fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const errStyle: React.CSSProperties = { fontSize: 11, color: '#EF4444', marginTop: 3 };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#4A5568', marginBottom: 5, display: 'block' };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

// ===== CANDIDATE FORM =====
interface CandidateFormProps { onSubmit:(d:CreateCandidateDto)=>void; loading?:boolean; onCancel:()=>void; defaultJobId?:string; }

export const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, loading, onCancel, defaultJobId }) => {
  const { data: jobs = [] } = useJobs({ status: 'open' });
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCandidateDto>({
    defaultValues: { full_name:'', email:'', phone:'', job_id:defaultJobId||'', experience_years:0, source:'LinkedIn', notes:'' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom:16 }}>
        <label style={label}>Họ và tên <span style={{color:'#EF4444'}}>*</span></label>
        <input style={inp} placeholder="Nguyễn Văn A" {...register('full_name', { required:'Vui lòng nhập họ tên' })}/>
        {errors.full_name && <p style={errStyle}>{errors.full_name.message}</p>}
      </div>

      <div style={{...grid2, marginBottom:16}}>
        <div>
          <label style={label}>Email <span style={{color:'#EF4444'}}>*</span></label>
          <input type="email" style={inp} placeholder="email@gmail.com" {...register('email', { required:'Vui lòng nhập email', pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'Email không hợp lệ'} })}/>
          {errors.email && <p style={errStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={label}>Số điện thoại <span style={{color:'#EF4444'}}>*</span></label>
          <input style={inp} placeholder="0912 345 678" {...register('phone', { required:'Vui lòng nhập SĐT' })}/>
          {errors.phone && <p style={errStyle}>{errors.phone.message}</p>}
        </div>
      </div>

      <div style={{...grid2, marginBottom:16}}>
        <div>
          <label style={label}>Vị trí ứng tuyển <span style={{color:'#EF4444'}}>*</span></label>
          <select style={{...inp,cursor:'pointer'}} {...register('job_id', { required:'Vui lòng chọn vị trí' })}>
            <option value="">-- Chọn vị trí --</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          {errors.job_id && <p style={errStyle}>{errors.job_id.message}</p>}
        </div>
        <div>
          <label style={label}>Kinh nghiệm (năm)</label>
          <input type="number" style={inp} placeholder="3" min="0" {...register('experience_years', { valueAsNumber:true })}/>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={label}>Nguồn tuyển dụng</label>
        <select style={{...inp,cursor:'pointer'}} {...register('source')}>
          <option value="LinkedIn">LinkedIn</option>
          <option value="TopCV">TopCV</option>
          <option value="JobStreet">JobStreet</option>
          <option value="Giới thiệu nội bộ">Giới thiệu nội bộ</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      <div style={{ marginBottom:24 }}>
        <label style={label}>Ghi chú</label>
        <textarea rows={3} style={{...inp,resize:'vertical'}} placeholder="Ghi chú về ứng viên..." {...register('notes')}/>
      </div>

      <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #F1F5F9'}}>
        <button type="button" onClick={onCancel} style={{padding:'9px 20px',borderRadius:9,background:'#fff',border:'1.5px solid #E4E8F0',color:'#667085',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>Hủy</button>
        <button type="submit" disabled={loading} style={{padding:'9px 24px',borderRadius:9,background:'#101828',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit',opacity:loading?0.7:1}}>
          {loading ? 'Đang lưu...' : 'Thêm ứng viên'}
        </button>
      </div>
    </form>
  );
};

// ===== JOB FORM =====
interface JobFormProps { onSubmit:(d:CreateJobDto)=>void; loading?:boolean; onCancel:()=>void; }

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, loading, onCancel }) => {
  const { data: depts = [] } = useDepartments();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateJobDto>({
    defaultValues: { title:'', department_id:'', headcount:1, job_type:'full-time' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom:16 }}>
        <label style={label}>Tên vị trí <span style={{color:'#EF4444'}}>*</span></label>
        <input style={inp} placeholder="Senior Frontend Developer" {...register('title', { required:'Vui lòng nhập tên vị trí' })}/>
        {errors.title && <p style={errStyle}>{errors.title.message}</p>}
      </div>

      <div style={{...grid2, marginBottom:16}}>
        <div>
          <label style={label}>Phòng ban <span style={{color:'#EF4444'}}>*</span></label>
          <select style={{...inp,cursor:'pointer'}} {...register('department_id', { required:'Vui lòng chọn phòng ban' })}>
            <option value="">-- Chọn phòng ban --</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.department_id && <p style={errStyle}>{errors.department_id.message}</p>}
        </div>
        <div>
          <label style={label}>Loại hình</label>
          <select style={{...inp,cursor:'pointer'}} {...register('job_type')}>
            <option value="full-time">Toàn thời gian</option>
            <option value="part-time">Bán thời gian</option>
            <option value="internship">Thực tập</option>
          </select>
        </div>
      </div>

      <div style={{...grid2, marginBottom:16}}>
        <div>
          <label style={label}>Số lượng tuyển</label>
          <input type="number" style={inp} min="1" placeholder="1" {...register('headcount', { valueAsNumber:true, min:1 })}/>
        </div>
        <div>
          <label style={label}>Hạn nộp hồ sơ</label>
          <input type="date" style={inp} {...register('deadline')}/>
        </div>
      </div>

      <div style={{...grid2, marginBottom:16}}>
        <div>
          <label style={label}>Lương từ (triệu)</label>
          <input type="number" style={inp} placeholder="20" {...register('salary_min', { valueAsNumber:true })}/>
        </div>
        <div>
          <label style={label}>Lương đến (triệu)</label>
          <input type="number" style={inp} placeholder="40" {...register('salary_max', { valueAsNumber:true })}/>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={label}>Mô tả công việc</label>
        <textarea rows={3} style={{...inp,resize:'vertical'}} placeholder="Mô tả yêu cầu..." {...register('description')}/>
      </div>

      <div style={{ marginBottom:24 }}>
        <label style={label}>Yêu cầu</label>
        <textarea rows={2} style={{...inp,resize:'vertical'}} placeholder="Kỹ năng cần có..." {...register('requirements')}/>
      </div>

      <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #F1F5F9'}}>
        <button type="button" onClick={onCancel} style={{padding:'9px 20px',borderRadius:9,background:'#fff',border:'1.5px solid #E4E8F0',color:'#667085',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>Hủy</button>
        <button type="submit" disabled={loading} style={{padding:'9px 24px',borderRadius:9,background:'#101828',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit',opacity:loading?0.7:1}}>
          {loading ? 'Đang lưu...' : 'Đăng vị trí'}
        </button>
      </div>
    </form>
  );
};
