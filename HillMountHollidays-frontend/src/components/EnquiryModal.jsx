import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Search, CheckCircle } from "lucide-react";
import { API } from "./adminComponents/apiHelper";
import { COUNTRIES, INDIA } from "../data/countries";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ── Month Picker ──────────────────────────────────────────── */
const MonthPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white hover:bg-gray-50 focus:border-blue-400 transition outline-none"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || "Month of Travel"}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
          {MONTHS.map((m) => (
            <li key={m}>
              <button
                type="button"
                onClick={() => { onChange(m); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-yellow-50
                  ${value === m ? "bg-yellow-50 font-semibold text-gray-900" : "text-gray-700"}`}
              >
                {m}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const fmtRupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDays  = (n) => `${n} day${n !== 1 ? "s" : ""}`;

/* ── Dual range slider ─────────────────────────────────────── */
const DualRange = ({ min, max, minVal, maxVal, onMin, onMax }) => {
  const pL = ((minVal - min) / (max - min)) * 100;
  const pR = ((maxVal - min) / (max - min)) * 100;
  return (
    <div className="relative" style={{ height: "28px" }}>
      <style>{`
        .dr{-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;position:absolute;width:100%;height:100%;top:0;left:0;margin:0;}
        .dr::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#fff;border:2.5px solid #2563EB;cursor:pointer;pointer-events:all;}
        .dr::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:2.5px solid #2563EB;cursor:pointer;pointer-events:all;border-box:none;}
      `}</style>
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[5px] bg-gray-200 rounded-full">
        <div className="absolute h-full bg-blue-600 rounded-full"
          style={{ left: `${pL}%`, right: `${100 - pR}%` }} />
      </div>
      <input type="range" min={min} max={max} value={minVal}
        className="dr" style={{ zIndex: pL > 50 ? 5 : 3 }}
        onChange={(e) => onMin(Math.min(+e.target.value, maxVal - 1))} />
      <input type="range" min={min} max={max} value={maxVal}
        className="dr" style={{ zIndex: pL > 50 ? 4 : 5 }}
        onChange={(e) => onMax(Math.max(+e.target.value, minVal + 1))} />
    </div>
  );
};

/* ── Country Code Picker ───────────────────────────────────── */
const CountryPicker = ({ selected, onChange }) => {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setSearch(""); }}
        className="flex items-center gap-1.5 px-3 h-full border-r border-gray-300 bg-white hover:bg-gray-50 transition"
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        <span className="text-sm text-gray-700 font-medium">{selected.dial}</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="flex-1 text-sm outline-none placeholder-gray-400"
            />
          </div>
          {/* List */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No results</li>
            )}
            {filtered.map((c) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-yellow-50 transition text-left
                    ${selected.name === c.name ? "bg-yellow-50 font-semibold" : ""}`}
                >
                  <span className="text-xl leading-none w-7 text-center">{c.flag}</span>
                  <span className="flex-1 text-gray-800">{c.name}</span>
                  <span className="text-gray-400 text-xs">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ── Main Modal ────────────────────────────────────────────── */
const EnquiryModal = ({ isOpen, onClose }) => {
  const [name,        setName]        = useState("");
  const [phone,       setPhone]       = useState("");
  const [country,     setCountry]     = useState(INDIA);
  const [email,       setEmail]       = useState("");
  const [desc,        setDesc]        = useState("");
  const [showExtra,   setShowExtra]   = useState(true);
  const [destination, setDestination] = useState("");
  const [month,       setMonth]       = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetMin,     setBudgetMin]     = useState(24000);
  const [budgetMax,     setBudgetMax]     = useState(1350000);
  const [daysEnabled,   setDaysEnabled]   = useState(false);
  const [daysMin,       setDaysMin]       = useState(3);
  const [daysMax,       setDaysMax]       = useState(50);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");

  const canSubmit = name.trim() && phone.trim() && email.trim() && !loading;

  // Auto-close after success
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => { setSuccess(false); onClose(); }, 3000);
    return () => clearTimeout(t);
  }, [success, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName(""); setPhone(""); setCountry(INDIA); setEmail(""); setDesc("");
    setDestination(""); setMonth("");
    setBudgetEnabled(false); setBudgetMin(24000); setBudgetMax(1350000);
    setDaysEnabled(false); setDaysMin(3); setDaysMax(50);
    setError("");
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, countryDial: country.dial, email, desc,
          destination, month,
          budgetMin: budgetEnabled ? budgetMin : null,
          budgetMax: budgetEnabled ? budgetMax : null,
          daysMin:   daysEnabled   ? daysMin   : null,
          daysMax:   daysEnabled   ? daysMax   : null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to send.");
      setSuccess(true);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition";

  /* Success screen */
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
        <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col items-center justify-center py-16 px-8 text-center">
          <CheckCircle size={56} className="text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Enquiry Sent!</h3>
          <p className="text-sm text-gray-500">We'll get back to you shortly. This window will close automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "95vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">Quick Enquiry</h2>
          <button onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 pb-4 space-y-3">
          <form id="enquiry-form" onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name */}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full Name*" required className={inputCls} />

            {/* Mobile with country picker */}
            <div className="flex border border-gray-300 rounded-lg overflow-visible focus-within:border-blue-400 transition relative">
              <CountryPicker selected={country} onChange={setCountry} />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile No.*" required
                className="flex-1 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-white rounded-r-lg" />
            </div>

            {/* Email */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ID*" required className={inputCls} />

            {/* Description */}
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Drop us a small description" rows={3}
              className={`${inputCls} resize-y`} />

            {/* Optional section */}
            <div className="border-t border-dashed border-gray-300 pt-3">
              <p className="text-xs text-gray-500 leading-relaxed mb-2">
                Would you like to share more info? It will help us curate the best tours for you.{" "}
                <span className="italic">(Optional)</span>
              </p>
              <button type="button"
                onClick={() => setShowExtra((s) => !s)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-900 underline underline-offset-2">
                Additional Details
                {showExtra ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {showExtra && (
              <div className="space-y-4 pt-1">
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destinations" className={inputCls} />

                <MonthPicker value={month} onChange={setMonth} />

                {/* Budget */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                    <input
                      type="checkbox"
                      checked={budgetEnabled}
                      onChange={(e) => setBudgetEnabled(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-800">Your Budget for the Trip?</span>
                  </label>
                  {budgetEnabled && (
                    <>
                      <DualRange min={24000} max={1350000}
                        minVal={budgetMin} maxVal={budgetMax}
                        onMin={setBudgetMin} onMax={setBudgetMax} />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs font-semibold text-gray-700">Min. {fmtRupee(budgetMin)}</span>
                        <span className="text-xs font-semibold text-gray-700">Max. {fmtRupee(budgetMax)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                    <input
                      type="checkbox"
                      checked={daysEnabled}
                      onChange={(e) => setDaysEnabled(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-800">You will be travelling for?</span>
                  </label>
                  {daysEnabled && (
                    <>
                      <DualRange min={3} max={50}
                        minVal={daysMin} maxVal={daysMax}
                        onMin={setDaysMin} onMax={setDaysMax} />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs font-semibold text-gray-700">Min. {fmtDays(daysMin)}</span>
                        <span className="text-xs font-semibold text-gray-700">Max. {fmtDays(daysMax)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
          </form>
        </div>

        {/* Sticky submit */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0">
          <button
            type="submit"
            form="enquiry-form"
            disabled={!canSubmit}
            className={`w-full font-semibold py-3.5 rounded-xl text-sm transition
              ${canSubmit
                ? "bg-[#1E88E5] hover:bg-[#084298] text-white hover:text-white cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {loading ? "Sending…" : "Submit Enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
