import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import './AdminPage.css'

const money = (value) => value == null || value === '' ? 'Chưa cập nhật' : new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ'
const dateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—'
const emptyVehicle = { name:'', slug:'', category:'SUV', badge:'', short_description:'', description:'', image_url:'', versions:'', seats:'', engine:'', transmission:'', drivetrain:'', is_active:true, sort_order:0 }
const emptyPrice = { vehicle_id:'', version_name:'', model_year:new Date().getFullYear(), list_price:'', promotion_price:'', effective_from:'', effective_to:'', notes:'', is_active:true }

function Login({ onLogin }) {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError(error.message)
    else onLogin()
  }
  return <div className="hf-login-wrap"><form className="hf-login" onSubmit={submit}>
    <div className="hf-mark">H</div><p className="hf-kicker">HOÀNG FORD AUTO</p><h1>Đăng nhập quản trị</h1>
    <p className="hf-muted">Đăng nhập bằng tài khoản đã được cấp quyền quản trị.</p>
    <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username" required /></label>
    <label>Mật khẩu<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required /></label>
    {error && <div className="hf-error">{error}</div>}
    <button className="hf-btn hf-btn-primary" disabled={busy}>{busy?'Đang đăng nhập…':'Đăng nhập'}</button>
    <a className="hf-back-link" href="/">← Quay lại website</a>
  </form></div>
}

function Modal({ title, onClose, children }) {
  return <div className="hf-modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <section className="hf-modal"><div className="hf-modal-head"><h2>{title}</h2><button className="hf-icon-btn" onClick={onClose}>×</button></div>{children}</section>
  </div>
}

