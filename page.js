"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, Dog, Cat, ChevronRight, Pencil, X } from "lucide-react";
import { saveBookingDraft } from "../bookingStore";

const initialConfig = {
  weightTiers: [
    { id: "t1", label: "เล็ก", max: 10 },
    { id: "t2", label: "กลาง", max: 20 },
    { id: "t3", label: "ใหญ่", max: 999 },
  ],
  services: [
    { id: "bath", label: "อาบน้ำ", prices: { dog: { t1: 250, t2: 350, t3: 500 }, cat: { t1: 300, t2: 400, t3: 550 } } },
    { id: "bathcut", label: "อาบน้ำและตัดขน", prices: { dog: { t1: 450, t2: 650, t3: 900 }, cat: { t1: 500, t2: 700, t3: 950 } } },
    { id: "spa", label: "สปาขน", prices: { dog: { t1: 550, t2: 750, t3: 1000 }, cat: { t1: 600, t2: 800, t3: 1050 } } },
  ],
  details: [
    { id: "nails", label: "ตัดเล็บ", prices: { dog: 100, cat: 120 } },
    { id: "trimtail", label: "ไถขนก้น", prices: { dog: 80, cat: 80 } },
    { id: "glands", label: "บีบต่อม", prices: { dog: 100, cat: 100 } },
    { id: "ears", label: "เช็ดหู", prices: { dog: 60, cat: 60 } },
    { id: "teeth", label: "แปรงฟัน", prices: { dog: 80, cat: 80 } },
  ],
};

function findTier(weight, tiers) {
  return tiers.find((t) => weight <= t.max) || tiers[tiers.length - 1];
}

function EditablePrice({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const n = Number(draft);
    if (!isNaN(n) && n >= 0) onChange(n);
    else setDraft(String(value));
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        style={{ width: 64, fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, textAlign: "right", border: "1.5px solid #7FA88C", borderRadius: 8, padding: "3px 6px", color: "#2E3A32" }}
      />
    );
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, color: "#2E3A32" }}
    >
      {value.toLocaleString()} บาท
      <Pencil size={11} color="#B8B0A2" />
    </button>
  );
}

