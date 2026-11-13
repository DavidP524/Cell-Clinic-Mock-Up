import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Phone, MessageSquare, MapPin, Menu, X, Star, ShieldCheck, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { address, mapUrl, phone, reviews, services, warranty } from './content';

const servicePhotos = {
  screen: ['/images/screen.jpg', 'A phone with a cracked screen on a blue repair mat', 'Display & touch', 'Cracked glass or a screen that won’t respond?'],
  battery: ['/images/battery.jpg', 'An opened phone on a repair mat', 'Power & performance', 'A battery that won’t last through your day?'],
  water: ['/images/water.jpg', 'Water droplets on the back of a blue phone', 'Liquid damage', 'Ask about a phone exposed to liquid.'],
  charging: ['/images/charging.jpg', 'A charging adapter and cable', 'Connection & charge', 'Loose connection or charging at an angle?'],
  data: ['/images/data.jpg', 'A phone displaying photos on a wooden table', 'Photos & files', 'Important data on a phone that won’t turn on?'],
  board: ['/images/board.jpg', 'Logic board repair under a microscope', 'Board-level repair', 'A closer look at complex device problems.'],
};
const meta = {
  '/': ['Cell Clinic | Phone Repair in Dodge City, KS', 'Local device repair in Dodge City. Explore screen repairs, battery replacements, charging ports and more. Call or text Cell Clinic at 620-253-4986.'],
  '/services': ['Repair Services & Prices | Cell Clinic Dodge City', 'Explore Cell Clinic screen repairs from $89, battery replacements from $49, water damage, charging ports, data recovery and micro-soldering. Call or text.'],
  '/contact': ['Contact & Shop Hours | Cell Clinic Dodge City', 'Visit Cell Clinic at 2500 Central Ave. Suite G, Dodge City, Kansas 67801. See shop hours and directions, or call or text 620-253-4986.'],
  '/privacy': ['Device Privacy | Cell Clinic Dodge City', 'Learn how Cell Clinic respects your device privacy and when a passcode may be needed for diagnostics.'],
};
function Actions({ compact = false }) {
  return <div className={`actions ${compact ? 'compact' : ''}`}><a className="button primary" href="tel:6202534986"><Phone size={18} />{compact ? 'Call' : 'Call 620-253-4986'}</a><a className="button secondary" href="sms:6202534986"><MessageSquare size={18} />{compact ? 'Text' : 'Text us'}</a></div>;
}
function Brand() { return <Link to="/" className="brand" aria-label="Cell Clinic home"><img src="/Logo.png" alt="" width="34" height="61" /><span>Cell Clinic<small>DODGE CITY, KANSAS</small></span></Link>; }
function Navbar() {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('home-hero');
      setOverHero(location.pathname === '/' && !!hero && hero.getBoundingClientRect().bottom > 96);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [location.pathname]);
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className={`site-header ${location.pathname === '/' ? 'home-nav' : ''} ${overHero ? 'over-hero' : ''}`}><div className="container nav-inner"><Brand /><button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation"><NavLink to="/services">Services</NavLink><Link to="/#about" onClick={() => setOpen(false)}>About</Link><Link to="/#faq" onClick={() => setOpen(false)}>FAQ</Link><NavLink to="/contact">Contact</NavLink><Actions compact /></nav></div></header>;
}
function Hours() { return <dl className="hours"><div><dt>Tuesday–Friday</dt><dd>9am–6pm</dd></div><div><dt>Saturday</dt><dd>11am–6pm</dd></div><div><dt>Sunday & Monday</dt><dd>Closed</dd></div></dl>; }
function Footer() { return <footer className="footer"><div className="container footer-grid"><div><Brand /><p>Device repair, right here<br />in Dodge City.</p></div><div><h2>Visit the shop</h2><a href={mapUrl} target="_blank" rel="noreferrer">2500 Central Ave. Suite G<br />Dodge City, Kansas 67801 <ArrowUpRight size={14} /></a><a className="footer-phone" href="tel:6202534986">{phone}</a><a href="sms:6202534986">Send us a text <ArrowUpRight size={14} /></a></div><div><h2>Shop hours</h2><Hours /></div><div><h2>Explore</h2><Link to="/services">Services</Link><Link to="/contact">Contact & directions</Link><Link to="/privacy">Privacy</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Cell Clinic Dodge City.</span><span>Photo by <a href="https://unsplash.com/@yogasdesign" target="_blank" rel="noreferrer">Yoga Sukma</a> on <a href="https://unsplash.com/photos/J_tkqH61vHA" target="_blank" rel="noreferrer">Unsplash</a></span></div></footer>; }
function Heading({ title, children }) { return <div className="section-heading"><h2>{title}</h2>{children}</div>; }
function Rating() { return <span className="rating"><Star size={18} fill="currentColor" /><strong>4.7</strong><span>from 78 Google reviews</span></span>; }
function Trust() { return <div className="trust-bar"><div className="container trust-inner"><Rating /><span><ShieldCheck size={21} />1-Year Warranty</span><span><MapPin size={21} />Dodge City, Kansas</span></div></div>; }
function ServiceCard({ service, detailed }) {
  const [photo, alt, eyebrow, description] = servicePhotos[service.icon];
  const tile = <><img className="service-photo" src={photo} alt={alt} loading="lazy" width={service.icon === 'board' ? 1067 : 1600} height={service.icon === 'board' ? 1600 : service.icon === 'charging' ? 1200 : 1067} /><div className="tile-copy"><span className="tile-eyebrow">{eyebrow}</span><h3>{service.title}</h3><p>{description}</p><div className="tile-bottom"><span>From <strong>{service.price}</strong></span><ArrowUpRight size={21} aria-hidden="true" /></div></div></>;
  return detailed ? <article className={`service-card detailed-service service-${service.icon}`}><div className="service-tile">{tile}</div><div className="service-body"><p>{service.desc}</p><p className="service-detail">{service.detail}</p><a className="text-link" href="sms:6202534986">Text about your device <ArrowUpRight size={17} /></a></div></article> : <Link className={`service-tile service-${service.icon}`} to="/services">{tile}</Link>;
}
function ReviewMarquee() {
  return <div className="review-marquee" aria-label="Customer Google reviews">{[0, 1].map(row => <div className={`marquee-row ${row ? 'reverse' : ''}`} key={row} aria-hidden={row === 1 ? true : undefined}><div className="marquee-track">{[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{reviews.map(review => <figure className="review" key={review.date}><div className="stars" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: review.stars }, (_, n) => <Star key={n} size={16} fill="currentColor" aria-hidden="true" />)}</div><blockquote>“{review.quote}”</blockquote><figcaption>Google review <time dateTime={review.date}>{new Date(review.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time></figcaption></figure>)}</div>)}</div></div>)}</div>;
}
function ServiceSection({ detailed = false }) { return <section className="section container" id="services">{!detailed && <Heading title="Repairs for your phone"><Link className="text-link" to="/services">Explore all services <ArrowRight size={18} /></Link></Heading>}<div className={`service-grid ${detailed ? 'detailed-grid' : 'bento-grid'}`}>{services.map(service => <div className="service-wrapper" id={detailed ? service.icon : undefined} key={service.title}><ServiceCard service={service} detailed={detailed} /></div>)}</div><p className="pricing-note">Starting prices shown. Call or text with your device model to discuss repair options, pricing, and timing.</p></section>; }
function CTA() { return <section className="cta"><div className="cta-photo" aria-hidden="true"><img src="/images/board.jpg" alt="" loading="lazy" width="1067" height="1600" /></div><div className="container cta-inner"><div><h2>Talk to us about<br />your phone repair.</h2><p>Call or text with your device model and the problem. We’ll discuss the repair options before your visit.</p></div><div><Actions /><Link to="/contact" className="text-link">Find the Dodge City shop <ArrowRight size={18} /></Link></div></div></section>; }
function FAQ() {
  const faqs = [
    ['How long will my repair take?', 'Repair timing depends on your device, the issue, and parts availability. Call or text with your model so we can discuss the timing before your visit.'],
    ['What should I include in a text?', 'Send your device model, a description of the problem, and what happened before it started. That helps us talk through repair options and pricing.'],
    ['Is my personal data safe?', "Yes. We respect your privacy. We never access your personal files, and we don't require your passcode unless we are specifically running software diagnostics."],
    ['What does your warranty cover?', warranty],
    ['Where can I find the shop?', 'Visit us at 2500 Central Ave. Suite G, Dodge City, Kansas 67801. We’re open Tuesday–Friday 9am–6pm and Saturday 11am–6pm. Closed Sunday and Monday.'],
  ];
  return <section className="section container faq-layout" id="faq"><div><h2>Questions about your repair</h2><p>For other repair questions, text Cell Clinic.</p><a className="text-link" href="sms:6202534986">Ask us by text <ArrowUpRight size={18} /></a></div><div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={20} /></summary><p>{a}</p></details>)}</div></section>;
}
function Home() {
  return <div className="home-page"><section className="hero" id="home-hero"><div className="hero-bg"><img src="/hero-phone-repair.jpg" alt="A phone being repaired under a work lamp on a blue repair mat" loading="eager" fetchPriority="high" width="3200" height="2133" /></div><div className="hero-copy"><div className="copy-inner"><p className="hero-location">Phone repair in Dodge City</p><h1>Life happens.<br />Phones break.<br /><span>We’re here to help.</span></h1><p>For a cracked screen or a battery giving up, call or text Cell Clinic in Dodge City.</p><Actions /></div></div><div className="hero-trust"><span><strong>4.7</strong>from 78 Google reviews</span><span><strong>1-Year Warranty</strong></span><span><strong>Dodge City, Kansas</strong></span></div></section><div className="brands container"><span>Device brands<br /><strong>we work on</strong></span><div>{['Apple', 'Samsung', 'Google', 'Motorola', 'LG', 'OnePlus'].map(b => <span key={b}>{b}</span>)}</div></div><ServiceSection /><section className="about-section" id="about"><div className="container about-grid"><div className="about-photo"><img src="/Microsoldering.jpg" alt="A technician working on a device logic board under a microscope" loading="lazy" width="2934" height="4401" /><div className="photo-note">Logic board repair<br /><strong>in Dodge City</strong></div></div><div><h2>Phone repair<br />on Central Ave.</h2><p>If your phone stops working, call or text Cell Clinic with the model and what happened.</p><p>We handle cracked screens, battery replacements, and logic board repairs in Dodge City. Talk with us about repair options before bringing your device to the shop.</p><div className="about-address"><MapPin size={23} /><span>2500 Central Ave. Suite G<br /><strong>Dodge City, Kansas 67801</strong></span></div><Link className="text-link" to="/contact">Come see us <ArrowRight size={18} /></Link></div></div></section><section className="section container"><Heading title="How to arrange a repair" /><div className="process-grid">{[['Call, text, or visit', 'Tell us what’s happening with your device. Start with the model and the issue.'], ['Talk through the repair', 'Discuss the options, cost, and expected timing with the shop.'], ['Bring your device in', 'Bring your device to the shop for the agreed repair.'], ['Get back to your day', 'Arrange your pickup with the shop.']].map(([title, desc]) => <div key={title}><h3>{title}</h3><p>{desc}</p></div>)}</div></section><section className="review-section" id="reviews"><div className="container"><Heading title="Reviews of Cell Clinic"><div><Rating /><small className="rating-date">Google Maps · November 12, 2026</small></div></Heading><ReviewMarquee /></div></section><FAQ /><CTA /></div>;
}
function PageIntro({ title, children }) { return <section className="page-header"><div className="page-intro container"><h1>{title}</h1><p>{children}</p></div></section>; }
function ServicesPage() { return <><PageIntro title={<>Device repairs<br /><span>in Dodge City</span></>}>See our repairs and starting prices below. Call or text the Dodge City shop with your device model to discuss pricing and timing.</PageIntro><Trust /><ServiceSection detailed /><section className="warranty-section container"><ShieldCheck size={40} strokeWidth={1.5} /><div><h2>1-Year Warranty</h2><p>{warranty}</p></div></section><CTA /></>; }
function ContactPage() { return <><PageIntro title={<>Visit Cell Clinic<br /><span>in Dodge City</span></>}>Call or text 620-253-4986 about your repair, or visit us at 2500 Central Ave. Suite G.</PageIntro><section className="container contact-grid"><div className="contact-card"><a className="contact-number" href="tel:6202534986">{phone}</a><p>Send your device model and a short description of the issue.</p><Actions /><hr /><h2>Visit the shop</h2><address>{address}</address><a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={18} /></a><hr /><h2>Shop hours</h2><Hours /></div><div className="map-panel"><iframe title="Cell Clinic location at 2500 Central Ave. Suite G, Dodge City, Kansas 67801" src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div><MapPin size={21} /><span>2500 Central Ave. Suite G<br /><strong>Dodge City, Kansas 67801</strong></span><a href={mapUrl} target="_blank" rel="noreferrer" aria-label="Open directions in Google Maps"><ArrowUpRight /></a></div></div></section><FAQ /></>; }
function PrivacyPage() { return <><PageIntro title={<>Privacy during<br /><span>your repair</span></>}>Here’s how Cell Clinic in Dodge City handles personal files and passcodes during a repair.</PageIntro><section className="container privacy-copy"><h2>Your personal files</h2><p>We respect your privacy. We do not access your personal files.</p><h2>Passcodes and diagnostics</h2><p>We do not require your passcode unless it is needed for software diagnostics. If you have questions about what is needed for your repair, ask us before handing over your device.</p><h2>Getting in touch</h2><p>This website has no quote form. To discuss a repair or ask about device privacy, call or text the shop.</p><Actions /></section></>; }
function NotFound() { return <section className="page-header not-found"><div className="container page-intro"><h1>Page not found</h1><p>Return home to find repair services and shop details.</p><Link to="/" className="button primary">Back to home <ArrowRight size={18} /></Link></div></section>; }
function Site() {
  const location = useLocation();
  const mainRef = useRef(null);
  useEffect(() => {
    const [title, description] = meta[location.pathname] || ['Page Not Found | Cell Clinic', 'Find phone repair services and contact Cell Clinic in Dodge City.'];
    document.title = title;
    const canonical = document.querySelector('link[rel="canonical"]');
    canonical.href = `https://cell-clinic-mock-up.vercel.app${meta[location.pathname] ? location.pathname : '/'}`;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
    });
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.hero-copy, .page-intro', { y: 14 }, { y: 0, duration: .65, ease: 'power2.out' });
    }, mainRef);
    return () => { cancelAnimationFrame(frame); motion.revert(); };
  }, [location]);
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar /><main id="main" className={location.pathname === '/' ? 'home-main' : undefined} ref={mainRef} tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/services" element={<ServicesPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/privacy" element={<PrivacyPage />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><nav className="mobile-contact" aria-label="Call or text Cell Clinic"><Actions compact /></nav></>;
}
export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
