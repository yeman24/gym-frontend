import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, CreditCard, Dumbbell, Edit3, LoaderCircle, LogOut, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createAdminResource, deleteAdminResource, getAdminResource, updateAdminResource } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { money } from "../lib/utils";

const tabs = [
  { key: "members", label: "Members", singular: "member", icon: Users },
  { key: "classes", label: "Classes", singular: "class", icon: CalendarDays },
  { key: "trainers", label: "Trainers", singular: "trainer", icon: Dumbbell },
  { key: "plans", label: "Plans", singular: "plan", icon: CreditCard },
];

const formConfig = {
  members: [
    { key: "name", label: "Full name", required: true },
    { key: "email", label: "Email address", type: "email", required: true },
    { key: "phone", label: "Phone", required: false },
    { key: "membershipPlanId", label: "Membership plan", type: "select", optionKey: "plans", required: true },
  ],
  classes: [
    { key: "title", label: "Class title", required: true },
    { key: "trainerId", label: "Coach", type: "select", optionKey: "trainers", required: true },
    { key: "schedule", label: "Schedule", required: true },
    { key: "capacity", label: "Capacity", type: "number", required: true },
    { key: "description", label: "Description", type: "textarea", required: true },
  ],
  trainers: [
    { key: "name", label: "Full name", required: true },
    { key: "specialty", label: "Specialty", required: true },
    { key: "bio", label: "Bio", type: "textarea", required: true },
    { key: "photoUrl", label: "Photo URL", required: false },
  ],
  plans: [
    { key: "name", label: "Plan name", required: true },
    { key: "price", label: "Monthly price", type: "number", step: "0.01", required: true },
    { key: "durationInDays", label: "Duration in days", type: "number", required: true },
    { key: "features", label: "Features", help: "Separate features with a | character.", required: true },
  ],
};

const defaultsFor = (resource) => Object.fromEntries(formConfig[resource].map((field) => [field.key, ""]));
const messageFor = (error, fallback) => error?.response?.data?.message || (error?.response?.status === 409 ? "This record cannot be changed because other records depend on it." : fallback);

