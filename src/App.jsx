import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Phone, MessageSquare, MapPin, Menu, X, Star, ShieldCheck, ChevronDown, Wrench, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { getShopStatus, shopDays, useShopClock } from './shopHours';
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
  '/about': ['About the Shop | Cell Clinic Dodge City', 'Meet the local repair shop on Central Ave. Lesley Mejia was raised in Dodge City and handles phone repairs, board-level work and accessories.'],
  '/contact': ['Contact & Shop Hours | Cell Clinic Dodge City', 'Visit Cell Clinic at 2500 Central Ave. Suite G, Dodge City, Kansas 67801. See shop hours and directions, or call or text 620-253-4986.'],
  '/privacy': ['Device Privacy | Cell Clinic Dodge City', 'Learn how Cell Clinic respects your device privacy and when a passcode may be needed for diagnostics.'],
};
function Actions({ compact = false }) {
  return <div className={`actions ${compact ? 'compact' : ''}`}><a className="button primary" href="tel:6202534986"><Phone size={18}  aria-hidden="true" />{compact ? 'Call' : 'Call 620-253-4986'}</a><a className="button secondary" href="sms:6202534986"><MessageSquare size={18}  aria-hidden="true" />{compact ? 'Text' : 'Text us'}</a></div>;
}
function Brand() { return <Link to="/" className="brand" aria-label="Cell Clinic home"><img className="brand-dark" src="/brand/cell-clinic-logo-dark-ink.svg" alt="Cell Clinic" width="2042" height="1275" /><img className="brand-light" src="/brand/cell-clinic-logo-light-ink.svg" alt="" aria-hidden="true" width="2042" height="1275" /></Link>; }
function Navbar() {
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const location = useLocation();
  const toggleRef = useRef(null);
  useLayoutEffect(() => {
    let frame = 0;
    let previous;
    const update = () => {
      frame = 0;
      const hero = document.getElementById('home-hero');
      const next = location.pathname === '/' && !!hero && hero.getBoundingClientRect().bottom > 96;
      if (next !== previous) { previous = next; setOverHero(next); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [location.pathname]);
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const close = e => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className={`site-header ${location.pathname === '/' ? 'home-nav' : ''} ${overHero ? 'over-hero' : ''}`}><div className="container nav-inner"><Brand /><button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav id="navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="Main navigation"><NavLink to="/services">Services</NavLink><NavLink to="/about">About</NavLink><Link to="/#faq" onClick={() => setOpen(false)}>FAQ</Link><NavLink to="/contact">Contact</NavLink><Actions compact /></nav></div></header>;
}
function Hours({ live = false }) {
  const now = useShopClock();
  const status = now ? getShopStatus(now) : null;
  return <>{live && <p className="shop-status" role="status">{status?.message || 'Tuesday–Friday 9am–6pm. Saturday 11am–6pm. Closed Sunday and Monday.'}</p>}<dl className={`hours ${live ? 'daily-hours' : ''}`}>{live ? shopDays.map((day, index) => <div key={day.name} className={status?.day === index ? 'today' : undefined}><dt>{day.name}{status?.day === index && <span className="today-label">Today</span>}</dt><dd>{day.open === null ? 'Closed' : `${day.open === 9 ? '9am' : '11am'}–6pm`}</dd></div>) : <><div><dt>Tuesday–Friday</dt><dd>9am–6pm</dd></div><div><dt>Saturday</dt><dd>11am–6pm</dd></div><div><dt>Sunday &amp; Monday</dt><dd>Closed</dd></div></>}</dl></>;
}
function ShopStatus() { const now = useShopClock(); return <p className="shop-status" role="status">{now ? getShopStatus(now).message : 'Tuesday–Friday 9am–6pm. Saturday 11am–6pm. Closed Sunday and Monday.'}</p>; }
function Footer() { return <footer className="footer"><div className="container footer-grid"><div><Brand /><p>Device repair, right here<br />in Dodge City.</p></div><div><h2>Visit the shop</h2><a href={mapUrl} target="_blank" rel="noreferrer">2500 Central Ave. Suite G<br />Dodge City, Kansas 67801 <ArrowUpRight size={14} aria-hidden="true" /></a><a className="footer-phone" href="tel:6202534986">{phone}</a><a href="sms:6202534986">Send us a text <ArrowUpRight size={14} aria-hidden="true" /></a></div><div><h2>Shop hours</h2><Hours /></div><div><h2>Explore</h2><Link to="/services">Services</Link><Link to="/about">About</Link><Link to="/contact">Contact &amp; directions</Link><Link to="/privacy">Privacy</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Cell Clinic Dodge City.</span></div></footer>; }
function Heading({ title, children }) { return <div className="section-heading"><h2>{title}</h2>{children}</div>; }
const googleReviewsUrl = 'https://www.google.com/maps/search/?api=1&query=Cell%20Clinic%202500%20Central%20Ave%20Dodge%20City%20KS';
function ReviewRating() { return <div className="review-rating"><div><strong>4.7</strong><span className="stars" role="img" aria-label="Rated 4.7 out of 5">{Array.from({ length: 5 }, (_, n) => <Star key={n} size={22} fill="currentColor" aria-hidden="true" />)}</span></div><p>from 78 Google reviews</p><a className="text-link" href={googleReviewsUrl} target="_blank" rel="noreferrer">Read reviews on Google <ArrowUpRight size={16} aria-hidden="true" /></a></div>; }
function Rating() { return <span className="rating"><Star size={18} fill="currentColor"  aria-hidden="true" /><strong>4.7</strong><span>from 78 Google reviews</span></span>; }
function Trust() { return <div className="trust-bar"><div className="container trust-inner"><Rating /><span><ShieldCheck size={21}  aria-hidden="true" />1-Year Warranty</span><span><MapPin size={21}  aria-hidden="true" />Dodge City, Kansas</span></div></div>; }
function ServiceCard({ service }) {
  const [photo, alt, eyebrow, description] = servicePhotos[service.icon];
  const tile = <><img className="service-photo" src={photo} alt={alt} loading="lazy" width={service.icon === 'board' ? 1067 : 1600} height={service.icon === 'board' ? 1600 : service.icon === 'charging' ? 1200 : 1067} /><div className="tile-copy"><span className="tile-eyebrow">{eyebrow}</span><h3>{service.title}</h3><p>{description}</p><div className="tile-bottom"><span>From <strong>{service.price}</strong></span><ArrowUpRight size={21} aria-hidden="true" /></div></div></>;
  return <Link className={`service-tile service-${service.icon}`} to="/services">{tile}</Link>;
}
function ReviewMarquee() {
  const marqueeRef = useRef(null);
  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = marqueeRef.current;
    const rows = [...root.querySelectorAll('.marquee-row')];
    let visible = false;
    const states = rows.map(row => ({ row, next: performance.now() + 4000, autoUntil: 0, touching: false }));
    const cleanups = states.map(state => {
      const pause = event => {
        if (event.type === 'scroll' && performance.now() < state.autoUntil) return;
        state.autoUntil = 0;
        state.next = performance.now() + 3000;
        if (event.type === 'pointerdown' || event.type === 'touchstart') state.touching = true;
        if (event.type === 'pointerup' || event.type === 'pointercancel' || event.type === 'touchend' || event.type === 'touchcancel') state.touching = false;
      };
      const events = ['pointerdown', 'pointerup', 'pointercancel', 'touchstart', 'touchend', 'touchcancel', 'wheel', 'scroll'];
      events.forEach(type => state.row.addEventListener(type, pause, { passive: true }));
      return () => events.forEach(type => state.row.removeEventListener(type, pause));
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      states.forEach(state => { state.next = performance.now() + 4000; });
    });
    observer.observe(root);
    const onVisibility = () => states.forEach(state => { state.next = performance.now() + 4000; });
    document.addEventListener('visibilitychange', onVisibility);
    const timer = window.setInterval(() => {
      if (!media.matches || reduced.matches || !visible || document.hidden) return;
      const now = performance.now();
      states.forEach(state => {
        if (state.touching || now < state.next) return;
        const row = state.row;
        const cards = [...row.querySelector('.marquee-group').children];
        const origin = cards[0].offsetLeft;
        const next = cards.find(card => card.offsetLeft - origin > row.scrollLeft + 2);
        const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
        state.autoUntil = now + 1200;
        state.next = now + 4000;
        row.scrollBy({ left: atEnd || !next ? -row.scrollLeft : next.offsetLeft - origin - row.scrollLeft, behavior: 'smooth' });
      });
    }, 100);
    return () => { clearInterval(timer); observer.disconnect(); cleanups.forEach(cleanup => cleanup()); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return <div ref={marqueeRef} className="review-marquee" tabIndex={0} role="region" aria-label="Customer Google reviews">{[0, 1].map(row => <div className={`marquee-row ${row ? 'reverse' : ''}`} key={row} aria-hidden={row === 1 ? true : undefined}><div className="marquee-track">{[0, 1].map(copy => <div className="marquee-group" role={row === 0 && copy === 0 ? 'list' : undefined} key={copy} aria-hidden={copy === 1 ? true : undefined}>{reviews.map(review => <div role={row === 0 && copy === 0 ? 'listitem' : undefined} className="marquee-item" key={review.date}><ReviewCard review={review} /></div>)}</div>)}</div></div>)}</div>;
}
function ServiceSection() { return <section className="section container" id="services"><Heading title="Repairs for your phone"><Link className="text-link" to="/services">Explore all services <ArrowRight size={18} aria-hidden="true" /></Link></Heading><div className="service-grid bento-grid">{services.map(service => <div className="service-wrapper" key={service.title}><ServiceCard service={service} /></div>)}</div><p className="pricing-note">Starting prices shown. Call or text with your device model to discuss repair options, pricing, and timing.</p></section>; }

function CTA() { return <section className="cta"><div className="container cta-inner"><div><h2>Call or text Cell Clinic about your repair</h2><a className="cta-number" href="tel:6202534986">{phone}</a><p>Send your model and what happened. We’ll talk through options, price and timing before you bring it in.</p><Actions /></div><div className="cta-visit"><ShopStatus /><address>{address}</address><a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={18} aria-hidden="true" /></a><p className="cta-proof">4.7 from 78 Google reviews · 1-year warranty</p></div></div></section>; }
const processSteps = [
  ['Call, text, or visit', 'Tell us what’s happening with your device. Start with the model and the issue.', Phone],
  ['Talk through the repair', 'Discuss the options, cost, and expected timing with the shop.', MessageSquare],
  ['Bring your device in', 'Bring your device to the shop for the agreed repair.', Wrench],
  ['Get back to your day', 'Arrange your pickup with the shop.', CheckCircle2],
];
function Process() { return <section className="section container" id="repair-process"><Heading title="How to arrange a repair" /><ol className="process-grid">{processSteps.map(([title, desc, Icon]) => <li key={title}><span className="process-marker" aria-hidden="true"><Icon size={20} /></span><span className="process-connector" aria-hidden="true" /><h3>{title}</h3><p>{desc}</p></li>)}</ol></section>; }
function Brands() { return <div className="brands container" aria-label="Brands we repair"><div>{['Apple', 'Samsung', 'Google', 'Motorola', 'LG', 'OnePlus'].map(b => <span key={b}>{b}</span>)}</div></div>; }
function ReviewCard({ review }) { return <figure className="review"><div className="stars" role="img" aria-label={`${review.stars} out of 5 stars`}>{Array.from({ length: review.stars }, (_, n) => <Star key={n} size={16} fill="currentColor" aria-hidden="true" />)}</div><blockquote>“{review.quote}”</blockquote><figcaption>Google review <time dateTime={review.date}>{new Date(review.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></figcaption></figure>; }
function FAQ({ short = false }) {
  const faqs = [
    ['How long will my repair take?', 'Repair timing depends on your device, the issue, and parts availability. Call or text with your model so we can discuss the timing before your visit.'],
    ['What should I include in a text?', 'Send your device model, a description of the problem, and what happened before it started. That helps us talk through repair options and pricing.'],
    ['Is my personal data safe?', "Yes. We respect your privacy. We never access your personal files, and we don't require your passcode unless we are specifically running software diagnostics."],
    ['What does your warranty cover?', warranty],
    ['Where can I find the shop?', 'Visit us at 2500 Central Ave. Suite G, Dodge City, Kansas 67801. We’re open Tuesday–Friday 9am–6pm and Saturday 11am–6pm. Closed Sunday and Monday.'],
  ];
  return <section className="section container faq-layout" id="faq"><div><h2>Questions about your repair</h2><p>For other repair questions, text Cell Clinic.</p><a className="text-link" href="sms:6202534986">Ask us by text <ArrowUpRight size={18}  aria-hidden="true" /></a></div><div className="faq-list">{(short ? faqs.slice(0, 3) : faqs).map(([q, a]) => <details key={q}><summary>{q}<ChevronDown size={20}  aria-hidden="true" /></summary><p>{a}</p></details>)}</div></section>;
}
function Home() {
  return <div className="home-page"><section className="hero" id="home-hero"><div className="hero-bg"><img src="/hero-phone-repair.jpg" alt="A phone being repaired under a work lamp on a blue repair mat" loading="eager" fetchPriority="high" width="3200" height="2133" /></div><div className="hero-copy"><div className="copy-inner"><p className="hero-location">Phone repair in Dodge City</p><h1>Life happens.<br />Phones break.<br /><span>We’re here to help.</span></h1><p>For a cracked screen or a battery giving up, call or text Cell Clinic in Dodge City.</p><Actions /></div></div><div className="hero-trust"><span><strong>4.7</strong>from 78 Google reviews</span><span><strong>1-Year Warranty</strong></span><span><strong>Dodge City, Kansas</strong></span></div></section><Brands /><ServiceSection /><section className="about-section" id="about"><div className="container about-grid"><div className="about-photo"><img src="/Microsoldering.jpg" alt="A technician working on a device logic board under a microscope" loading="lazy" width="2934" height="4401" /><div className="photo-note">Logic board repair<br /><strong>in Dodge City</strong></div></div><div><h2>Phone repair on Central Ave.</h2><p>Cell Clinic is a local Dodge City shop. Owner Lesley Mejia was raised here, went to Dodge City High School and supports DCHS sports teams. The shop has served Dodge City for many years.</p><p>Bring us questions about screens, batteries, water damage, charging ports, data recovery or board-level work. We talk through options, price and timing before the repair.</p><ul className="shop-facts"><li>Raised in Dodge City</li><li>Board-level repair in the shop</li><li>1-year warranty on parts and labor</li><li>Cases, screen protectors and skins</li></ul><figure className="about-quote"><blockquote>“The owner is highly professional and will work with you to best serve your needs. Dodge City is lucky to have a great business like Cell Clinic.”</blockquote><figcaption>Google review <time dateTime="2021-01-14">January 14, 2021</time></figcaption></figure><div className="about-address"><MapPin size={23}  aria-hidden="true" /><span>2500 Central Ave. Suite G<br /><strong>Dodge City, Kansas 67801</strong></span></div><Link className="text-link" to="/about">Meet the shop <ArrowRight size={18}  aria-hidden="true" /></Link></div></div></section><Process /><section className="review-section" id="reviews"><div className="container"><Heading title="What customers say about Cell Clinic"><ReviewRating /></Heading><ReviewMarquee /></div></section><FAQ /><CTA /></div>;
}
function PageIntro({ title, children }) { return <section className="page-header"><div className="page-intro container"><h1>{title}</h1><p>{children}</p></div></section>; }
const repairSigns = {
  screen: ['Cracked glass', 'Lines on the display', 'Touch not responding'],
  battery: ['Drains quickly', 'Unexpected shutdowns', 'Won’t hold a charge'],
  water: ['Device exposed to liquid', 'Won’t turn on after liquid damage'],
  charging: ['Charges only at an angle', 'Trouble charging when plugged in'],
  data: ['Photos, contacts or messages on a device that won’t turn on'],
  board: ['Problems beyond the screen or battery', 'Symptoms after earlier device damage'],
};
function RepairDetails({ service }) {
  const [photo, alt] = servicePhotos[service.icon];
  const send = service.icon === 'data' ? ['Device model and what happened', 'The data you need to recover', 'Whether it turns on'] : service.icon === 'charging' ? ['Device model', 'How it behaves when plugged in', 'Whether you tried another cable'] : ['Device model and what happened', 'Whether it turns on', 'Any earlier damage'];
  return <article id={service.icon} className="repair-row"><img src={photo} alt={alt} loading="lazy" width={service.icon === 'board' ? 1067 : 1600} height={service.icon === 'board' ? 1600 : service.icon === 'charging' ? 1200 : 1067} /><div className="repair-copy"><div className="repair-title"><h2>{service.title}</h2><p className="repair-price">From {service.price}</p></div><p>{service.detail}</p><div className="repair-lists"><div><h3>Signs you need it</h3><ul>{repairSigns[service.icon].map(sign => <li key={sign}>{sign}</li>)}</ul></div><div><h3>What to send us</h3><ul>{send.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>What to expect</h3><ul>{service.expect.map(item => <li key={item}>{item}</li>)}</ul></div></div><Actions compact /></div></article>;
}
function ServicesPage() { return <><PageIntro title="Device repairs in Dodge City">See our repairs and starting prices below. Call or text the Dodge City shop with your device model to discuss pricing and timing.</PageIntro><Trust /><section className="container repair-reference"><nav className="repair-jumps" aria-label="Jump to a repair">{services.map(service => <a key={service.icon} href={`#${service.icon}`}>{service.title}</a>)}</nav>{services.map(service => <RepairDetails key={service.icon} service={service} />)}</section><section className="service-brands"><div className="container"><h2>Brands we work on</h2></div><Brands /></section><section className="container privacy-panel"><h2>Your data and privacy</h2><p>We do not access your personal files. We only ask for a passcode if it is needed for software diagnostics. Ask us what your repair needs before handing over your device.</p><Link className="text-link" to="/privacy">Read about device privacy <ArrowRight size={18} aria-hidden="true" /></Link></section><section className="warranty-section container"><ShieldCheck size={40} strokeWidth={1.5} aria-hidden="true" /><div><h2>1-Year Warranty</h2><p>{warranty}</p></div></section><FAQ short /><CTA /></>; }
function AboutPage() { return <><PageIntro title="Your local Dodge City repair shop">Cell Clinic repairs phones and devices at 2500 Central Ave. Suite G in Dodge City.</PageIntro><section className="section container shop-story"><div><h2>Raised in Dodge City</h2><p>Lesley Mejia grew up in Dodge City and went to Dodge City High School. She still cheers on and supports DCHS sports teams.</p><p>Lesley has been fixing phones for Dodge City for many years. At Cell Clinic, you can talk through the problem with your device and ask about the options before deciding on a repair.</p><p>The shop also has cases, screen protectors and skins for your phone.</p></div>{/* TODO: replace with real owner and shop photo after the pitch */}<figure className="owner-photo" data-placeholder="owner-photo"><div><img src="/brand/cell-clinic-logo-dark-ink-mark.svg" alt="" width="647" height="1275" /><span>Photo to come</span></div><figcaption>Lesley Mejia at the shop</figcaption></figure></section><section className="about-reviews"><div className="container"><Heading title="What people say" /><div className="static-reviews">{reviews.slice(0, 3).map(review => <ReviewCard key={review.date} review={review} />)}</div></div></section><section className="section container about-details"><div><h2>What we fix</h2><ul className="repair-links">{services.map(service => <li key={service.icon}><Link to={`/services#${service.icon}`}>{service.title}<ArrowUpRight size={18} aria-hidden="true" /></Link></li>)}</ul><h2>How a visit works</h2><p>Call, text or visit with your model and what happened. We’ll discuss the options, price and timing before you bring your device in for the agreed repair. Arrange pickup with the shop.</p><Link className="text-link" to="/#repair-process">How to arrange a repair <ArrowRight size={18} aria-hidden="true" /></Link></div><div><h2>Key facts</h2><dl className="key-facts"><div><dt>Business</dt><dd>Cell Clinic</dd></div><div><dt>Owner</dt><dd>Lesley Mejia</dd></div><div><dt>Location</dt><dd>{address}</dd></div><div><dt>Hours</dt><dd>Tuesday–Friday 9am–6pm<br />Saturday 11am–6pm<br />Closed Sunday and Monday</dd></div><div><dt>Phone (call or text)</dt><dd><a href="tel:6202534986">{phone}</a><a href="sms:6202534986">Text Cell Clinic</a></dd></div><div><dt>Repairs</dt><dd>Screens, batteries, water damage, charging ports, data recovery and micro-soldering</dd></div><div><dt>Warranty</dt><dd>1 year on parts and labor</dd></div><div><dt>Google rating</dt><dd>4.7 from 78 Google reviews</dd></div></dl></div></section><CTA /></>; }
function ContactPage() { return <><PageIntro title="Call or text Cell Clinic">Talk with the Dodge City shop about your device, or visit us on Central Ave.</PageIntro><section className="container contact-grid"><div className="contact-card"><a className="contact-number" href="tel:6202534986">{phone}</a><Actions /><h2>What to include in your text</h2><ul><li>Your device model</li><li>What happened</li><li>Whether it turns on</li><li>A photo of the damage if you can</li></ul><h2>Texting us</h2><p>Texts and calls are answered during shop hours.</p><hr /><h2>Shop hours</h2><Hours live /></div><div className="contact-location"><div className="map-panel"><iframe title="Cell Clinic location at 2500 Central Ave. Suite G, Dodge City, Kansas 67801" src={`https://www.google.com/maps?q=${encodeURIComponent('Cell Clinic, 2500 Central Ave Suite G, Dodge City, KS 67801')}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div><MapPin size={21} aria-hidden="true" /><address>{address}</address></div></div><div className="map-actions"><a className="button primary" href={mapUrl} target="_blank" rel="noreferrer">Get directions</a><a className="text-link" href={googleReviewsUrl} target="_blank" rel="noreferrer">See us on Google <ArrowUpRight size={18} aria-hidden="true" /></a></div><h2>Finding the shop</h2><p>Look for Suite G at 2500 Central Ave. in Dodge City.</p><h2>Before you come in</h2><ul><li>Back up your phone if it still works.</li><li>Bring your charger if it won’t power on.</li><li>Remove the case if you like.</li><li>We’ll only ask for a passcode if software diagnostics need it.</li></ul></div></section><FAQ /></>; }
function PrivacyPage() { return <><PageIntro title={<>Privacy during<br /><span>your repair</span></>}>Here’s how Cell Clinic in Dodge City handles personal files and passcodes during a repair.</PageIntro><section className="container privacy-copy"><h2>Your personal files</h2><p>We respect your privacy. We do not access your personal files.</p><h2>Passcodes and diagnostics</h2><p>We do not require your passcode unless it is needed for software diagnostics. If you have questions about what is needed for your repair, ask us before handing over your device.</p><h2>Getting in touch</h2><p>This website has no quote form. To discuss a repair or ask about device privacy, call or text the shop.</p><Actions /></section></>; }
function NotFound() { return <section className="page-header not-found"><div className="container page-intro"><h1>Page not found</h1><p>Return home to find repair services and shop details.</p><Link to="/" className="button primary">Back to home <ArrowRight size={18}  aria-hidden="true" /></Link></div></section>; }
function MobileContact() {
  const location = useLocation();
  const [hidden, setHidden] = useState(location.pathname === '/');
  useEffect(() => {
    const actions = document.querySelector('#home-hero .actions');
    if (!actions) { setHidden(false); return; }
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    observer.observe(actions);
    return () => observer.disconnect();
  }, [location.pathname]);
  return <nav className={`mobile-contact ${hidden ? 'is-hidden' : ''}`} aria-label="Call or text Cell Clinic"><Actions compact /></nav>;
}
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
    motion.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      gsap.fromTo('.hero-copy, .page-intro', { y: 14 }, { y: 0, duration: .65, ease: 'power2.out' });
    }, mainRef);
    return () => { cancelAnimationFrame(frame); motion.revert(); };
  }, [location]);
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar /><main id="main" className={location.pathname === '/' ? 'home-main' : undefined} ref={mainRef} tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/services" element={<ServicesPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/privacy" element={<PrivacyPage />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /><MobileContact /></>;
}
export default function App() { return <BrowserRouter><Site /></BrowserRouter>; }
