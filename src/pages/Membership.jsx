import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { getPlans } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { money } from "../lib/utils";

const defaultPlans = [
  {
    id: 1,
    name: "Day Pass",
    price: 18,
    durationInDays: 1,
    features: "Full day open gym access|Locker & towel service|Complimentary post-workout shake|Locker room & sauna access",
    description: "Single-session access with total freedom to train on your own terms.",
    isPopular: false,
  },
  {
    id: 2,
    name: "Foundation",
    price: 45,
    durationInDays: 30,
    features: "24/7 gym access|All strength & cardio equipment|Induction & form screening|Locker room & sauna access",
    description: "Everything you need to build consistent, sustainable training habits.",
    isPopular: false,
  },
  {
    id: 3,
    name: "Performance",
    price: 75,
    durationInDays: 30,
    features: "Everything in Foundation|Unlimited coach-led classes|Monthly 1-on-1 PT check-in|IronHouse training app access",
    description: "For people ready to make meaningful, structured strength progress.",
    isPopular: true,
  },
  {
    id: 4,
    name: "Athlete Pro",
    price: 115,
    durationInDays: 30,
    features: "Everything in Performance|4 1-on-1 coaching sessions|Recovery suite & cold plunge|Custom nutrition & programming",
    description: "The complete IronHouse experience designed for dedicated athletes.",
    isPopular: false,
  },
];

export function Membership() {
  const [plans, setPlans] = useState(defaultPlans);

  useEffect(() => {
    getPlans()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlans(data);
        }
      })
      .catch(() => {});
  }, []);

  const getPlanDescription = (plan, i) => {
    if (plan.description) return plan.description;
    const lower = plan.name.toLowerCase();
    if (lower.includes("day") || lower.includes("pass") || lower.includes("drop")) {
      return "Single-session access with total freedom to train on your own terms.";
    }
    if (lower.includes("foundation")) {
      return "Everything you need to build consistent, sustainable training habits.";
    }
    if (lower.includes("performance")) {
      return "For people ready to make meaningful, structured strength progress.";
    }
    if (lower.includes("athlete")) {
      return "The complete IronHouse experience designed for dedicated athletes.";
    }
    return i === 0
      ? "Everything you need to make training a habit."
      : i === 1
      ? "For people ready to make meaningful progress."
      : "The complete IronHouse experience.";
  };

  const isFeaturedPlan = (plan, i) => {
    if (plan.isPopular) return true;
    if (plan.name.toLowerCase().includes("performance")) return true;
    return false;
  };

  return (
    <div>
      <section className="page-hero">
        <p className="eyebrow">MEMBERSHIPS</p>
        <h1>
          Choose your<br />
          <em>commitment.</em>
        </h1>
        <p>Good training is an investment in every version of your future self.</p>
      </section>

      <section className="plans-grid">
        {plans.map((plan, i) => {
          const featured = isFeaturedPlan(plan, i);
          const period = plan.durationInDays === 1 ? "/ day" : "/ month";
          return (
            <Card className={featured ? "plan-card featured" : "plan-card"} key={plan.id}>
              {featured && <span className="popular">MOST POPULAR</span>}
              <div className="plan-top">
                <span>0{i + 1}</span>
                <span>{plan.durationInDays} {plan.durationInDays === 1 ? "DAY" : "DAYS"}</span>
              </div>
              <h2>{plan.name}</h2>
              <p className="plan-description">{getPlanDescription(plan, i)}</p>
              <div className="price">
                <strong>{money(plan.price)}</strong>
                <span>{period}</span>
              </div>
              <ul>
                {plan.features.split("|").map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant={featured ? "primary" : "outline"}>
                  Get started <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

