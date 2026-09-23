import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getTrainers } from "../api/client";
import { imageFallback } from "../lib/utils";

const defaultTrainers = [
  {
    id: 1,
    name: "Maya Chen",
    specialty: "Strength & Conditioning",
    bio: "Strength coach and former national-level powerlifter helping people build confidence under the barbell.",
    photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Leo Martin",
    specialty: "Athletic Performance",
    bio: "Movement specialist with a background in athletics, mobility, and sustainable power output.",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Richard Davies",
    specialty: "Olympic Weightlifting",
    bio: "Welsh weightlifting coach with 8+ years coaching national contenders. Specialist in snatch and clean & jerk mechanics.",
    photoUrl: "/trainers/richard.jpg",
  },
  {
    id: 4,
    name: "Elena Rostova",
    specialty: "Mobility & Structural Reset",
    bio: "Former national gymnast turned biomechanics coach, dedicated to bulletproofing joints, hip mobility, and movement longevity.",
    photoUrl: "/trainers/elena.jpg",
  },
  {
    id: 5,
    name: "Marcus Vance",
    specialty: "Hyrox & Conditioning",
    bio: "Ultra-endurance athlete and master coach with an obsessive eye for aerobic pacing, work capacity, and mental grit.",
    photoUrl: "/trainers/marcus.jpg",
  },
];

export function Trainers() {
  const [trainers, setTrainers] = useState(defaultTrainers);

  useEffect(() => {
    getTrainers()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTrainers(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="page-hero page-hero-short">
        <p className="eyebrow">THE PEOPLE BEHIND THE WORK</p>
        <h1>
          Meet your<br />
          <em>coaches.</em>
        </h1>
        <p>Good coaching gives you the confidence to do more than you thought you could.</p>
      </section>

      <section className="trainer-grid">
        {trainers.map((trainer) => (
          <article className="trainer-card" key={trainer.id}>
            <div
              className="trainer-photo"
              style={{ backgroundImage: `url(${trainer.photoUrl || imageFallback})` }}
            >
              <span>{trainer.specialty}</span>
            </div>
            <div className="trainer-info">
              <h2>{trainer.name}</h2>
              <p>{trainer.bio}</p>
              <a href="mailto:hello@ironhouse.fit">
                Work with {trainer.name.split(" ")[0]} <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

