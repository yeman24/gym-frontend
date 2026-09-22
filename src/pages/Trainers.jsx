import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getTrainers } from "../api/client";
import { imageFallback } from "../lib/utils";

export function Trainers() { const [trainers, setTrainers] = useState([]); useEffect(() => { getTrainers().then(setTrainers).catch(() => {}); }, []); return <div><section className="page-hero page-hero-short"><p className="eyebrow">THE PEOPLE BEHIND THE WORK</p><h1>Meet your<br /><em>coaches.</em></h1><p>Good coaching gives you the confidence to do more than you thought you could.</p></section><section className="trainer-grid">{trainers.map((trainer) => <article className="trainer-card" key={trainer.id}><div className="trainer-photo" style={{ backgroundImage: `url(${trainer.photoUrl || imageFallback})` }}><span>{trainer.specialty}</span></div><div className="trainer-info"><h2>{trainer.name}</h2><p>{trainer.bio}</p><a href="mailto:hello@ironhouse.fit">Work with {trainer.name.split(" ")[0]} <ArrowUpRight size={15} /></a></div></article>)}</section></div>; }
