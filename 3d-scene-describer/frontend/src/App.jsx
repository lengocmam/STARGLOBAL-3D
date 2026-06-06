import { useState, useEffect, useRef } from "react";

const SPACE_TYPES = ["Căn hộ","Biệt thự","Văn phòng","Cửa hàng","Showroom","Nhà hàng","Triển lãm","Khách sạn","Trường học","Kho xưởng","Khác"];
const AUDIENCES = ["Người mua nhà cá nhân","Nhà đầu tư BĐS","Doanh nghiệp B2B","Khách hàng bán lẻ","Khách tham quan triển lãm","Ban quản lý nội bộ","Đối tác kiến trúc / thiết kế","Khác"];

function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sg3d_history") || "[]"); } catch { return []; }
  });
  const add = (entry) => {
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    localStorage.setItem("sg3d_history", JSON.stringify(next));
  };
  const remove = (id) => {
    const next = history.filter(h => h.id !== id);
    setHistory(next);
    localStorage.setItem("sg3d_history", JSON.stringify(next));
  };
  const clear = () => { setHistory([]); localStorage.removeItem("sg3d_history"); };
  return { history, add, remove, clear };
}

function exportTxt(entry) {
  const txt = [
    `=== ${entry.data.title} ===`,
    `Dự án: ${entry.form.projectName}`,
    `Loại không gian: ${entry.form.spaceType}`,
    `Khách hàng: ${entry.form.targetAudience}`,
    `Ngày tạo: ${new Date(entry.id).toLocaleString("vi-VN")}`,
    ``,
    `MÔ TẢ NGẮN`,
    entry.data.shortDescription,
    ``,
    `5 ĐIỂM NỔI BẬT`,
    ...entry.data.highlights.map((h, i) => `${i + 1}. ${h}`),
    ``,
    `LƯU Ý SỐ HÓA 3D`,
    ...entry.data.digitizationNotes.map((n, i) => `${i + 1}. ${n}`),
  ].join("\n");
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = `${entry.form.projectName.replace(/\s+/g, "_")}_3D.txt`; a.click();
}

