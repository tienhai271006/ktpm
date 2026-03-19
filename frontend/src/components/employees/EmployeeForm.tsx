import React from 'react';
import { useForm } from 'react-hook-form';
import { useDepartments } from '@/hooks';
import { CreateEmployeeDto, Employee } from '@/types';

interface Props {
  initial?: Partial<Employee>;
  onSubmit: (data: CreateEmployeeDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

const inp: React.CSSProperties = {
  width: '100%', background: '#F8F9FC', border: '1.5px solid #E4E8F0',
  borderRadius: 9, padding: '10px 14px', color: '#101828',
  fontFamily: 'inherit', fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

const errStyle: React.CSSProperties = { fontSize: 11, color: '#EF4444', marginTop: 3 };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#4A5568', marginBottom: 5, display: 'block' };

export const EmployeeForm: React.FC<Props> = ({ initial, onSubmit, loading, onCancel }) => {
  const { data: depts = [] } = useDepartments();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEmployeeDto>({
    defaultValues: {
      full_name:     initial?.full_name     || '',
      email:         initial?.email         || '',
      phone:         initial?.phone         || '',
      department_id: initial?.department_id || '',
      position:      initial?.position      || '',
      contract_type: initial?.contract_type || 'full-time',
      salary:        initial?.salary        || 0,
      join_date:     initial?.join_date     ? String(initial.join_date).slice(0, 10) : '',
      address:       initial?.address       || '',
    },
  });

  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Full name - full width */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Họ và tên <span style={{ color: '#EF4444' }}>*</span></label>
        <input
          style={inp}
          placeholder="Nguyễn Văn A"
          {...register('full_name', { required: 'Vui lòng nhập họ tên', minLength: { value: 2, message: 'Tối thiểu 2 ký tự' } })}
        />
        {errors.full_name && <p style={errStyle}>{errors.full_name.message}</p>}
      </div>

      <div style={{ ...grid2, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Email <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            type="email"
            style={inp}
            placeholder="email@company.com"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
            })}
          />
          {errors.email && <p style={errStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Số điện thoại <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            style={inp}
            placeholder="0912 345 678"
            {...register('phone', { required: 'Vui lòng nhập SĐT' })}
          />
          {errors.phone && <p style={errStyle}>{errors.phone.message}</p>}
        </div>
      </div>

      <div style={{ ...grid2, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Phòng ban <span style={{ color: '#EF4444' }}>*</span></label>
          <select
            style={{ ...inp, cursor: 'pointer' }}
            {...register('department_id', { required: 'Vui lòng chọn phòng ban' })}
          >
            <option value="">-- Chọn phòng ban --</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.department_id && <p style={errStyle}>{errors.department_id.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Chức vụ <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            style={inp}
            placeholder="Senior Developer"
            {...register('position', { required: 'Vui lòng nhập chức vụ' })}
          />
          {errors.position && <p style={errStyle}>{errors.position.message}</p>}
        </div>
      </div>

      <div style={{ ...grid2, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Loại hợp đồng</label>
          <select style={{ ...inp, cursor: 'pointer' }} {...register('contract_type')}>
            <option value="full-time">Toàn thời gian</option>
            <option value="part-time">Bán thời gian</option>
            <option value="probation">Thử việc</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Lương (VNĐ) <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            type="number"
            style={inp}
            placeholder="25000000"
            {...register('salary', {
              required: 'Vui lòng nhập lương',
              valueAsNumber: true,
              min: { value: 0, message: 'Lương không hợp lệ' },
            })}
          />
          {errors.salary && <p style={errStyle}>{errors.salary.message}</p>}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Ngày vào làm <span style={{ color: '#EF4444' }}>*</span></label>
        <input
          type="date"
          style={{ ...inp, width: '50%' }}
          {...register('join_date', { required: 'Vui lòng chọn ngày vào làm' })}
        />
        {errors.join_date && <p style={errStyle}>{errors.join_date.message}</p>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Địa chỉ</label>
        <textarea
          rows={2}
          style={{ ...inp, resize: 'vertical' }}
          placeholder="Địa chỉ thường trú"
          {...register('address')}
        />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
        <button type="button" onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 9, background: '#fff', border: '1.5px solid #E4E8F0', color: '#667085', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          Hủy
        </button>
        <button type="submit" disabled={loading} style={{ padding: '9px 24px', borderRadius: 9, background: '#101828', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Thêm nhân viên'}
        </button>
      </div>
    </form>
  );
};