export default function ServiceSelectPage() {
  const router = useRouter();
  const [config, setConfig] = useState(initialConfig);
  const [petType, setPetType] = useState("dog");
  const [weight, setWeight] = useState(15);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);

  const tier = useMemo(() => findTier(weight, config.weightTiers), [weight, config.weightTiers]);

  const servicePrice = useMemo(() => {
    if (!selectedService) return 0;
    const svc = config.services.find((s) => s.id === selectedService);
    return svc ? svc.prices[petType][tier.id] : 0;
  }, [selectedService, petType, tier, config.services]);

  const detailsTotal = useMemo(() => {
    return selectedDetails.reduce((sum, id) => {
      const d = config.details.find((x) => x.id === id);
      return sum + (d ? d.prices[petType] : 0);
    }, 0);
  }, [selectedDetails, petType, config.details]);

  const total = servicePrice + detailsTotal;
  const nothingSelected = !selectedService && selectedDetails.length === 0;

  const toggleDetail = (id) => {
    setSelectedDetails((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const updateServicePrice = (serviceId, newValue) => {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === serviceId ? { ...s, prices: { ...s.prices, [petType]: { ...s.prices[petType], [tier.id]: newValue } } } : s
      ),
    }));
  };

  const updateDetailPrice = (detailId, newValue) => {
    setConfig((prev) => ({
      ...prev,
      details: prev.details.map((d) => (d.id === detailId ? { ...d, prices: { ...d.prices, [petType]: newValue } } : d)),
    }));
  };

  const goNext = () => {
    saveBookingDraft({
      petType,
      weight,
      tier: tier.id,
      selectedService,
      selectedDetails,
      total,
    });
    router.push("/datetime");
  };

  return (
    <div style={{ fontFamily: "'Nithan', 'Noto Sans Thai', sans-serif", background: "#FBF8F3", minHeight: "100vh", maxWidth: 430, margin: "0 auto", color: "#2E3A32", paddingBottom: 130, position: "relative" }}>
      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>เลือกบริการ</div>
        <div style={{ fontSize: 12.5, color: "#8A8377", marginTop: 3 }}>เลือกเฉพาะรายการที่ต้องการ ไม่จำเป็นต้องอาบน้ำทุกครั้ง</div>
      </div>

      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", background: "#F1EEE4", borderRadius: 14, padding: 4, gap: 4 }}>
          {[{ id: "dog", label: "สุนัข", Icon: Dog }, { id: "cat", label: "แมว", Icon: Cat }].map(({ id, label, Icon }) => {
            const active = petType === id;
            return (
              <button key={id} onClick={() => setPetType(id)} style={{ flex: 1, border: "none", borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit", fontWeight: 600, fontSize: 14, background: active ? "#2E3A32" : "transparent", color: active ? "#FBF8F3" : "#8A8377" }}>
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "16px 20px 4px" }}>
        <div style={{ background: "#FFFFFF", borderRadius: 18, padding: 18, border: "1px solid #EFE9DD" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#8A8377" }}>น้ำหนัก</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{weight} <span style={{ fontSize: 13, fontWeight: 400, color: "#8A8377" }}>กก</span></span>
          </div>
          <input type="range" min={1} max={40} value={weight} onChange={(e) => setWeight(Number(e.target.value))} style={{ width: "100%", accentColor: "#7FA88C", height: 4 }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {config.weightTiers.map((t) => (
              <span key={t.id} style={{ fontSize: 12, fontWeight: tier.id === t.id ? 700 : 400, color: tier.id === t.id ? "#E8927C" : "#B8B0A2" }}>{t.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>บริการหลัก</div>
          <span style={{ fontSize: 11.5, color: "#B8B0A2", fontWeight: 500 }}>ไม่บังคับเลือก</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {config.services.map((s) => {
            const active = selectedService === s.id;
            const price = s.prices[petType][tier.id];
            return (
              <div key={s.id} onClick={() => setSelectedService(active ? null : s.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: active ? "#2E3A3210" : "#FFFFFF", border: active ? "1.5px solid #7FA88C" : "1px solid #EFE9DD", borderRadius: 16, padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: active ? "none" : "2px solid #D4CDBF", background: active ? "#7FA88C" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {active && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{s.label}</span>
                </div>
                <EditablePrice value={price} onChange={(v) => updateServicePrice(s.id, v)} />
              </div>
            );
          })}
          {selectedService && (
            <button onClick={() => setSelectedService(null)} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", fontFamily: "inherit", fontSize: 12.5, color: "#8A8377", padding: "2px 2px" }}>
              <X size={12} />
              ไม่เลือกบริการหลัก
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>บริการเสริม</div>
        <div style={{ fontSize: 12.5, color: "#8A8377", marginBottom: 10 }}>เลือกได้หลายรายการ หรือเลือกเฉพาะจุดโดยไม่ต้องมีบริการหลักก็ได้</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {config.details.map((d) => {
            const active = selectedDetails.includes(d.id);
            return (
              <div key={d.id} onClick={() => toggleDetail(d.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: active ? "#E8927C15" : "#FFFFFF", border: active ? "1.5px solid #E8927C" : "1px solid #EFE9DD", borderRadius: 14, padding: "12px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 6, border: active ? "none" : "2px solid #D4CDBF", background: active ? "#E8927C" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {active && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{d.label}</span>
                </div>
                <EditablePrice value={d.prices[petType]} onChange={(v) => updateDetailPrice(d.id, v)} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#FFFFFF", borderTop: "1px solid #EFE9DD", padding: "14px 20px 20px", boxShadow: "0 -4px 16px rgba(46,58,50,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: "#8A8377" }}>ค่าบริการโดยประมาณ {tier.label} {petType === "dog" ? "สุนัข" : "แมว"}</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#2E3A32" }}>{total.toLocaleString()} บาท</span>
        </div>
        <div style={{ fontSize: 11, color: "#B8B0A2", marginBottom: 12 }}>ระบบนี้ใช้สำหรับจองคิวเท่านั้น ชำระเงินที่ร้านตามจริง</div>
        <button disabled={nothingSelected} onClick={goNext} style={{ width: "100%", background: nothingSelected ? "#D4CDBF" : "#E8927C", border: "none", borderRadius: 16, padding: "16px", color: "#FFFFFF", fontSize: 15.5, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: nothingSelected ? "not-allowed" : "pointer" }}>
          เลือกวันเวลา
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