export default function AdminPage() {
  const [session,setSession] = useState(null)
  const [authReady,setAuthReady] = useState(false)
  const [authorized,setAuthorized] = useState(false)
  const [tab,setTab] = useState('overview')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [vehicles,setVehicles] = useState([])
  const [prices,setPrices] = useState([])
  const [leads,setLeads] = useState([])
  const [appointments,setAppointments] = useState([])
  const [vehicleModal,setVehicleModal] = useState(null)
  const [priceModal,setPriceModal] = useState(null)
  const [search,setSearch] = useState('')

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }
    supabase.auth.getSession().then(({data}) => { setSession(data.session); setAuthReady(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event,nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  const loadAll = useCallback(async () => {
    if (!supabase || !session?.user) return
    setLoading(true); setError('')
    const [profileResult, vehicleResult, priceResult, leadResult, appointmentResult] = await Promise.all([
      supabase.from('profiles').select('role,full_name').eq('id',session.user.id).single(),
      supabase.from('vehicles').select('*').order('sort_order').order('name'),
      supabase.from('vehicle_prices').select('*, vehicles(name)').order('created_at',{ascending:false}),
      supabase.from('customer_leads').select('*').order('created_at',{ascending:false}),
      supabase.from('test_drive_appointments').select('*').order('scheduled_at',{ascending:true}),
    ])
    if (profileResult.error || profileResult.data?.role !== 'admin') {
      setAuthorized(false); setError('Tài khoản đã đăng nhập chưa được cấp quyền admin. Hãy kiểm tra mục phân quyền trong hướng dẫn cài đặt.');
    } else {
      setAuthorized(true)
      if (vehicleResult.error) setError(vehicleResult.error.message)
      setVehicles(vehicleResult.data || [])
      setPrices(priceResult.data || [])
      setLeads(leadResult.data || [])
      setAppointments(appointmentResult.data || [])
    }
    setLoading(false)
  },[session])

  useEffect(() => { if (session) loadAll(); else setAuthorized(false) },[session,loadAll])

  const filteredVehicles = useMemo(() => vehicles.filter(v => `${v.name} ${v.category}`.toLowerCase().includes(search.toLowerCase())),[vehicles,search])
  const newLeads = leads.filter(x=>x.status==='Mới').length
  const pendingAppointments = appointments.filter(x=>x.status==='Chờ xác nhận').length

  async function logout() { await supabase.auth.signOut(); setSession(null); setAuthorized(false) }
  async function saveVehicle(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    const row = {
      name:f.get('name').trim(), slug:f.get('slug').trim().toLowerCase(), category:f.get('category'), badge:f.get('badge'),
      short_description:f.get('short_description'), description:f.get('description'), image_url:f.get('image_url'),
      versions:String(f.get('versions')||'').split(',').map(x=>x.trim()).filter(Boolean), seats:f.get('seats'), engine:f.get('engine'),
      transmission:f.get('transmission'), drivetrain:f.get('drivetrain'), is_active:f.get('is_active')==='on', sort_order:Number(f.get('sort_order')||0)
    }
    const query = vehicleModal.id ? supabase.from('vehicles').update(row).eq('id',vehicleModal.id) : supabase.from('vehicles').insert(row)
    const {error} = await query
    if (error) return setError(error.message)
    setVehicleModal(null); await loadAll()
  }
  async function deleteVehicle(vehicle) {
    if (!confirm(`Xóa ${vehicle.name}? Các bảng giá liên quan cũng sẽ bị xóa.`)) return
    const {error} = await supabase.from('vehicles').delete().eq('id',vehicle.id)
    if (error) setError(error.message); else await loadAll()
  }
  async function savePrice(e) {
    e.preventDefault(); const f=new FormData(e.currentTarget)
    const row={vehicle_id:f.get('vehicle_id'),version_name:f.get('version_name').trim(),model_year:f.get('model_year')?Number(f.get('model_year')):null,
      list_price:f.get('list_price')?Number(f.get('list_price')):null,promotion_price:f.get('promotion_price')?Number(f.get('promotion_price')):null,
      effective_from:f.get('effective_from')||null,effective_to:f.get('effective_to')||null,notes:f.get('notes'),is_active:f.get('is_active')==='on'}
    const query=priceModal.id?supabase.from('vehicle_prices').update(row).eq('id',priceModal.id):supabase.from('vehicle_prices').insert(row)
    const {error}=await query
    if(error)return setError(error.message)
    setPriceModal(null);await loadAll()
  }
  async function deletePrice(price) {
    if (!confirm(`Xóa bảng giá ${price.version_name}?`)) return
    const {error}=await supabase.from('vehicle_prices').delete().eq('id',price.id)
    if(error)setError(error.message);else await loadAll()
  }
  async function updateStatus(table,id,status) {
    const {error}=await supabase.from(table).update({status}).eq('id',id)
    if(error)setError(error.message);else await loadAll()
  }

  if (!isSupabaseConfigured) return <div className="hf-setup"><h1>Chưa kết nối Supabase</h1><p>Hãy tạo file <code>.env.local</code> và khai báo VITE_SUPABASE_URL cùng VITE_SUPABASE_ANON_KEY.</p><a href="/">Quay lại website</a></div>
  if (!authReady) return <div className="hf-loading">Đang kiểm tra phiên đăng nhập…</div>
  if (!session) return <Login onLogin={()=>{}} />
  if (!authorized) return <div className="hf-setup"><h1>Không có quyền truy cập</h1><p>{error || 'Tài khoản này chưa được cấp quyền admin.'}</p><button className="hf-btn" onClick={logout}>Đăng xuất</button></div>

  return <div className="hf-admin">
    <aside className="hf-sidebar"><a className="hf-admin-brand" href="/"><span className="hf-mark small">H</span><span>HOÀNG FORD<small>ADMIN CONSOLE</small></span></a>
      <div className="hf-side-label">QUẢN LÝ</div>
      {[['overview','▦','Tổng quan'],['vehicles','▣','Quản lý xe'],['prices','₫','Bảng giá'],['leads','♙','Khách hàng'],['appointments','◷','Lịch lái thử']].map(([id,icon,label])=><button key={id} className={`hf-nav-item ${tab===id?'active':''}`} onClick={()=>{setTab(id);setError('')}}><span>{icon}</span>{label}{id==='leads'&&newLeads>0&&<b>{newLeads}</b>}</button>)}
      <div className="hf-sidebar-bottom"><span>{session.user.email}</span><button onClick={logout}>Đăng xuất ↗</button><a href="/">← Xem website</a></div>
    </aside>
    <main className="hf-admin-main"><header className="hf-admin-top"><div><span className="hf-kicker">HOÀNG FORD AUTO / ADMIN</span><h1>{({overview:'Tổng quan',vehicles:'Quản lý xe',prices:'Bảng giá xe',leads:'Khách hàng tiềm năng',appointments:'Lịch lái thử'})[tab]}</h1></div><button className="hf-btn" onClick={loadAll}>↻ Làm mới</button></header>
      {error&&<div className="hf-error hf-global-error">{error}<button onClick={()=>setError('')}>×</button></div>}
      {loading&&<div className="hf-loading-inline">Đang tải dữ liệu…</div>}
      {tab==='overview'&&<>
        <div className="hf-stats"><div><span>Tổng dòng xe</span><strong>{vehicles.length}</strong><small>Trong danh mục quản lý</small></div><div><span>Khách hàng</span><strong>{leads.length}</strong><small>{newLeads} yêu cầu mới</small></div><div><span>Lịch lái thử</span><strong>{appointments.length}</strong><small>{pendingAppointments} lịch chờ xác nhận</small></div><div><span>Bảng giá</span><strong>{prices.length}</strong><small>Bản ghi giá xe</small></div></div>
        <div className="hf-panels"><section className="hf-panel"><div className="hf-panel-head"><h2>Khách hàng mới</h2><button onClick={()=>setTab('leads')}>Xem tất cả →</button></div>{leads.slice(0,5).map(x=><div className="hf-mini-row" key={x.id}><div><b>{x.full_name}</b><small>{x.phone} · {x.vehicle_name||'Chưa chọn xe'}</small></div><span className="hf-pill">{x.status}</span></div>)}{!leads.length&&<p className="hf-empty">Chưa có khách hàng.</p>}</section>
        <section className="hf-panel"><div className="hf-panel-head"><h2>Lịch lái thử sắp tới</h2><button onClick={()=>setTab('appointments')}>Xem tất cả →</button></div>{appointments.slice(0,5).map(x=><div className="hf-mini-row" key={x.id}><div><b>{x.full_name} · {x.vehicle_name}</b><small>{dateTime(x.scheduled_at)} · {x.phone}</small></div><span className="hf-pill">{x.status}</span></div>)}{!appointments.length&&<p className="hf-empty">Chưa có lịch lái thử.</p>}</section></div>
      </>}
      {tab==='vehicles'&&<section className="hf-panel"><div className="hf-panel-head"><div><h2>Danh mục xe</h2><p>Quản lý nội dung hiển thị trên website.</p></div><button className="hf-btn hf-btn-primary" onClick={()=>setVehicleModal({})}>+ Thêm xe</button></div><input className="hf-search" placeholder="Tìm tên xe hoặc phân khúc…" value={search} onChange={e=>setSearch(e.target.value)}/><div className="hf-table-wrap"><table><thead><tr><th>Tên xe</th><th>Phân khúc</th><th>Phiên bản</th><th>Hiển thị</th><th>Thao tác</th></tr></thead><tbody>{filteredVehicles.map(v=><tr key={v.id}><td><b>{v.name}</b><small>{v.slug}</small></td><td>{v.category}</td><td>{(v.versions||[]).join(', ')||'—'}</td><td><span className={`hf-pill ${v.is_active?'green':''}`}>{v.is_active?'Đang hiển thị':'Đã ẩn'}</span></td><td><button className="hf-link-btn" onClick={()=>setVehicleModal(v)}>Sửa</button><button className="hf-link-btn danger" onClick={()=>deleteVehicle(v)}>Xóa</button></td></tr>)}</tbody></table></div></section>}
      {tab==='prices'&&<section className="hf-panel"><div className="hf-panel-head"><div><h2>Bảng giá</h2><p>Nhập giá bằng VNĐ, ví dụ 999000000.</p></div><button className="hf-btn hf-btn-primary" onClick={()=>setPriceModal({...emptyPrice})}>+ Thêm giá</button></div><div className="hf-table-wrap"><table><thead><tr><th>Dòng xe</th><th>Phiên bản</th><th>Năm</th><th>Giá niêm yết</th><th>Giá ưu đãi</th><th>Hiệu lực</th><th></th></tr></thead><tbody>{prices.map(p=><tr key={p.id}><td>{p.vehicles?.name||'—'}</td><td><b>{p.version_name}</b></td><td>{p.model_year||'—'}</td><td>{money(p.list_price)}</td><td>{money(p.promotion_price)}</td><td>{p.effective_from||'—'} → {p.effective_to||'—'}</td><td><button className="hf-link-btn" onClick={()=>setPriceModal(p)}>Sửa</button><button className="hf-link-btn danger" onClick={()=>deletePrice(p)}>Xóa</button></td></tr>)}</tbody></table></div></section>}
      {tab==='leads'&&<section className="hf-panel"><div className="hf-panel-head"><div><h2>Danh sách khách hàng</h2><p>Thông tin gửi từ biểu mẫu trên website.</p></div></div><div className="hf-table-wrap"><table><thead><tr><th>Khách hàng</th><th>Xe quan tâm</th><th>Nhu cầu / lời nhắn</th><th>Ngày gửi</th><th>Trạng thái</th></tr></thead><tbody>{leads.map(x=><tr key={x.id}><td><b>{x.full_name}</b><small>{x.phone}{x.email?` · ${x.email}`:''}</small></td><td>{x.vehicle_name||'—'}</td><td>{x.lead_type}<small>{x.message||''}</small></td><td>{dateTime(x.created_at)}</td><td><select className="hf-status" value={x.status} onChange={e=>updateStatus('customer_leads',x.id,e.target.value)}>{['Mới','Đã liên hệ','Đang tư vấn','Đã chốt','Không thành công'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!leads.length&&<p className="hf-empty">Chưa có dữ liệu khách hàng.</p>}</div></section>}
      {tab==='appointments'&&<section className="hf-panel"><div className="hf-panel-head"><div><h2>Đăng ký lái thử</h2><p>Quản lý và xác nhận lịch hẹn khách hàng.</p></div></div><div className="hf-table-wrap"><table><thead><tr><th>Khách hàng</th><th>Dòng xe</th><th>Thời gian</th><th>Địa điểm</th><th>Ghi chú</th><th>Trạng thái</th></tr></thead><tbody>{appointments.map(x=><tr key={x.id}><td><b>{x.full_name}</b><small>{x.phone}{x.email?` · ${x.email}`:''}</small></td><td>{x.vehicle_name}</td><td>{dateTime(x.scheduled_at)}</td><td>{x.location||'—'}</td><td>{x.note||'—'}</td><td><select className="hf-status" value={x.status} onChange={e=>updateStatus('test_drive_appointments',x.id,e.target.value)}>{['Chờ xác nhận','Đã xác nhận','Đã hoàn thành','Đã hủy'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!appointments.length&&<p className="hf-empty">Chưa có lịch lái thử.</p>}</div></section>}
    </main>
    {vehicleModal&&<Modal title={vehicleModal.id?'Cập nhật thông tin xe':'Thêm dòng xe'} onClose={()=>setVehicleModal(null)}><form className="hf-form-grid" onSubmit={saveVehicle}>
      <label>Tên xe *<input name="name" defaultValue={vehicleModal.name||''} required/></label><label>Slug *<input name="slug" defaultValue={vehicleModal.slug||''} placeholder="ford-ranger" required/></label>
      <label>Phân khúc<select name="category" defaultValue={vehicleModal.category||'SUV'}><option>SUV</option><option>Bán tải</option><option>Thương mại</option></select></label><label>Nhãn hiển thị<input name="badge" defaultValue={vehicleModal.badge||''}/></label>
      <label className="wide">Mô tả ngắn<input name="short_description" defaultValue={vehicleModal.short_description||''}/></label><label className="wide">Mô tả chi tiết<textarea name="description" rows="3" defaultValue={vehicleModal.description||''}/></label>
      <label className="wide">URL ảnh đại diện<input name="image_url" defaultValue={vehicleModal.image_url||''}/></label><label className="wide">Phiên bản (phân cách bằng dấu phẩy)<input name="versions" defaultValue={(vehicleModal.versions||[]).join(', ')}/></label>
      <label>Số chỗ<input name="seats" defaultValue={vehicleModal.seats||''}/></label><label>Động cơ<input name="engine" defaultValue={vehicleModal.engine||''}/></label><label>Hộp số<input name="transmission" defaultValue={vehicleModal.transmission||''}/></label><label>Dẫn động<input name="drivetrain" defaultValue={vehicleModal.drivetrain||''}/></label>
      <label>Thứ tự<input name="sort_order" type="number" defaultValue={vehicleModal.sort_order??0}/></label><label className="hf-check"><input name="is_active" type="checkbox" defaultChecked={vehicleModal.is_active!==false}/> Hiển thị trên website</label>
      <div className="wide hf-form-actions"><button type="button" className="hf-btn" onClick={()=>setVehicleModal(null)}>Hủy</button><button className="hf-btn hf-btn-primary">Lưu xe</button></div>
    </form></Modal>}
    {priceModal&&<Modal title={priceModal.id?'Cập nhật bảng giá':'Thêm giá xe'} onClose={()=>setPriceModal(null)}><form className="hf-form-grid" onSubmit={savePrice}>
      <label className="wide">Dòng xe *<select name="vehicle_id" defaultValue={priceModal.vehicle_id||''} required><option value="">Chọn xe</option>{vehicles.map(v=><option value={v.id} key={v.id}>{v.name}</option>)}</select></label>
      <label>Phiên bản *<input name="version_name" defaultValue={priceModal.version_name||''} required/></label><label>Năm sản xuất<input name="model_year" type="number" defaultValue={priceModal.model_year||new Date().getFullYear()}/></label>
      <label>Giá niêm yết (VNĐ)<input name="list_price" type="number" min="0" defaultValue={priceModal.list_price??''}/></label><label>Giá ưu đãi (VNĐ)<input name="promotion_price" type="number" min="0" defaultValue={priceModal.promotion_price??''}/></label>
      <label>Hiệu lực từ<input name="effective_from" type="date" defaultValue={priceModal.effective_from||''}/></label><label>Hiệu lực đến<input name="effective_to" type="date" defaultValue={priceModal.effective_to||''}/></label>
      <label className="wide">Ghi chú<textarea name="notes" rows="2" defaultValue={priceModal.notes||''}/></label><label className="hf-check"><input name="is_active" type="checkbox" defaultChecked={priceModal.is_active!==false}/> Đang áp dụng</label>
      <div className="wide hf-form-actions"><button type="button" className="hf-btn" onClick={()=>setPriceModal(null)}>Hủy</button><button className="hf-btn hf-btn-primary">Lưu bảng giá</button></div>
    </form></Modal>}
  </div>
}
