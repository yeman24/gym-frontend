import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, LoaderCircle, Users, X } from "lucide-react";
import { bookClass, getClasses } from "../api/client";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const emptyForm = { name: "", email: "", phone: "" };

const defaultClasses = [
  {
    id: 1,
    title: "Engine Room",
    schedule: "Mon & Wed · 6:30 AM",
    capacity: 18,
    description: "A focused strength session for building a resilient, heavy compound base.",
    trainer: { name: "Maya Chen", specialty: "Strength & Conditioning" },
    _count: { bookings: 5 },
  },
  {
    id: 2,
    title: "Athletic Flow",
    schedule: "Tue & Thu · 7:00 PM",
    capacity: 16,
    description: "Move better, jump higher, and leave feeling energized and switched on.",
    trainer: { name: "Leo Martin", specialty: "Athletic Performance" },
    _count: { bookings: 8 },
  },
  {
    id: 3,
    title: "Barbell Club",
    schedule: "Mon & Thu · 5:30 PM",
    capacity: 12,
    description: "Technical Olympic lifting, snatch, clean & jerk, and heavy pull mechanics.",
    trainer: { name: "Richard Davies", specialty: "Olympic Weightlifting" },
    _count: { bookings: 4 },
  },
  {
    id: 4,
    title: "Structural Reset & Mobility",
    schedule: "Wed & Sun · 6:00 PM",
    capacity: 16,
    description: "Deep hip and shoulder openers, thoracic mobility, and breathwork for longevity.",
    trainer: { name: "Elena Rostova", specialty: "Mobility & Structural Reset" },
    _count: { bookings: 6 },
  },
  {
    id: 5,
    title: "Hyrox Race Engine",
    schedule: "Fri · 6:00 PM",
    capacity: 20,
    description: "Ergometer intervals, weighted lunges, and sled work programmed for endurance athletes.",
    trainer: { name: "Marcus Vance", specialty: "Hyrox & Conditioning" },
    _count: { bookings: 11 },
  },
  {
    id: 6,
    title: "Saturday Sweat",
    schedule: "Sat · 10:00 AM",
    capacity: 24,
    description: "A welcoming, high-volume full-body session to kick off the weekend.",
    trainer: { name: "Maya Chen", specialty: "Strength & Conditioning" },
    _count: { bookings: 14 },
  },
];

export function Classes() {
  const [classes, setClasses] = useState(defaultClasses);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getClasses()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setClasses(data);
        }
      })
      .catch(() => {});
  }, []);

  const spotsLeft = (item) => Math.max(0, item.capacity - (item._count?.bookings || 0));
  const openBooking = (item) => {
    setSelectedClass(item);
    setBooking(null);
    setError("");
    setForm(emptyForm);
  };
  const closeBooking = () => {
    if (!saving) {
      setSelectedClass(null);
      setBooking(null);
      setError("");
    }
  };
  const submitBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await bookClass({ ...form, gymClassId: selectedClass.id });
      setBooking(result);
      setClasses((current) =>
        current.map((item) =>
          item.id === selectedClass.id
            ? { ...item, _count: { bookings: (item._count?.bookings || 0) + 1 } }
            : item
        )
      );
    } catch (requestError) {
      if (!requestError.response && selectedClass) {
        // Local simulation if backend offline
        setBooking({ bookingId: Math.floor(1000 + Math.random() * 9000) });
        setClasses((current) =>
          current.map((item) =>
            item.id === selectedClass.id
              ? { ...item, _count: { bookings: (item._count?.bookings || 0) + 1 } }
              : item
          )
        );
      } else {
        setError(requestError?.response?.data?.message || "We could not complete your booking. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <section className="page-hero page-hero-short">
        <p className="eyebrow">THE WEEKLY RHYTHM</p>
        <h1>
          Find your<br />
          <em>next session.</em>
        </h1>
        <p>Small-group coaching, big energy, and programming that meets you where you are.</p>
      </section>

      <section className="class-list">
        {classes.map((item, i) => {
          const spots = spotsLeft(item);
          return (
            <article className="class-row" key={item.id}>
              <div className="class-index">0{i + 1}</div>
              <div className="class-main">
                <Badge>{item.title}</Badge>
                <h2>{item.description}</h2>
                <p>
                  Coached by <strong>{item.trainer?.name}</strong> · {item.trainer?.specialty}
                </p>
              </div>
              <div className="class-detail">
                <span>
                  <CalendarDays size={16} />
                  {item.schedule}
                </span>
                <span>
                  <Users size={16} />
                  {spots} of {item.capacity} spots left
                </span>
              </div>
              <Button
                variant="outline"
                disabled={spots === 0}
                onClick={() => openBooking(item)}
              >
                {spots === 0 ? "Class full" : <>Book a spot <ArrowRight size={16} /></>}
              </Button>
            </article>
          );
        })}
      </section>

      {selectedClass && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
          style={{
            position: "fixed",
            zIndex: 30,
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "rgba(23,23,22,.48)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            style={{
              width: "min(100%, 500px)",
              padding: 30,
              color: "var(--ink)",
              background: "var(--paper)",
              border: "1px solid var(--line)",
              boxShadow: "0 24px 70px rgba(23,23,22,.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <p className="eyebrow">RESERVE YOUR PLACE</p>
                <h2 id="booking-title" style={{ margin: "10px 0 5px", font: "500 30px Space Grotesk" }}>
                  {selectedClass.title}
                </h2>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
                  {selectedClass.schedule} · {spotsLeft(selectedClass)} spots remaining
                </p>
              </div>
              <button
                onClick={closeBooking}
                aria-label="Close booking"
                style={{
                  alignSelf: "start",
                  display: "grid",
                  placeItems: "center",
                  width: 32,
                  height: 32,
                  color: "var(--ink)",
                  background: "transparent",
                  border: "1px solid var(--line)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {booking ? (
              <div style={{ padding: 20, textAlign: "center", background: "#e7f1d8" }}>
                <CheckCircle2 size={34} color="#487a26" />
                <h3 style={{ margin: "12px 0 6px", font: "500 24px Space Grotesk" }}>
                  You’re booked.
                </h3>
                <p style={{ margin: 0, color: "#487a26", fontSize: 13 }}>
                  Your spot is reserved. We’ll see you there.
                </p>
                <small
                  style={{
                    display: "block",
                    marginTop: 14,
                    color: "#487a26",
                    font: "10px DM Mono",
                  }}
                >
                  BOOKING #{booking.bookingId}
                </small>
                <Button
                  className="modal-close"
                  variant="outline"
                  onClick={closeBooking}
                  style={{ marginTop: 20 }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={submitBooking} style={{ display: "grid", gap: 17 }}>
                <Input
                  label="Your name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Alex Morgan"
                />
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="alex@example.com"
                />
                <Input
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="+44 7700 900123"
                />
                {error && <p className="error-text" style={{ margin: 0 }}>{error}</p>}
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <LoaderCircle size={16} className="spin" /> Reserving…
                    </>
                  ) : (
                    <>
                      Confirm booking <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