function exportJson(entry) {
  const blob = new Blob([JSON.stringify({ input: entry.form, output: entry.data }, null, 2)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = `${entry.form.projectName.replace(/\s+/g, "_")}_3D.json`; a.click();
}

export default function App() {
  const [form, setForm] = useState({ projectName: "", spaceType: "", description: "", targetAudience: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [tab, setTab] = useState("form"); // form | history
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [apiMode, setApiMode] = useState("loading");
  const resultRef = useRef(null);
  const { history, add, remove, clear } = useHistory();

  // Check API mode on mount
  useEffect(() => {
    const checkApiMode = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/health");
        const data = await res.json();
        setApiMode(data.mode || "mock-fallback");
      } catch (err) {
        setApiMode("offline");
      }
    };
    checkApiMode();
  }, []);

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const validate = () => {
    const e = {};
    if (!form.projectName.trim()) e.projectName = "Vui lòng nhập tên dự án";
    else if (form.projectName.trim().length < 2) e.projectName = "Tối thiểu 2 ký tự";
    if (!form.spaceType) e.spaceType = "Vui lòng chọn loại không gian";
    if (!form.description.trim()) e.description = "Vui lòng nhập mô tả";
    else if (form.description.trim().length < 10) e.description = "Tối thiểu 10 ký tự";
    if (!form.targetAudience) e.targetAudience = "Vui lòng chọn nhóm khách hàng";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setResult(null); setApiError("");
    try {
      const res = await fetch("http://localhost:3001/api/describe-scene", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Lỗi không xác định");
      setResult(json.data);
      add({ id: Date.now(), form: { ...form }, data: json.data });
    } catch (err) {
      setApiError(err.message || "Không thể kết nối server.");
    } finally { setLoading(false); }
  };

  const toggleCompare = (id) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev);
  };

  const compareEntries = history.filter(h => compareIds.includes(h.id));

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="var(--accent)" strokeWidth="1.5" fill="none"/><polygon points="16,8 24,13 24,19 16,24 8,19 8,13" stroke="var(--accent)" strokeWidth="1" fill="rgba(79,158,255,0.08)"/><circle cx="16" cy="16" r="3" fill="var(--accent)"/></svg>
          </div>
          <div>
            <h1>3D Scene Describer</h1>
            <span className="subtitle">AI hỗ trợ nội dung số hóa không gian 3D</span>
          </div>
        </div>
        <div className="header-right">
          <span className={`badge-mode badge-${apiMode}`} title={`API Mode: ${apiMode}`}>
            {apiMode === "claude-ai" ? "🤖 Claude AI" : apiMode === "mock-fallback" ? "📋 Mock Data" : "⚠️ Offline"}
          </span>
          <nav className="tab-nav">
            <button className={tab === "form" ? "active" : ""} onClick={() => setTab("form")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
              Tạo mới
            </button>
            <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><polyline points="12,6 12,12 16,14"/></svg>
              Lịch sử {history.length > 0 && <span className="count">{history.length}</span>}
            </button>
          </nav>
        </div>
      </header>

      {tab === "form" && (
        <div className="main-layout">
          <aside className="form-panel">
            <form onSubmit={handleSubmit} noValidate>
              <div className="panel-title">Thông tin dự án</div>

              <div className="field">
                <label>Tên dự án <span className="req">*</span></label>
                <input name="projectName" placeholder="VD: The Manor Central Park – Tầng 12" value={form.projectName}
                  onChange={e => { setForm({...form, projectName: e.target.value}); setErrors({...errors, projectName: ""}); }}
                  className={errors.projectName ? "err" : ""} />
                {errors.projectName && <span className="errmsg">{errors.projectName}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Loại không gian <span className="req">*</span></label>
                  <select value={form.spaceType} className={errors.spaceType ? "err" : ""}
                    onChange={e => { setForm({...form, spaceType: e.target.value}); setErrors({...errors, spaceType: ""}); }}>
                    <option value="">-- Chọn --</option>
                    {SPACE_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                  </select>
                  {errors.spaceType && <span className="errmsg">{errors.spaceType}</span>}
                </div>
                <div className="field">
                  <label>Nhóm khách hàng <span className="req">*</span></label>
                  <select value={form.targetAudience} className={errors.targetAudience ? "err" : ""}
                    onChange={e => { setForm({...form, targetAudience: e.target.value}); setErrors({...errors, targetAudience: ""}); }}>
                    <option value="">-- Chọn --</option>
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {errors.targetAudience && <span className="errmsg">{errors.targetAudience}</span>}
                </div>
              </div>

              <div className="field">
                <label>Mô tả nội dung / mục đích <span className="req">*</span></label>
                <textarea rows={4} placeholder="VD: Căn hộ 2PN nội thất cao cấp, hướng Đông Nam, phục vụ khách mua để ở…"
                  value={form.description} className={errors.description ? "err" : ""}
                  onChange={e => { setForm({...form, description: e.target.value}); setErrors({...errors, description: ""}); }} />
                <div className="field-footer">
                  {errors.description ? <span className="errmsg">{errors.description}</span> : <span/>}
                  <span className="charcount">{form.description.length} ký tự</span>
                </div>
              </div>

              {apiError && <div className="api-err"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{apiError}</div>}

              <div className="btn-row">
                <button type="button" className="btn-ghost" onClick={() => { setForm({projectName:"",spaceType:"",description:"",targetAudience:""}); setResult(null); setErrors({}); setApiError(""); }}>
                  Làm mới
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <span className="btn-loading"><span className="spin"/></span> : <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>
                    Phân tích với AI
                  </>}
                </button>
              </div>
            </form>

            {history.length >= 2 && (
              <div className="compare-hint">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>
                Chọn 2 kết quả trong Lịch sử để so sánh
              </div>
            )}
          </aside>

          <div className="result-area">
            {loading && (
              <div className="loading-state">
                <div className="loading-hex">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><polygon points="32,4 60,20 60,44 32,60 4,44 4,20" stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.3"/><polygon points="32,12 52,23 52,41 32,52 12,41 12,23" stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.5" style={{animation:"spin 3s linear infinite",transformOrigin:"32px 32px"}}/><circle cx="32" cy="32" r="6" fill="var(--accent)" opacity="0.8"/></svg>
                </div>
                <p className="loading-title">AI đang phân tích dự án…</p>
                <p className="loading-sub">Đang sinh nội dung marketing và lưu ý số hóa 3D</p>
              </div>
            )}

            {!loading && result && (
              <div className="result-card" ref={resultRef}>
                <div className="result-topbar">
                  <div className="result-meta">
                    <span className="result-tag">{form.spaceType}</span>
                    <span className="result-tag secondary">{form.targetAudience}</span>
                  </div>
                  <div className="export-btns">
                    <button className="btn-export" onClick={() => exportTxt({ id: Date.now(), form, data: result })}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg> TXT
                    </button>
                    <button className="btn-export" onClick={() => exportJson({ id: Date.now(), form, data: result })}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg> JSON
                    </button>
                  </div>
                </div>

                <h2 className="result-title">{result.title}</h2>

                <div className="result-section">
                  <div className="section-label">Mô tả ngắn</div>
                  <p className="result-desc">{result.shortDescription}</p>
                </div>

                <div className="two-col">
                  <div className="result-section">
                    <div className="section-label">5 điểm nổi bật</div>
                    <ul className="hl-list">
                      {result.highlights.map((h, i) => (
                        <li key={i}><span className="hl-num">{i + 1}</span><span>{h}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="result-section">
                    <div className="section-label">Lưu ý số hóa 3D</div>
                    <ul className="note-list">
                      {result.digitizationNotes.map((n, i) => (
                        <li key={i}><span className="note-dot"/><span>{n}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="empty-state">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" opacity="0.18"><polygon points="32,4 60,20 60,44 32,60 4,44 4,20" stroke="currentColor" strokeWidth="1.5" fill="none"/><polygon points="32,14 50,25 50,39 32,50 14,39 14,25" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
                <p>Điền thông tin dự án và nhấn <strong>Phân tích với AI</strong></p>
                <p className="empty-sub">Kết quả sẽ hiện ở đây sau vài giây</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="history-panel">
          <div className="history-header">
            <div>
              <h2>Lịch sử phân tích</h2>
              <p>{history.length} dự án · Lưu trữ trên máy</p>
            </div>
            <div className="history-actions">
              {compareIds.length === 2 && (
                <button className="btn-compare" onClick={() => setShowCompare(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>
                  So sánh 2 dự án
                </button>
              )}
              {history.length > 0 && <button className="btn-ghost-sm" onClick={clear}>Xóa tất cả</button>}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="empty-state"><p>Chưa có dự án nào trong lịch sử.</p></div>
          ) : (
            <div className="history-grid">
              {history.map(entry => (
                <div key={entry.id} className={`history-card ${compareIds.includes(entry.id) ? "selected" : ""}`}>
                  <div className="hcard-top">
                    <div>
                      <div className="hcard-name">{entry.form.projectName}</div>
                      <div className="hcard-meta">
                        <span className="result-tag">{entry.form.spaceType}</span>
                        <span className="hcard-time">{new Date(entry.id).toLocaleString("vi-VN", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => remove(entry.id)} title="Xóa">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/></svg>
                    </button>
                  </div>
                  <p className="hcard-desc">{entry.data.shortDescription.slice(0, 120)}…</p>
                  <div className="hcard-footer">
                    <label className="compare-check">
                      <input type="checkbox" checked={compareIds.includes(entry.id)} onChange={() => toggleCompare(entry.id)} disabled={!compareIds.includes(entry.id) && compareIds.length === 2} />
                      So sánh
                    </label>
                    <div className="hcard-exports">
                      <button className="btn-export-sm" onClick={() => exportTxt(entry)}>TXT</button>
                      <button className="btn-export-sm" onClick={() => exportJson(entry)}>JSON</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showCompare && compareEntries.length === 2 && (
        <div className="modal-overlay" onClick={() => setShowCompare(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>So sánh dự án</h2>
              <button className="btn-icon" onClick={() => setShowCompare(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="compare-grid">
              {compareEntries.map(e => (
                <div key={e.id} className="compare-col">
                  <div className="compare-project">{e.form.projectName}</div>
                  <span className="result-tag">{e.form.spaceType}</span>
                  <div className="compare-block">
                    <div className="section-label">Tiêu đề</div>
                    <p className="compare-title">{e.data.title}</p>
                  </div>
                  <div className="compare-block">
                    <div className="section-label">Mô tả</div>
                    <p className="compare-text">{e.data.shortDescription}</p>
                  </div>
                  <div className="compare-block">
                    <div className="section-label">Điểm nổi bật</div>
                    <ul className="compare-list">
                      {e.data.highlights.map((h, i) => <li key={i}><span className="hl-num sm">{i+1}</span>{h}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}