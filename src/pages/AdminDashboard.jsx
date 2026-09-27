import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listenToAuth, logoutAdmin } from "../services/authService";
import {
  getPortfolioMeta, savePortfolioMeta,
  getSkills, addSkill, updateSkill, deleteSkill,
  getSoftware, addSoftware, updateSoftware, deleteSoftware,
  getExperience, addExperience, updateExperience, deleteExperience,
  getProjects, addProject, updateProject, deleteProject,
  getCertificates, addCertificate, updateCertificate, deleteCertificate,
  uploadResumeAsBase64, deleteResume,
} from "../services/portfolioService";

const TABS = [
  "overview",
  "profile",
  "resume",
  "skills",
  "software",
  "experience",
  "projects",
  "certificates",
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("overview");

  const [meta, setMeta] = useState({
    name: "", role: "", location: "", email: "",
    phone: "", linkedin: "", portfolio: "", photoUrl: "",
    resumeUrl: "", resumeName: "", resumeSize: 0,
  });

  const [skills, setSkills] = useState([]);
  const [software, setSoftware] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bulkProjectUploading, setBulkProjectUploading] = useState(false);

  useEffect(() => {
    const unsub = listenToAuth((u) => {
      if (!u) navigate("/admin/login");
      else setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, [navigate]);

  const refresh = useCallback(async () => {
    try {
      const [m, s, sw, ex, p, c] = await Promise.all([
        getPortfolioMeta(),
        getSkills(),
        getSoftware(),
        getExperience(),
        getProjects(),
        getCertificates(),
      ]);
      if (m) setMeta((prev) => ({ ...prev, ...m }));
      setSkills(s);
      setSoftware(sw);
      setExperience(ex);
      setProjects(p);
      setCertificates(c);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  if (checking) return <div className="admin-loading">AUTHENTICATING...</div>;

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDelete = async (type, id) => {
    if (!id) return alert("Missing ID");
    if (!confirm("Delete this item?")) return;
    try {
      const del = {
        skills: deleteSkill,
        software: deleteSoftware,
        experience: deleteExperience,
        projects: deleteProject,
        certificates: deleteCertificate,
      }[type];
      await del(id);
      await refresh();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleSave = async (type, data) => {
    setSaving(true);
    try {
      const add = {
        skills: addSkill,
        software: addSoftware,
        experience: addExperience,
        projects: addProject,
        certificates: addCertificate,
      }[type];
      const update = {
        skills: updateSkill,
        software: updateSoftware,
        experience: updateExperience,
        projects: updateProject,
        certificates: updateCertificate,
      }[type];

      if (data.id) await update(data.id, data);
      else await add(data);

      await refresh();
      setModal(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveMeta = async (data) => {
    setSaving(true);
    try {
      await savePortfolioMeta(data);
      await refresh();
      setModal(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const compressImageToBase64 = (file, maxBytes = 680 * 1024) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error(`Could not read image: ${file.name}`));
        img.onload = () => {
          const maxDimension = 1800;
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.82;
          const make = () => {
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            const approxBytes = Math.ceil((dataUrl.length * 3) / 4);
            if (approxBytes <= maxBytes || quality <= 0.45) {
              resolve(dataUrl);
              return;
            }
            quality -= 0.07;
            make();
          };
          make();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const titleFromFilename = (filename) => {
    const base = filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    if (!base) return "CAD Design Project";
    return base.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const createAutoProjectDescription = (title, tools) => {
    const toolText = tools.length ? ` using ${tools.join(", ")}` : " using 3D CAD tools";
    return `${title} — a mechanical design project focused on 3D CAD modeling, component geometry and engineering design presentation${toolText}.`;
  };

  const handleBulkProjectUpload = async ({ files, category, tools, startOrder }) => {
    if (!files?.length) return;
    setBulkProjectUploading(true);
    try {
      const normalizedTools = tools
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      let order = Number.isFinite(Number(startOrder)) ? Number(startOrder) : projects.length;
      let created = 0;

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const title = titleFromFilename(file.name);
        const image = await compressImageToBase64(file);
        await addProject({
          title,
          category: category.trim() || "Mechanical Design",
          description: createAutoProjectDescription(title, normalizedTools),
          tools: normalizedTools,
          image,
          pdfUrl: "",
          github: "",
          live: "",
          order: order++,
        });
        created++;
      }

      await refresh();
      setModal(null);
      alert(`✅ ${created} project${created === 1 ? "" : "s"} added successfully.`);
    } catch (err) {
      console.error("Bulk project upload failed:", err);
      alert("❌ Bulk upload failed\n\n" + (err?.message || err));
    } finally {
      setBulkProjectUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      await uploadResumeAsBase64(file);
      await refresh();
      alert("✅ CV uploaded successfully.");
    } catch (err) {
      console.error("[uploadResumeAsBase64]", err);
      alert("❌ Upload failed\n\n" + (err?.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm("Delete current CV?")) return;
    try {
      await deleteResume();
      await refresh();
    } catch (err) {
      console.error("[deleteResume]", err);
      alert("Delete failed: " + (err?.message || err));
    }
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <span>MF</span>
          <small>ADMIN</small>
        </div>
        <nav>
          {TABS.map((t) => (
            <a
              key={t}
              href={`#${t}`}
              className={tab === t ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setTab(t);
              }}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </a>
          ))}
        </nav>
        <button className="dashboard-logout" onClick={handleLogout}>
          LOGOUT
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-status">● SYSTEM ONLINE</span>
            <h1>Dashboard</h1>
          </div>
          <div className="dashboard-user">{user?.email}</div>
        </header>

        <section className="dashboard-content" style={{ display: "block" }}>
          {/* ==================== OVERVIEW ==================== */}
          {tab === "overview" && (
            <div className="dashboard-cards-grid">
              <Card n="01" title="Skills" info={`${skills.length} items`} onClick={() => setTab("skills")} />
              <Card n="02" title="Software" info={`${software.length} items`} onClick={() => setTab("software")} />
              <Card n="03" title="Experience" info={`${experience.length} items`} onClick={() => setTab("experience")} />
              <Card n="04" title="Projects" info={`${projects.length} items`} onClick={() => setTab("projects")} />
              <Card n="05" title="Certificates" info={`${certificates.length} items`} onClick={() => setTab("certificates")} />
              <Card n="06" title="Resume / CV" info={meta.resumeUrl ? "Uploaded ✓" : "Not uploaded"} onClick={() => setTab("resume")} />
              <Card n="07" title="Profile" info="Name, role, contact" onClick={() => setTab("profile")} />
            </div>
          )}

          {/* ==================== PROFILE ==================== */}
          {tab === "profile" && (
            <div className="dashboard-list">
              <button
                className="dashboard-add"
                onClick={() => setModal({ type: "profile", data: { ...meta } })}
              >
                + EDIT PROFILE
              </button>

              <div className="dashboard-row">
                <div>
                  <strong>{meta.name || "—"}</strong>
                  <small>
                    {meta.role || "—"} · {meta.location || "—"}
                  </small>
                </div>
              </div>

              {meta.phone && (
                <div className="dashboard-row">
                  <div>
                    <strong>{meta.phone}</strong>
                    <small>Phone</small>
                  </div>
                </div>
              )}

              {meta.linkedin && (
                <div className="dashboard-row">
                  <div>
                    <strong>{meta.linkedin}</strong>
                    <small>LinkedIn</small>
                  </div>
                </div>
              )}

              {meta.portfolio && (
                <div className="dashboard-row">
                  <div>
                    <strong>{meta.portfolio}</strong>
                    <small>Portfolio</small>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== RESUME ==================== */}
          {tab === "resume" && (
            <div className="dashboard-list">
              <div className="dashboard-row">
                <div>
                  <strong>CV / Resume</strong>
                  <small>
                    {meta.resumeUrl
                      ? `Uploaded · ${meta.resumeName || "resume.pdf"} · ${((meta.resumeSize || 0) / 1024).toFixed(0)} KB`
                      : "Not uploaded"}
                  </small>
                </div>
                <div className="row-actions">
                  <label
                    style={{
                      cursor: uploading ? "wait" : "pointer",
                      color: "var(--terracotta)",
                      border: "1px solid var(--terracotta)",
                      padding: "9px 16px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      display: "inline-block",
                    }}
                  >
                    {uploading ? "UPLOADING..." : "UPLOAD PDF"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      onChange={handleResumeUpload}
                      disabled={uploading}
                    />
                  </label>
                  {meta.resumeUrl && (
                    <button className="danger" onClick={handleResumeDelete}>
                      DELETE
                    </button>
                  )}
                </div>
              </div>

              {meta.resumeUrl && (
                <a
                  href={meta.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--terracotta)",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    marginTop: "10px",
                    display: "inline-block",
                  }}
                >
                  PREVIEW CURRENT CV ↗
                </a>
              )}

              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  border: "1px dashed var(--line)",
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: "1.7",
                }}
              >
                <strong style={{ color: "var(--ink)", display: "block", marginBottom: "8px" }}>
                  NOTES
                </strong>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Max file size: <strong>700 KB</strong></li>
                  <li>Accepted formats: PDF, DOC, DOCX</li>
                  <li>
                    Compress large files at{" "}
                    <a
                      href="https://smallpdf.com/compress-pdf"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--terracotta)" }}
                    >
                      smallpdf.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ==================== SKILLS ==================== */}
          {tab === "skills" && (
            <ListPanel
              onAdd={() =>
                setModal({
                  type: "skills",
                  data: { name: "", category: "", level: 80, order: skills.length },
                })
              }
              items={skills}
              onEdit={(item) => setModal({ type: "skills", data: item })}
              onDelete={(id) => handleDelete("skills", id)}
              render={(s) => (
                <>
                  <strong>{s.name}</strong>
                  <small>{s.category} · {s.level}%</small>
                </>
              )}
            />
          )}

          {/* ==================== SOFTWARE ==================== */}
          {tab === "software" && (
            <ListPanel
              onAdd={() =>
                setModal({
                  type: "software",
                  data: { name: "", rating: 4, note: "", order: software.length },
                })
              }
              items={software}
              onEdit={(item) => setModal({ type: "software", data: item })}
              onDelete={(id) => handleDelete("software", id)}
              render={(s) => (
                <>
                  <strong>{s.name}</strong>
                  <small>Rating {s.rating}/5</small>
                </>
              )}
            />
          )}

          {/* ==================== EXPERIENCE ==================== */}
          {tab === "experience" && (
            <ListPanel
              onAdd={() =>
                setModal({
                  type: "experience",
                  data: {
                    role: "", company: "", location: "", period: "",
                    points: [], order: experience.length,
                  },
                })
              }
              items={experience}
              onEdit={(item) => setModal({ type: "experience", data: item })}
              onDelete={(id) => handleDelete("experience", id)}
              render={(s) => (
                <>
                  <strong>{s.role}</strong>
                  <small>{s.company} · {s.period}</small>
                </>
              )}
            />
          )}

          {/* ==================== PROJECTS ==================== */}
          {tab === "projects" && (
            <>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
                <button
                  className="dashboard-add"
                  onClick={() =>
                    setModal({
                      type: "projects",
                      data: {
                        title: "", category: "", description: "",
                        tools: [], image: "", pdfUrl: "", github: "", live: "",
                        order: projects.length,
                      },
                    })
                  }
                >
                  + ADD NEW
                </button>
                <button
                  className="dashboard-add"
                  onClick={() =>
                    setModal({
                      type: "projects-bulk",
                      data: {
                        category: "Mechanical Design",
                        tools: "Creo, CATIA V5, AutoCAD, SolidWorks",
                        order: projects.length,
                        files: [],
                      },
                    })
                  }
                >
                  + BULK UPLOAD CAD
                </button>
              </div>
              <div style={{
                marginBottom: "20px", padding: "14px 16px", border: "1px dashed var(--line)",
                borderRadius: "10px", color: "var(--muted)", fontSize: "12px", lineHeight: 1.6
              }}>
                <strong style={{ color: "var(--ink)" }}>BULK MODE:</strong> Select multiple CAD images.
                Titles come from filenames, descriptions and tools are generated automatically, and images are compressed for the 700 KB limit.
                You can edit any project afterward.
              </div>
              <ListPanel
                onAdd={() =>
                  setModal({
                    type: "projects",
                    data: {
                      title: "", category: "", description: "",
                      tools: [], image: "", pdfUrl: "", github: "", live: "",
                      order: projects.length,
                    },
                  })
                }
                hideAdd
                items={projects}
              onEdit={(item) => setModal({ type: "projects", data: item })}
              onDelete={(id) => handleDelete("projects", id)}
              render={(s) => (
                <>
                  <strong>{s.title}</strong>
                  <small>{s.category}</small>
                </>
              )}
              />
            </>
          )}

          {/* ==================== CERTIFICATES ==================== */}
          {tab === "certificates" && (
            <ListPanel
              onAdd={() =>
                setModal({
                  type: "certificates",
                  data: {
                    title: "", issuer: "", year: "", imageUrl: "",
                    order: certificates.length,
                  },
                })
              }
              items={certificates}
              onEdit={(item) => setModal({ type: "certificates", data: item })}
              onDelete={(id) => handleDelete("certificates", id)}
              render={(s) => (
                <>
                  <strong>{s.title}</strong>
                  <small>{s.issuer} · {s.year}</small>
                </>
              )}
            />
          )}
        </section>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <GenericForm
              modal={modal}
              saving={saving}
              fileToBase64={fileToBase64}
              onCancel={() => setModal(null)}
              onSave={(data) => {
                if (modal.type === "profile") saveMeta(data);
                else handleSave(modal.type, data);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== HELPER COMPONENTS ==================== */

function Card({ n, title, info, onClick }) {
  return (
    <div className="dashboard-card">
      <span className="dashboard-card-number">{n}</span>
      <h2>{title}</h2>
      <p>{info}</p>
      <button onClick={onClick}>MANAGE →</button>
    </div>
  );
}

function ListPanel({ onAdd, items, onEdit, onDelete, render, hideAdd = false }) {
  return (
    <>
      {!hideAdd && (
        <button className="dashboard-add" onClick={onAdd}>
          + ADD NEW
        </button>
      )}
      <div className="dashboard-list">
        {items.map((item) => (
          <div className="dashboard-row" key={item.id}>
            <div>{render(item)}</div>
            <div className="row-actions">
              <button onClick={() => onEdit(item)}>EDIT</button>
              <button className="danger" onClick={() => onDelete(item.id)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px", textAlign: "center" }}>
            Nothing added yet.
          </p>
        )}
      </div>
    </>
  );
}

function BulkProjectsForm({ initial, uploading, onCancel, onUpload }) {
  const [category, setCategory] = useState(initial.category || "Mechanical Design");
  const [tools, setTools] = useState(initial.tools || "Creo, CATIA V5, AutoCAD, SolidWorks");
  const [order, setOrder] = useState(initial.order ?? 0);
  const [files, setFiles] = useState([]);

  return (
    <div>
      <h3>BULK UPLOAD CAD PROJECTS</h3>
      <div className="form-group">
        <label>SELECT CAD IMAGES (MULTIPLE)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        <small style={{ display: "block", marginTop: 8, color: "var(--muted)" }}>
          Select all project images at once. Each image becomes one project. Large images are automatically compressed.
        </small>
      </div>
      <Field label="DEFAULT CATEGORY" value={category} onChange={setCategory} />
      <div className="form-group">
        <label>DEFAULT TOOLS (COMMA SEPARATED)</label>
        <input value={tools} onChange={(e) => setTools(e.target.value)} />
      </div>
      <Field label="STARTING ORDER" type="number" value={order} onChange={(v) => setOrder(Number(v))} />

      <div style={{
        marginTop: 12, padding: 14, borderRadius: 10, background: "rgba(0,0,0,.03)",
        fontSize: 12, lineHeight: 1.65, color: "var(--muted)"
      }}>
        <strong style={{ color: "var(--ink)" }}>AUTO-FILL:</strong><br />
        • Project title = image filename cleaned up<br />
        • Description = professional CAD project summary<br />
        • Tools = the default tools above<br />
        • GitHub / Live URL / PDF = left empty<br />
        • Order = automatically increments for each image
      </div>

      {files.length > 0 && (
        <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700 }}>
          {files.length} image{files.length === 1 ? "" : "s"} selected
        </p>
      )}

      <div className="modal-actions">
        <button type="button" onClick={onCancel} disabled={uploading}>CANCEL</button>
        <button
          type="button"
          className="primary"
          disabled={uploading || files.length === 0}
          onClick={() => onUpload({ files, category, tools, startOrder: order })}
        >
          {uploading ? "UPLOADING..." : `ADD ${files.length || ""} PROJECT${files.length === 1 ? "" : "S"}`}
        </button>
      </div>
    </div>
  );
}

function GenericForm({ modal, onSave, onCancel, saving, fileToBase64 }) {
  const [form, setForm] = useState({ ...modal.data });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const type = modal.type;

  const handleFile = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 700 * 1024) return alert("File too big. Max 700 KB.");
    const dataUrl = await fileToBase64(file);
    set(key, dataUrl);
  };

  const title = {
    profile: "EDIT PROFILE",
    skills: form.id ? "EDIT SKILL" : "ADD SKILL",
    software: form.id ? "EDIT SOFTWARE" : "ADD SOFTWARE",
    experience: form.id ? "EDIT EXPERIENCE" : "ADD EXPERIENCE",
    projects: form.id ? "EDIT PROJECT" : "ADD PROJECT",
    certificates: form.id ? "EDIT CERTIFICATE" : "ADD CERTIFICATE",
  }[type];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h3>{title}</h3>

      {type === "profile" && (
        <>
          <Field label="NAME" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="ROLE" value={form.role} onChange={(v) => set("role", v)} />
          <Field label="LOCATION" value={form.location} onChange={(v) => set("location", v)} />
          <Field label="EMAIL" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="PHONE" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="LINKEDIN URL" value={form.linkedin} onChange={(v) => set("linkedin", v)} />
          <Field label="PORTFOLIO URL" value={form.portfolio} onChange={(v) => set("portfolio", v)} />
          <div className="form-group">
            <label>PROFILE PHOTO (max 700 KB)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, "photoUrl")} />
            {form.photoUrl && (
              <img
                src={form.photoUrl}
                alt=""
                style={{ maxWidth: 120, marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>
        </>
      )}

      {type === "skills" && (
        <>
          <Field label="NAME" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="CATEGORY" value={form.category} onChange={(v) => set("category", v)} />
          <Field
            label="LEVEL (0-100)"
            type="number"
            value={form.level}
            onChange={(v) => set("level", Number(v))}
          />
          <Field
            label="ORDER"
            type="number"
            value={form.order}
            onChange={(v) => set("order", Number(v))}
          />
        </>
      )}

      {type === "software" && (
        <>
          <Field label="NAME" value={form.name} onChange={(v) => set("name", v)} required />
          <Field
            label="RATING (1-5)"
            type="number"
            value={form.rating}
            onChange={(v) => set("rating", Number(v))}
          />
          <Field label="NOTE" value={form.note} onChange={(v) => set("note", v)} />
          <Field
            label="ORDER"
            type="number"
            value={form.order}
            onChange={(v) => set("order", Number(v))}
          />
        </>
      )}

      {type === "experience" && (
        <>
          <Field label="ROLE" value={form.role} onChange={(v) => set("role", v)} required />
          <Field label="COMPANY" value={form.company} onChange={(v) => set("company", v)} />
          <Field label="LOCATION" value={form.location} onChange={(v) => set("location", v)} />
          <Field
            label="PERIOD (e.g. 05/2025 - 04/2026)"
            value={form.period}
            onChange={(v) => set("period", v)}
          />
          <div className="form-group">
            <label>BULLET POINTS (one per line)</label>
            <textarea
              rows="6"
              value={Array.isArray(form.points) ? form.points.join("\n") : ""}
              onChange={(e) =>
                set(
                  "points",
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </div>
          <Field
            label="ORDER"
            type="number"
            value={form.order}
            onChange={(v) => set("order", Number(v))}
          />
        </>
      )}

      {type === "projects-bulk" && (
        <BulkProjectsForm
          initial={form}
          uploading={bulkProjectUploading}
          onCancel={onCancel}
          onUpload={handleBulkProjectUpload}
        />
      )}

      {type === "projects" && (
        <>
          <Field label="TITLE" value={form.title} onChange={(v) => set("title", v)} required />
          <Field label="CATEGORY" value={form.category} onChange={(v) => set("category", v)} />
          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>TOOLS (comma separated)</label>
            <input
              value={Array.isArray(form.tools) ? form.tools.join(", ") : ""}
              onChange={(e) =>
                set(
                  "tools",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                )
              }
            />
          </div>
          <div className="form-group">
            <label>PROJECT IMAGE (max 700 KB)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, "image")} />
            {form.image && (
              <img
                src={form.image}
                alt=""
                style={{ maxWidth: 200, marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>
          <div className="form-group">
            <label>PROJECT PDF (max 700 KB)</label>
            <input type="file" accept=".pdf" onChange={(e) => handleFile(e, "pdfUrl")} />
            {form.pdfUrl && (
              <p style={{ fontSize: 12, color: "var(--terracotta)", marginTop: 8, fontWeight: 600 }}>
                PDF attached ✓
              </p>
            )}
          </div>
          <Field label="GITHUB URL (optional)" value={form.github} onChange={(v) => set("github", v)} />
          <Field label="LIVE URL (optional)" value={form.live} onChange={(v) => set("live", v)} />
          <Field
            label="ORDER"
            type="number"
            value={form.order}
            onChange={(v) => set("order", Number(v))}
          />
        </>
      )}

      {type === "certificates" && (
        <>
          <Field label="TITLE" value={form.title} onChange={(v) => set("title", v)} required />
          <Field label="ISSUER" value={form.issuer} onChange={(v) => set("issuer", v)} />
          <Field label="YEAR" value={form.year} onChange={(v) => set("year", v)} />
          <div className="form-group">
            <label>CERTIFICATE IMAGE (max 700 KB)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e, "imageUrl")} />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt=""
                style={{ maxWidth: 200, marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>
          <Field
            label="ORDER"
            type="number"
            value={form.order}
            onChange={(v) => set("order", Number(v))}
          />
        </>
      )}

      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

export default AdminDashboard;