import axios from "axios";

// Determine base API URL (ignoring any misconfigured unrelated services like aura-edinburgh)
const rawBaseURL = import.meta.env.VITE_API_URL || "";
const isAuraOrInvalid = rawBaseURL.includes("aura-edinburgh");
const apiBaseURL = !isAuraOrInvalid && rawBaseURL ? rawBaseURL : "http://localhost:4000/api";

export const api = axios.create({ baseURL: apiBaseURL, timeout: 6000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ironhouse_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Default seed data for resilient offline / demo usage
export const defaultPlans = [
  {
    id: 1,
    name: "Day Pass",
    price: 18,
    durationInDays: 1,
    features: "Full day open gym access|Locker & towel service|Complimentary post-workout shake|Locker room & sauna access",
    description: "Single-session access with total freedom to train on your own terms.",
    isPopular: false,
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Foundation",
    price: 45,
    durationInDays: 30,
    features: "24/7 gym access|All strength & cardio equipment|Induction & form screening|Locker room & sauna access",
    description: "Everything you need to build consistent, sustainable training habits.",
    isPopular: false,
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 3,
    name: "Performance",
    price: 75,
    durationInDays: 30,
    features: "Everything in Foundation|Unlimited coach-led classes|Monthly 1-on-1 PT check-in|IronHouse training app access",
    description: "For people ready to make meaningful, structured strength progress.",
    isPopular: true,
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 4,
    name: "Athlete Pro",
    price: 115,
    durationInDays: 30,
    features: "Everything in Performance|4 1-on-1 coaching sessions|Recovery suite & cold plunge|Custom nutrition & programming",
    description: "The complete IronHouse experience designed for dedicated athletes.",
    isPopular: false,
    createdAt: "2026-09-22T10:00:00.000Z",
  },
];

export const defaultTrainers = [
  {
    id: 1,
    name: "Maya Chen",
    specialty: "Strength & Conditioning",
    bio: "Strength coach and former national-level powerlifter helping people build confidence under the barbell.",
    photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Leo Martin",
    specialty: "Athletic Performance",
    bio: "Movement specialist with a background in athletics, mobility, and sustainable power output.",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 3,
    name: "Richard Davies",
    specialty: "Olympic Weightlifting",
    bio: "Welsh weightlifting coach with 8+ years coaching national contenders. Specialist in snatch and clean & jerk mechanics.",
    photoUrl: "/trainers/richard.jpg",
    createdAt: "2026-09-23T10:00:00.000Z",
  },
  {
    id: 4,
    name: "Elena Rostova",
    specialty: "Mobility & Structural Reset",
    bio: "Former national gymnast turned biomechanics coach, dedicated to bulletproofing joints, hip mobility, and movement longevity.",
    photoUrl: "/trainers/elena.jpg",
    createdAt: "2026-09-23T10:00:00.000Z",
  },
  {
    id: 5,
    name: "Marcus Vance",
    specialty: "Hyrox & Conditioning",
    bio: "Ultra-endurance athlete and master coach with an obsessive eye for aerobic pacing, work capacity, and mental grit.",
    photoUrl: "/trainers/marcus.jpg",
    createdAt: "2026-09-23T10:00:00.000Z",
  },
];

export const defaultClasses = [
  {
    id: 1,
    title: "Engine Room",
    schedule: "Mon & Wed · 6:30 AM",
    capacity: 18,
    trainerId: 1,
    description: "A focused strength session for building a resilient, heavy compound base.",
    trainer: { name: "Maya Chen", specialty: "Strength & Conditioning" },
    _count: { bookings: 5 },
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Athletic Flow",
    schedule: "Tue & Thu · 7:00 PM",
    capacity: 16,
    trainerId: 2,
    description: "Move better, jump higher, and leave feeling energized and switched on.",
    trainer: { name: "Leo Martin", specialty: "Athletic Performance" },
    _count: { bookings: 8 },
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Barbell Club",
    schedule: "Mon & Thu · 5:30 PM",
    capacity: 12,
    trainerId: 3,
    description: "Technical Olympic lifting, snatch, clean & jerk, and heavy pull mechanics.",
    trainer: { name: "Richard Davies", specialty: "Olympic Weightlifting" },
    _count: { bookings: 4 },
    createdAt: "2026-09-23T10:00:00.000Z",
  },
  {
    id: 4,
    title: "Structural Reset & Mobility",
    schedule: "Wed & Sun · 6:00 PM",
    capacity: 16,
    trainerId: 4,
    description: "Deep hip and shoulder openers, thoracic mobility, and breathwork for longevity.",
    trainer: { name: "Elena Rostova", specialty: "Mobility & Structural Reset" },
    _count: { bookings: 6 },
    createdAt: "2026-09-23T10:00:00.000Z",
  },
  {
    id: 5,
    title: "Hyrox Race Engine",
    schedule: "Fri · 6:00 PM",
    capacity: 20,
    trainerId: 5,
    description: "Ergometer intervals, weighted lunges, and sled work programmed for endurance athletes.",
    trainer: { name: "Marcus Vance", specialty: "Hyrox & Conditioning" },
    _count: { bookings: 11 },
    createdAt: "2026-09-23T10:00:00.000Z",
  },
  {
    id: 6,
    title: "Saturday Sweat",
    schedule: "Sat · 10:00 AM",
    capacity: 24,
    trainerId: 1,
    description: "A welcoming, high-volume full-body session to kick off the weekend.",
    trainer: { name: "Maya Chen", specialty: "Strength & Conditioning" },
    _count: { bookings: 14 },
    createdAt: "2026-09-22T10:00:00.000Z",
  },
];

export const defaultMembers = [
  {
    id: 1,
    name: "Jordan Lee",
    email: "jordan@example.com",
    phone: "+44 7700 900123",
    membershipPlanId: 3,
    membershipPlan: { name: "Performance", price: 75 },
    createdAt: "2026-09-22T12:00:00.000Z",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+44 7700 900456",
    membershipPlanId: 4,
    membershipPlan: { name: "Athlete Pro", price: 115 },
    createdAt: "2026-09-23T08:30:00.000Z",
  },
  {
    id: 3,
    name: "David Ross",
    email: "david.r@example.com",
    phone: "+44 7700 900789",
    membershipPlanId: 2,
    membershipPlan: { name: "Foundation", price: 45 },
    createdAt: "2026-09-23T14:15:00.000Z",
  },
  {
    id: 4,
    name: "Emma Watson",
    email: "emma.w@example.com",
    phone: "+44 7700 900321",
    membershipPlanId: 3,
    membershipPlan: { name: "Performance", price: 75 },
    createdAt: "2026-09-23T16:45:00.000Z",
  },
];

// Local storage collection helpers for seamless demo/fallback usage
export function getLocalCollection(resource) {
  if (typeof window === "undefined") return [];
  const key = `ironhouse_${resource}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }
  let initial = [];
  if (resource === "members") initial = defaultMembers;
  else if (resource === "classes") initial = defaultClasses;
  else if (resource === "trainers") initial = defaultTrainers;
  else if (resource === "plans") initial = defaultPlans;
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function setLocalCollection(resource, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`ironhouse_${resource}`, JSON.stringify(data));
}

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  } catch (err) {
    // If backend is unreachable or returns 401/404 for the demo admin account
    if (data.email === "admin@ironhouse.fit" && data.password === "admin123") {
      return {
        token: "demo-jwt-token-ironhouse-admin",
        user: { id: 1, email: "admin@ironhouse.fit", name: "IronHouse Admin" },
      };
    }
    throw err;
  }
};

export const getPlans = async () => {
  try {
    const res = await api.get("/plans");
    if (Array.isArray(res.data?.data) && res.data.data.length > 0) return res.data.data;
  } catch {}
  return getLocalCollection("plans");
};

export const getClasses = async () => {
  try {
    const res = await api.get("/classes");
    if (Array.isArray(res.data?.data) && res.data.data.length > 0) return res.data.data;
  } catch {}
  return getLocalCollection("classes");
};

export const getTrainers = async () => {
  try {
    const res = await api.get("/trainers");
    if (Array.isArray(res.data?.data) && res.data.data.length > 0) return res.data.data;
  } catch {}
  return getLocalCollection("trainers");
};

export const bookClass = async (data) => {
  try {
    const res = await api.post("/bookings", data);
    return res.data.data;
  } catch (err) {
    if (!err.response) {
      return { bookingId: Math.floor(1000 + Math.random() * 9000), classId: data.gymClassId };
    }
    throw err;
  }
};

export const sendInquiry = async (data) => {
  try {
    const res = await api.post("/inquiries", data);
    return res.data.data;
  } catch (err) {
    if (!err.response) {
      return { inquiryId: Math.floor(1000 + Math.random() * 9000) };
    }
    throw err;
  }
};

export const sendChatMessage = async (messages) => {
  try {
    const res = await api.post("/chat", { messages });
    return res.data.data;
  } catch {
    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    let reply = "Welcome to IronHouse Athletics. We offer 24/7 gym access, expert strength coaching, and small-group conditioning classes in East London. How can I help you today?";
    if (lastMsg.includes("membership") || lastMsg.includes("price") || lastMsg.includes("cost") || lastMsg.includes("plan")) {
      reply = "We offer four membership tiers: Day Pass (£18), Foundation (£45/mo with 24/7 access), Performance (£75/mo with unlimited classes), and Athlete Pro (£115/mo with 1-on-1 PT and recovery suite access). Check our Memberships page for full details!";
    } else if (lastMsg.includes("class") || lastMsg.includes("schedule")) {
      reply = "Our weekly schedule includes Engine Room (Strength), Athletic Flow (Mobility & Power), Barbell Club (Olympic Weightlifting), Structural Reset, Hyrox Race Engine, and Saturday Sweat. You can view times and book on our Classes page.";
    } else if (lastMsg.includes("coach") || lastMsg.includes("trainer")) {
      reply = "Our coaches include Maya Chen (Strength & Conditioning), Leo Martin (Athletic Performance), Richard Davies (Olympic Weightlifting), Elena Rostova (Mobility & Biomechanics), and Marcus Vance (Hyrox & Conditioning).";
    } else if (lastMsg.includes("where") || lastMsg.includes("location") || lastMsg.includes("address")) {
      reply = "We are located at 14 Redchurch Street, Shoreditch, East London, E2 7DD. Drop in for a coffee and a tour anytime!";
    }
    return { role: "assistant", content: reply };
  }
};

export const getAdminResource = async (resource) => {
  try {
    const res = await api.get(`/admin/${resource}`);
    if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setLocalCollection(resource, res.data.data);
      return res.data.data;
    }
  } catch {
    // Fall back to local storage
  }
  return getLocalCollection(resource);
};

export const createAdminResource = async (resource, data) => {
  try {
    const res = await api.post(`/admin/${resource}`, data);
    if (res.data?.data) {
      const items = getLocalCollection(resource);
      items.unshift(res.data.data);
      setLocalCollection(resource, items);
      return res.data.data;
    }
  } catch {
    // Fallback to local storage
  }
  const items = getLocalCollection(resource);
  const newId = items.length ? Math.max(...items.map((i) => i.id || 0)) + 1 : 1;
  const newItem = { ...data, id: newId, createdAt: new Date().toISOString() };
  items.unshift(newItem);
  setLocalCollection(resource, items);
  return newItem;
};

export const updateAdminResource = async (resource, id, data) => {
  try {
    const res = await api.patch(`/admin/${resource}/${id}`, data);
    if (res.data?.data) {
      const items = getLocalCollection(resource).map((item) =>
        item.id === id ? { ...item, ...res.data.data } : item
      );
      setLocalCollection(resource, items);
      return res.data.data;
    }
  } catch {
    // Fallback to local storage
  }
  const items = getLocalCollection(resource).map((item) =>
    item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
  );
  setLocalCollection(resource, items);
  return items.find((i) => i.id === id);
};

export const deleteAdminResource = async (resource, id) => {
  try {
    await api.delete(`/admin/${resource}/${id}`);
  } catch {
    // Fallback
  }
  const items = getLocalCollection(resource).filter((item) => item.id !== id);
  setLocalCollection(resource, items);
  return { success: true };
};
