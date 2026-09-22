import { ArrowDown, ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export function Home() { return <>
  <section className="hero"><div className="hero-copy"><Badge>EST. 2014 · EAST LONDON</Badge><h1>Build a body<br /><em>that lasts.</em></h1><p className="hero-sub">A considered training space for people who are ready to take their strength, health, and life seriously.</p><div className="hero-actions"><Link to="/membership"><Button>Find your membership <ArrowRight size={17} /></Button></Link><a href="#story" className="text-link">See what we’re about <ArrowDown size={16} /></a></div></div><div className="hero-image"><div className="image-caption"><span>01 / 03</span><span>Strength floor · 06:42</span></div></div></section>
  <section className="ticker"><span>TRAIN WITH INTENT</span><span>MOVE WITH PURPOSE</span><span>LIVE WITH ENERGY</span><span>TRAIN WITH INTENT</span></section>
  <section className="section split-section" id="story"><div><p className="eyebrow">THE IRONHOUSE WAY</p><h2>More than a gym.<br /><em>Your place to grow.</em></h2></div><div className="section-copy"><p>We believe training should make the rest of your life feel better. That means expert coaching, excellent equipment, and a community that keeps showing up.</p><p>No ego. No quick fixes. Just the right environment to do your best work — whatever that looks like for you.</p><Link className="arrow-link" to="/classes">Explore our classes <ArrowRight size={16} /></Link></div></section>
  <section className="feature-band"><div className="feature-stat"><strong>10<span>+</span></strong><span>years of<br />showing up</span></div><div className="feature-stat"><strong>24<span>/7</span></strong><span>access to<br />your progress</span></div><div className="feature-stat"><strong>42</strong><span>weekly<br />classes</span></div></section>
  <section className="section quote-section"><Quote size={34} /><blockquote>“The first place I’ve trained where getting stronger feels like a part of my life, not a punishment.”</blockquote><span className="quote-byline">— ALEX, MEMBER SINCE 2019</span></section>
  <section className="cta-band"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Make your next move<br /><em>your strongest one.</em></h2></div><Link to="/contact"><Button variant="outline">Come and see us <ArrowUpRight size={17} /></Button></Link></section>
</>; }