function displayValue(resource, row, options = {}) {
  if (!row) return { primary: "—", secondary: "", detail: "" };
  if (resource === "members") {
    const planName = row.membershipPlan?.name || options.plans?.find((p) => p.id === Number(row.membershipPlanId))?.name || "Foundation";
    return { primary: row.name || "Member", secondary: row.email || "", detail: planName };
  }
  if (resource === "classes") {
    const trainerName = row.trainer?.name || options.trainers?.find((t) => t.id === Number(row.trainerId))?.name || "IronHouse Coach";
    return { primary: row.title || "Class", secondary: row.schedule || "TBD", detail: `Coach: ${trainerName}` };
  }
  if (resource === "trainers") {
    return { primary: row.name || "Coach", secondary: row.specialty || "Conditioning", detail: row.bio?.slice(0, 72) || "" };
  }
  const featureSnippet = typeof row.features === "string" ? row.features.split("|").slice(0, 2).join(" · ") : `${row.durationInDays || 30} days`;
  return { primary: row.name || "Plan", secondary: money(row.price || 0), detail: featureSnippet };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("members");
  const [rows, setRows] = useState([]);
  const [options, setOptions] = useState({ plans: [], trainers: [] });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(defaultsFor("members"));
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const pageSize = 8;
  const tab = tabs.find((item) => item.key === active) || tabs[0];

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([
      getAdminResource(active),
      getAdminResource("plans"),
      getAdminResource("trainers"),
    ])
      .then(([data, plansData, trainersData]) => {
        if (ignore) return;
        setRows(Array.isArray(data) ? data : []);
        setOptions({
          plans: Array.isArray(plansData) ? plansData : [],
          trainers: Array.isArray(trainersData) ? trainersData : [],
        });
      })
      .catch((requestError) => {
        if (ignore) return;
        if (requestError?.response?.status === 401 && !localStorage.getItem("ironhouse_token")?.includes("demo")) {
          localStorage.removeItem("ironhouse_token");
          navigate("/admin/login");
          return;
        }
        setError(messageFor(requestError, "Using local dashboard data."));
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [active, navigate, reloadKey]);

  useEffect(() => { setPage(1); setSearch(""); setShowForm(false); setEditingId(null); }, [active]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => [row.name, row.title, row.email, row.specialty, row.schedule, row.trainer?.name, row.membershipPlan?.name].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [rows, search]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const stats = [["Records", rows.length], ["Matching", filteredRows.length], ["Status", "Live"]];

  const logout = () => { localStorage.removeItem("ironhouse_token"); localStorage.removeItem("ironhouse_user"); navigate("/admin/login"); };
  const openCreate = () => { setEditingId(null); setForm(defaultsFor(active)); setError(""); setNotice(""); setShowForm(true); };
  const openEdit = (row) => {
    const nextForm = defaultsFor(active);
    formConfig[active].forEach((field) => { nextForm[field.key] = row[field.key] ?? ""; });
    setEditingId(row.id); setForm(nextForm); setError(""); setNotice(""); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(defaultsFor(active)); };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const payload = { ...form };
      ["price", "durationInDays", "capacity", "trainerId", "membershipPlanId"].forEach((key) => { if (key in payload && payload[key] !== "") payload[key] = Number(payload[key]); });
      if (editingId) await updateAdminResource(active, editingId, payload);
      else await createAdminResource(active, payload);
      closeForm(); setNotice(editingId ? "Record updated." : "Record created."); setReloadKey((key) => key + 1);
    } catch (saveError) { setError(messageFor(saveError, "Unable to save this record.")); }
    finally { setSaving(false); }
  };
  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.name || row.title}? This cannot be undone.`)) return;
    setActionId(row.id); setError(""); setNotice("");
    try { await deleteAdminResource(active, row.id); setNotice("Record deleted."); setReloadKey((key) => key + 1); }
    catch (deleteError) { setError(messageFor(deleteError, "Unable to delete this record.")); }
    finally { setActionId(null); }
  };
  const renderField = (field) => {
    const value = form[field.key] ?? "";
    const common = { id: field.key, required: field.required, value, onChange: (event) => setForm((current) => ({ ...current, [field.key]: event.target.value })) };
    let control = <input {...common} type={field.type || "text"} step={field.step} />;
    if (field.type === "textarea") control = <textarea {...common} rows={3} />;
    if (field.type === "select") {
      const list = options[field.optionKey] || [];
      control = <select {...common} style={{ width: "100%", padding: "13px 14px", color: "var(--ink)", background: "transparent", border: "1px solid var(--line)" }}><option value="">Choose one…</option>{list.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>;
    }
    return <label className="field" key={field.key} htmlFor={field.key}><span>{field.label}</span>{control}{field.help && <small>{field.help}</small>}</label>;
  };

  return <div className="admin-page">
    <header className="admin-header"><div><p className="eyebrow">IRONHOUSE CONTROL ROOM</p><h1>Good morning.</h1></div><div style={{ display: "flex", gap: 8 }}><Button variant="ghost" onClick={() => setReloadKey((key) => key + 1)} disabled={loading}><RefreshCw size={16} /> Refresh</Button><Button variant="ghost" onClick={logout}><LogOut size={16} /> Sign out</Button></div></header>
    <div className="admin-tabs">{tabs.map(({ key, label, icon: Icon }) => <button className={active === key ? "active" : ""} key={key} onClick={() => setActive(key)}><Icon size={17} />{label}</button>)}</div>
    <Card className="admin-content">
      <div className="admin-toolbar"><div><h2>{tab.label}</h2><p>Manage your {tab.label.toLowerCase()} and keep the gym moving.</p></div><Button onClick={showForm ? closeForm : openCreate}>{showForm ? <><X size={17} /> Cancel</> : <><Plus size={17} /> Add {tab.singular}</>}</Button></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "24px 0" }}>{stats.map(([label, value]) => <div key={label} style={{ padding: "15px 17px", background: "#ece9e1", border: "1px solid var(--line)" }}><small style={{ display: "block", color: "var(--muted)", font: "10px DM Mono", textTransform: "uppercase" }}>{label}</small><strong style={{ display: "block", marginTop: 7, font: "500 22px Space Grotesk" }}>{value}</strong></div>)}</div>
      {showForm && <form className="admin-form" onSubmit={save}>{formConfig[active].map(renderField)}<div style={{ display: "flex", alignItems: "end", gap: 10 }}><Button type="submit" disabled={saving}>{saving ? <><LoaderCircle size={16} className="spin" /> Saving…</> : <><Check size={16} /> {editingId ? "Save changes" : "Create record"}</>}</Button></div></form>}
      {(error || notice) && <div style={{ margin: "18px 0", padding: "12px 14px", color: error ? "#bf351f" : "#487a26", background: error ? "#fbe4da" : "#e7f1d8", fontSize: 13 }}>{error || notice}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 0" }}><div className="field" style={{ flex: 1, position: "relative" }}><Search size={16} style={{ position: "absolute", left: 13, bottom: 13, color: "var(--muted)" }} /><input aria-label={`Search ${tab.label}`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={`Search ${tab.label.toLowerCase()}…`} style={{ paddingLeft: 38 }} /></div><span style={{ color: "var(--muted)", font: "11px DM Mono", whiteSpace: "nowrap" }}>{filteredRows.length} result{filteredRows.length === 1 ? "" : "s"}</span></div>
      <div className="table-wrap"><table><thead><tr><th>Name / title</th><th>Details</th><th>Created</th><th>Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" style={{ padding: 40, textAlign: "center" }}><LoaderCircle className="spin" size={20} /></td></tr> : visibleRows.map((row) => { const display = displayValue(active, row, options); return <tr key={row.id}><td><strong>{display.primary}</strong><small>{display.secondary}</small></td><td>{display.detail}</td><td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}</td><td><div style={{ display: "flex", gap: 4 }}><button className="icon-button" onClick={() => openEdit(row)} aria-label={`Edit ${display.primary}`} title="Edit"><Edit3 size={16} /></button><button className="icon-button" onClick={() => remove(row)} disabled={actionId === row.id} aria-label={`Delete ${display.primary}`} title="Delete">{actionId === row.id ? <LoaderCircle className="spin" size={16} /> : <Trash2 size={16} />}</button></div></td></tr>; })}</tbody></table>{!loading && !visibleRows.length && <div className="empty-state">{search ? "No records match your search." : `No ${tab.label.toLowerCase()} yet. Add your first one above.`}</div>}</div>
      {!loading && pageCount > 1 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, color: "var(--muted)", font: "11px DM Mono" }}><span>Page {page} of {pageCount}</span><div style={{ display: "flex", gap: 8 }}><Button variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button variant="outline" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>}
    </Card>
  </div>;
}

