import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { getPlans } from "../api/client";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { money } from "../lib/utils";

export function Membership() { const [plans, setPlans] = useState([]); useEffect(() => { getPlans().then(setPlans).catch(() => {}); }, []); return <div><section className="page-hero"><p className="eyebrow">MEMBERSHIPS</p><h1>Choose your<br /><em>commitment.</em></h1><p>Good training is an investment in every version of your future self.</p></section><section className="plans-grid">{plans.map((plan, i) => <Card className={i === 1 ? "plan-card featured" : "plan-card"} key={plan.id}>{i === 1 && <span className="popular">MOST POPULAR</span>}<div className="plan-top"><span>0{i + 1}</span><span>{plan.durationInDays} DAYS</span></div><h2>{plan.name}</h2><p className="plan-description">{i === 0 ? "Everything you need to make training a habit." : i === 1 ? "For people ready to make meaningful progress." : "The complete IronHouse experience."}</p><div className="price"><strong>{money(plan.price)}</strong><span>/ month</span></div><ul>{plan.features.split("|").map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul><Link to="/contact"><Button variant={i === 1 ? "primary" : "outline"}>Get started <ArrowRight size={16} /></Button></Link></Card>)}</section></div>; }
