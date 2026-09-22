import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Users } from "lucide-react";
import { getClasses } from "../api/client";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export function Classes() { const [classes, setClasses] = useState([]); useEffect(() => { getClasses().then(setClasses).catch(() => {}); }, []); return <div><section className="page-hero page-hero-short"><p className="eyebrow">THE WEEKLY RHYTHM</p><h1>Find your<br /><em>next session.</em></h1><p>Small-group coaching, big energy, and programming that meets you where you are.</p></section><section className="class-list">{classes.map((item, i) => <article className="class-row" key={item.id}><div className="class-index">0{i + 1}</div><div className="class-main"><Badge>{item.title}</Badge><h2>{item.description}</h2><p>Coached by <strong>{item.trainer?.name}</strong> · {item.trainer?.specialty}</p></div><div className="class-detail"><span><CalendarDays size={16} />{item.schedule}</span><span><Users size={16} />{item.capacity} spots</span></div><Button variant="outline">Book a spot <ArrowRight size={16} /></Button></article>)}</section></div>; }
