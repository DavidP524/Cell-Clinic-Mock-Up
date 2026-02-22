import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ChevronRight, Wrench, Smartphone, Battery, Menu, X, ShieldCheck,
    Zap, HardDrive, Droplets, MapPin, Phone, Clock, CheckCircle,
    Star, Award, MessageSquare, ChevronDown, Mail, Cpu
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- CURSOR ---
const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [hoverState, setHoverState] = useState('');

    useEffect(() => {
        if (window.matchMedia('(pointer: fine)').matches) {
            document.body.style.cursor = 'none';
        }

        const updateCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out',
            });

            const target = e.target;
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.magnetic-btn') ||
                target.closest('input') ||
                target.closest('textarea')
            ) {
                setHoverState('hovering-link');
            } else if (target.closest('.portfolio-item') || target.closest('.faq-item')) {
                setHoverState('hovering-link');
            } else {
                setHoverState('');
            }
        };

        window.addEventListener('mousemove', updateCursor);
        return () => window.removeEventListener('mousemove', updateCursor);
    }, []);

    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
    if (!isDesktop) return null;

    return <div ref={cursorRef} className={`custom-cursor hidden md:block ${hoverState}`} />;
};

// --- SHARED COMPONENTS ---
const SectionHeading = ({ children, subtitle, centered = false }) => (
    <div className={cn("mb-12 md:mb-16", centered && "text-center")}>
        {subtitle && <div className={cn("font-data text-accent text-sm md:text-base uppercase tracking-widest font-bold mb-4", centered && "mx-auto")}>{subtitle}</div>}
        <h2 className={cn("font-heading font-extrabold text-3xl md:text-5xl lg:text-5xl text-primary leading-tight", centered ? "max-w-4xl mx-auto" : "max-w-3xl")}>
            {children}
        </h2>
    </div>
);

// --- SECTIONS ---

// 0. PRELOADER
const Preloader = () => {
    const preloaderRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.4 });

            // Fade the text out first
            tl.to('.preloader-text', {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'power2.in',
            });

            // Then roll the curtain up smoothly
            tl.to(preloaderRef.current, {
                yPercent: -100,
                duration: 1,
                ease: 'power3.inOut',
            }, '-=0.1');

        }, preloaderRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={preloaderRef} className="fixed inset-0 z-[9998] bg-[#FAFAFA] flex flex-col">
            <div className="flex-1 bg-accent flex items-center justify-center">
                <div className="preloader-text font-data text-white font-black text-4xl md:text-6xl tracking-[0.2em] uppercase">
                    Cell Clinic
                </div>
            </div>
        </div>
    );
};

// 0. NAVBAR
const Navbar = () => {
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollTo = (id) => {
        setMenuOpen(false);
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                start: 'top -100',
                end: 99999,
                toggleClass: {
                    className: 'nav-scrolled',
                    targets: navRef.current
                }
            });
        }, navRef);
        return () => ctx.revert();
    }, []);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 text-primary bg-transparent
        [&.nav-scrolled]:bg-white/95 [&.nav-scrolled]:backdrop-blur-md [&.nav-scrolled]:shadow-md [&.nav-scrolled]:text-foreground [&.nav-scrolled]:py-3"
            >
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/Logo.png" alt="Cell Clinic Logo" className="w-10 h-10 object-contain" />
                    <div className="font-heading font-black text-2xl tracking-tight">Cell Clinic</div>
                </div>
                <div className="hidden md:flex items-center space-x-10 font-bold tracking-wide">
                    <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="hover:text-accent transition-colors duration-300">Services</a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className="hover:text-accent transition-colors duration-300">About</a>
                    <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollTo('reviews'); }} className="hover:text-accent transition-colors duration-300">Reviews</a>
                    <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }} className="hover:text-accent transition-colors duration-300">FAQ</a>
                </div>
                <button onClick={() => scrollTo('contact')} className="hidden md:flex magnetic-btn bg-accent text-white px-7 py-3 rounded-md font-bold text-sm items-center gap-2 group cursor-pointer border-none shadow-lg shadow-accent/20 hover:bg-red-700 transition-colors">
                    <span className="relative z-10">Get a Fast Quote</span>
                </button>
                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-6">
                    <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="mobile-nav-link font-heading text-2xl font-black text-primary hover:text-accent">Services</a>
                    <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className="mobile-nav-link font-heading text-2xl font-black text-primary hover:text-accent">About</a>
                    <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollTo('reviews'); }} className="mobile-nav-link font-heading text-2xl font-black text-primary hover:text-accent">Reviews</a>
                    <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }} className="mobile-nav-link font-heading text-2xl font-black text-primary hover:text-accent">FAQ</a>
                    <button onClick={() => scrollTo('contact')} className="mobile-nav-link magnetic-btn mt-6 bg-accent text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl hover:bg-red-700 transition-colors">
                        Get a Fast Quote
                    </button>
                </div>
            )}
        </>
    );
};

// 1. HERO
const Hero = () => {
    const containerRef = useRef(null);
    const bgImgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-element',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: 1.1 // Synchronized with curtain lift
                }
            );

            gsap.to(bgImgRef.current, {
                yPercent: 30,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full min-h-[100dvh] flex items-center justify-start pt-32 pb-24 px-6 md:px-12 bg-white overflow-hidden text-left border-b border-gray-200">
            <div className="absolute inset-0 z-0 overflow-hidden bg-white">
                <img
                    ref={bgImgRef}
                    src="/Hero.CellClinic.jpeg"
                    alt="Cell Clinic Devices"
                    className="absolute -top-[5%] left-0 w-full h-[110%] object-cover object-center hidden md:block" // Hidden on mobile, shown on md+
                />
            </div>

            {/* Mobile Image (Visible only on small screens) */}
            <div className="w-full h-64 md:hidden relative rounded-2xl overflow-hidden mb-8 shadow-lg mt-8 hidden">
                {/*  Keeping this structure in case we want a split layout, but let's try the padding approach first */}
            </div>

            <div className="relative z-10 flex flex-col items-start gap-6 max-w-2xl w-full mt-8 md:mt-24 ml-0 md:ml-12 lg:ml-24 xl:ml-32 md:bg-white md:p-8 md:rounded-2xl md:shadow-xl">
                {/*  Mobile specific background block so it doesn't just sit on the white */}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm -m-6 p-6 md:hidden rounded-2xl z-[-1]"></div>

                <div className="hero-element inline-flex items-center gap-2 font-data text-accent uppercase tracking-wider text-[10px] md:text-sm font-bold border border-accent/40 px-3 md:px-5 py-1 md:py-2 rounded-md bg-white">
                    <MapPin size={14} className="md:w-4 md:h-4" /> <span>Local Phone Repair in Dodge City</span>
                </div>

                <h1 className="hero-element font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-primary leading-[1.05]">
                    Fast device repair <br />
                    <span className="text-accent inline-block mt-1 md:mt-2">when you need it most.</span>
                </h1>

                <ul className="hero-element space-y-2 md:space-y-3 mt-2 md:mt-4 text-foreground/90 font-heading text-base sm:text-lg md:text-xl font-medium">
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-accent flex-shrink-0 md:w-6 md:h-6" /> Surgical precision</li>
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-accent flex-shrink-0 md:w-6 md:h-6" /> Fixed in under 60 minutes</li>
                    <li className="flex items-center gap-3"><CheckCircle size={20} className="text-accent flex-shrink-0 md:w-6 md:h-6" /> Premium local parts</li>
                </ul>

                <div className="hero-element flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6 w-full sm:w-auto">
                    <a href="tel:5551234567" className="magnetic-btn inline-flex bg-accent text-white px-6 md:px-10 py-3 md:py-5 rounded-md font-bold text-base md:text-lg items-center justify-center gap-2 md:gap-3 shadow-[0_0_30px_rgba(230,59,46,0.2)] hover:bg-red-700 transition-colors w-full sm:w-auto">
                        <Phone size={18} className="relative z-10 md:w-5 md:h-5" />
                        <span className="relative z-10">Call Now</span>
                    </a>
                    <button onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="magnetic-btn inline-flex bg-white/80 backdrop-blur-sm text-primary px-6 md:px-10 py-3 md:py-5 rounded-md font-bold text-base md:text-lg items-center justify-center gap-2 md:gap-3 border border-gray-300 hover:bg-gray-100 transition-colors w-full sm:w-auto shadow-sm">
                        <span className="relative z-10">Get a Fast Quote</span>
                    </button>
                </div>
            </div>

            {/* Split layout mobile image implementation */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-white md:hidden">
                <img
                    src="/Hero.CellClinic.jpeg"
                    alt="Cell Clinic Devices"
                    className="absolute bottom-0 left-0 w-full h-[50%] object-cover object-top opacity-80"
                />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            </div>
        </section>
    );
};

// Trust Badges Bar (New)
const TrustBadges = () => {
    return (
        <section className="bg-dark border-b border-gray-200 py-6 px-6 relative z-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center lg:justify-between gap-6 md:gap-12 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="flex text-accent">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <span className="font-bold text-primary">5.0 on Google</span>
                </div>
                <div className="hidden lg:block w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Award size={20} className="text-accent" />
                    <span>1-Year Warranty</span>
                </div>
                <div className="hidden lg:block w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <ShieldCheck size={20} className="text-accent" />
                    <span>Locally Owned & Operated</span>
                </div>
            </div>
        </section>
    );
};

// Brand Ticker Marquee (Updated to light theme)
const BrandMarquee = () => {
    const brands = ["APPLE", "SAMSUNG", "GOOGLE", "LG", "MOTOROLA", "ONEPLUS", "NINTENDO", "PLAYSTATION", "SONY", "MICROSOFT"];
    return (
        <section className="bg-white text-primary border-b border-gray-200 py-6 overflow-hidden border-t">
            <div className="marquee font-heading tracking-widest text-sm font-bold opacity-80">
                <div className="marquee-content gap-24 mx-12 text-xl">
                    {brands.map((b, i) => <span key={i}>{b}</span>)}
                    {brands.map((b, i) => <span key={'dup' + i}>{b}</span>)}
                    {brands.map((b, i) => <span key={'dup2' + i}>{b}</span>)}
                </div>
            </div>
        </section>
    );
};

// 3. SERVICES 
const ServiceCard = ({ svc }) => {
    return (
        <div className="service-card-reveal group bg-white border border-gray-200 hover:border-accent rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-md bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    {svc.icon}
                </div>
                {svc.price && (
                    <div className="font-data font-bold text-sm bg-dark px-3 py-1 rounded-full text-primary border border-gray-200 group-hover:border-accent/30">
                        Starts {svc.price}
                    </div>
                )}
            </div>
            <h3 className="font-heading font-bold text-xl text-primary mb-3 group-hover:text-accent transition-colors">{svc.title}</h3>
            <p className="text-foreground/70 font-heading text-sm leading-relaxed font-medium">
                {svc.desc}
            </p>
        </div>
    );
};

const Services = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    const services = [
        {
            icon: <Smartphone size={28} />,
            title: "Screen Repairs",
            desc: "We fix shattered, bleeding, or unresponsive screens on all models. Back better than new in under 60 minutes.",
            price: "$89"
        },
        {
            icon: <Battery size={28} />,
            title: "Battery Replacements",
            desc: "Phone dying halfway through the day? We swap out old degraded batteries for fresh, full-capacity ones.",
            price: "$49"
        },
        {
            icon: <Droplets size={28} />,
            title: "Water Damage Fix",
            desc: "Dropped it in the sink or pool? Bring it in fast! We extract the moisture and revive dead motherboards.",
            price: "$89"
        },
        {
            icon: <Zap size={28} />,
            title: "Charging Ports",
            desc: "Having to hold your cord at a weird angle just to charge? We clean or replace worn-out charging ports in minutes.",
            price: "$59"
        },
        {
            icon: <HardDrive size={28} />,
            title: "Data Recovery",
            desc: "Phone won't turn on at all? We specialize in retrieving lost photos, contacts, and texts from dead devices.",
            price: "$99"
        },
        {
            icon: <Cpu size={28} />,
            title: "Micro-Soldering",
            desc: "Need advanced board repair? We offer component-level soldering and logic board fixes for your devices.",
            price: "$79"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.srv-heading',
                { y: 30, opacity: 0 },
                { scrollTrigger: { trigger: sectionRef.current, start: 'top 95%' }, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
            );
            gsap.fromTo('.service-card-reveal',
                { y: 40, opacity: 0, scale: 0.98 },
                { scrollTrigger: { trigger: gridRef.current, start: 'top 100%' }, y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out' }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
            <div className="srv-heading">
                <SectionHeading subtitle="What We Fix" centered={true}>Everything you need fixed.</SectionHeading>
                <p className="text-center text-foreground/70 max-w-2xl mx-auto -mt-6 mb-12 font-medium">
                    We offer affordable, local repairs with premium parts and same-day turnaround so you can get back to your life.
                </p>
            </div>
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {services.map((svc, i) => (
                    <ServiceCard key={i} svc={svc} />
                ))}
            </div>
        </section>
    );
};

// 4. ABOUT (New)
const About = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.about-element',
                { y: 30, opacity: 0 },
                { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
            );

            gsap.to({ val: 0 }, {
                val: 1000,
                duration: 2.5,
                ease: 'none', // linear speed
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
                onUpdate: function () {
                    const el = document.getElementById('repairs-ticker');
                    if (el) el.innerText = Math.min(1000, Math.ceil(this.targets()[0].val)).toLocaleString();
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="py-24 px-6 w-full bg-dark border-y border-gray-200 overflow-hidden">
            <div className="max-w-[80rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                <div className="about-element lg:col-span-7 rounded-2xl overflow-hidden shadow-xl border border-gray-200 aspect-[16/10] relative bg-[#e2e8f0]">
                    <img src="/image.png" alt="Locally Owned" className="object-cover object-center w-full h-full transform scale-[0.85] rounded-xl" />
                    <div className="absolute inset-0 border-[1.5rem] border-[#e2e8f0]"></div>
                </div>
                <div className="about-element lg:col-span-5 relative z-10">
                    <SectionHeading subtitle="Locally Owned">The shop Dodge City trusts.</SectionHeading>
                    <p className="font-heading text-lg text-foreground/80 leading-relaxed font-medium mb-6">
                        Mailing your phone to the manufacturer means ridiculous fees and days of waiting. Buying a brand new device means losing your data and spending hundreds of dollars.
                    </p>
                    <p className="font-heading text-lg text-foreground/80 leading-relaxed font-medium mb-8">
                        Cell Clinic was built to solve that exact problem. We are a locally owned and operated team right here in Dodge City, dedicated to giving our neighbors honest advice, fair prices, and the fastest turnarounds possible. When you hand your device over the counter, you're handing it to a trained expert who cares about getting you back online.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <div className="text-accent font-black text-3xl mb-1 mt-1"><span id="repairs-ticker">0</span>+</div>
                            <div className="text-primary font-bold text-sm uppercase tracking-wide">Repairs Completed</div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200">
                            <div className="text-accent font-black text-3xl mb-1 mt-1">Same Day</div>
                            <div className="text-primary font-bold text-sm uppercase tracking-wide">Average Turnaround</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// 5. PROCESS
const Process = () => {
    const sectionRef = useRef(null);

    const steps = [
        { num: "1", title: "Drop In or Call", desc: "Bring your broken device straight to our counter. A friendly tech will assess the issue immediately." },
        { num: "2", title: "Get a Quote", desc: "We provide an upfront, honest discussion of repair costs so there are never any surprises." },
        { num: "3", title: "Swift Repair", desc: "We pull the parts from our stock and get straight to work, usually fixing it while you wait." },
        { num: "4", title: "Test & Return", desc: "We thoroughly test the device to ensure perfection before handing it back with a trusted guarantee." }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.process-box',
                { y: 30, opacity: 0 },
                { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="process" className="py-24 px-6 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="process-box text-center">
                    <SectionHeading subtitle="How it works" centered={true}>Simple, Honest, Efficient.</SectionHeading>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="process-box relative bg-dark p-8 rounded-xl border border-gray-200 hover:border-accent transition-colors">
                            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-heading font-black text-xl mb-6 shadow-lg shadow-accent/20">
                                {step.num}
                            </div>
                            <h3 className="font-heading font-black text-xl text-primary mb-3 mt-4">{step.title}</h3>
                            <p className="text-foreground/75 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 6. PORTFOLIO / REVIEWS
const ReviewItem = ({ review }) => {
    return (
        <div className="review-item bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm relative mt-4 md:mt-6 h-full flex flex-col justify-between whitespace-normal text-left">
            <div className="absolute -top-4 right-4 md:right-8 bg-accent text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-md whitespace-nowrap">
                {review.tag}
            </div>
            <div className="mt-2">
                <div className="flex text-accent mb-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-primary font-medium text-base md:text-lg leading-relaxed mb-6 italic whitespace-normal">"{review.quote}"</p>
            </div>
            <div className="font-bold text-xs md:text-sm text-foreground/60 uppercase tracking-wide">- {review.name}</div>
        </div>
    );
};

const Reviews = () => {
    const sectionRef = useRef(null);
    const scrollRef = useRef(null);

    const reviews = [
        {
            name: "Sarah M.",
            tag: "Screen Replacement",
            quote: "I dropped my phone on concrete and it was completely shattered. Walked in and they had it looking brand new in 45 minutes. Great price too!"
        },
        {
            name: "John D.",
            tag: "Water Damage Fix",
            quote: "Thought my phone was totally dead after it fell in the sink. These guys took it apart, cleaned everything, and saved all my vacation photos."
        },
        {
            name: "Emily R.",
            tag: "Battery Upgrade",
            quote: "My phone wouldn't hold a charge for more than 2 hours. Cell Clinic swapped the battery in 20 minutes and now it lasts all day again."
        },
        {
            name: "Mike T.",
            tag: "PS5 HDMI Repair",
            quote: "Kid broke the HDMI port on the PS5. Sony wanted weeks to fix it, these guys had it done locally in 2 days. Highly recommend."
        },
        {
            name: "Jessica W.",
            tag: "Charging Port",
            quote: "I had to hold my cord at a weird angle to get it to charge. They cleaned it out and replaced the port while I grabbed a coffee next door."
        },
        {
            name: "David L.",
            tag: "Data Recovery",
            quote: "Phone got run over. Totally crushed. They somehow still managed to recover 5 years of photos for me. Worth every penny."
        }
    ];

    useEffect(() => {
        // Start infinite scroll animation based on marquee utility
        const ctx = gsap.context(() => {
            gsap.from('.review-heading', {
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="reviews" className="py-24 px-6 max-w-7xl mx-auto w-full bg-dark mt-10 rounded-[2rem] md:rounded-[3rem] border border-gray-200 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-gradient-to-r from-accent to-red-600"></div>
            <div className="review-heading text-center mb-12 md:mb-16 px-6">
                <SectionHeading subtitle="Real Customer Reviews" centered={true}>Don't just take our word for it.</SectionHeading>
            </div>

            {/* Infinite scrolling reviews container */}
            <div className="marquee w-full relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none"></div>

                <div className="marquee-content gap-6 px-3" style={{ animationDuration: '60s' }}>
                    {reviews.map((req, i) => (
                        <div key={i} className="w-[300px] md:w-[400px] flex-shrink-0">
                            <ReviewItem review={req} />
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {reviews.map((req, i) => (
                        <div key={'dup' + i} className="w-[300px] md:w-[400px] flex-shrink-0">
                            <ReviewItem review={req} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 7. FAQ (New)
const FAQItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item border-b border-gray-200 last:border-0 py-5">
            <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left hover:text-accent transition-colors font-bold text-lg text-primary">
                {question}
                <ChevronDown size={20} className={cn("transition-transform duration-300", open && "rotate-180")} />
            </button>
            <div className={cn("overflow-hidden transition-all duration-300 ease-in-out text-foreground/80 font-medium", open ? "max-h-40 pt-4" : "max-h-0")}>
                {answer}
            </div>
        </div>
    );
};

const FAQ = () => {
    const sectionRef = useRef(null);

    const faqs = [
        { q: "How long does a screen repair usually take?", a: "For most standard models (iPhone, Samsung Galaxy), we can complete a screen replacement in 30 to 60 minutes while you wait." },
        { q: "Do you use high-quality parts?", a: "Absolutely. We source premium OEM-grade parts to ensure your device functions perfectly and looks exactly like it did out of the box." },
        { q: "Is my personal data safe?", a: "Yes. We respect your privacy. We never access your personal files, and we don't require your passcode unless we are specifically running software diagnostics." },
        { q: "What does your warranty cover?", a: "We provide a solid 1-year warranty on our parts and labor. If the replacement part malfunctions (excluding physical damage like a new crack), we'll fix it for free." },
        { q: "Do I need to make an appointment?", a: "No appointment necessary! Walk-ins are always welcome. Just drop by the shop and we'll take care of you." }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.faq-container',
                { y: 30, opacity: 0 },
                { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="faq" className="py-20 px-6 max-w-3xl mx-auto w-full">
            <div className="faq-container">
                <SectionHeading subtitle="Common Questions" centered={true}>Things you might be wondering.</SectionHeading>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
                    {faqs.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
                </div>
            </div>
        </section>
    );
};

// 8. CONTACT / CALLBACK FORM
const ContactForm = () => {
    const sectionRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-element',
                { y: 30, opacity: 0 },
                { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            e.target.reset();
            setSubmitted(false);
        }, 4000);
    };

    return (
        <section ref={sectionRef} id="contact" className="py-24 px-6 bg-primary text-white border-t-8 border-accent">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Info Side */}
                <div className="contact-element">
                    <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight mb-6">
                        Ready to get your device <span className="text-accent">fixed today?</span>
                    </h2>
                    <p className="text-white/80 font-medium text-lg leading-relaxed mb-10">
                        Fill out the form, and a technician will call you back shortly with a quote and timeline. Need an answer now? Give us a call or send a text!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <a href="tel:5551234567" className="magnetic-btn bg-white text-primary px-6 py-3 rounded-md font-bold text-center flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                            <Phone size={18} /> Call Us Now
                        </a>
                        <a href="sms:5551234567" className="magnetic-btn bg-white/10 text-white border border-white/20 px-6 py-3 rounded-md font-bold text-center flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                            <MessageSquare size={18} /> Text Us
                        </a>
                    </div>

                    <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center"><MapPin size={20} className="text-accent" /></div>
                            <div>
                                <div className="font-bold text-lg">123 Main St, Dodge City, KS</div>
                                <div className="text-white/60 text-sm">Walk-ins always welcome</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center"><Clock size={20} className="text-accent" /></div>
                            <div>
                                <div className="font-bold text-lg">Mon-Sat: 9am - 6pm</div>
                                <div className="text-white/60 text-sm">Closed Sundays</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center"><Phone size={20} className="text-accent" /></div>
                            <div>
                                <div className="font-bold text-lg">620-253-4986</div>
                                <div className="text-white/60 text-sm">Call or text us anytime</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="contact-element bg-white p-8 md:p-10 rounded-xl shadow-2xl relative text-foreground min-h-[400px] flex flex-col justify-center">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className="font-heading font-black text-3xl text-primary mb-4">Request Sent!</h3>
                            <p className="text-foreground/80 font-medium text-lg">We have received your request and will contact you shortly with a quote and timeline.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-heading font-black text-2xl text-primary mb-6">Request a Quote</h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-foreground mb-1">Your Name</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-md bg-dark border border-gray-200 text-primary focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-foreground mb-1">Phone Number</label>
                                        <input required type="tel" className="w-full px-4 py-3 rounded-md bg-dark border border-gray-200 text-primary focus:outline-none focus:border-accent transition-colors" placeholder="(555) 000-0000" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-1">Device Model</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-md bg-dark border border-gray-200 text-primary focus:outline-none focus:border-accent transition-colors" placeholder="e.g. iPhone 13 Pro, Galaxy S22, PS5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-foreground mb-1">What's the issue?</label>
                                    <textarea required rows="4" className="w-full px-4 py-3 rounded-md bg-dark border border-gray-200 text-primary focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Screen is cracked and touch isn't working..."></textarea>
                                </div>
                                <button type="submit" disabled={submitted} className={`magnetic-btn w-full font-bold text-lg py-4 rounded-md mt-2 flex justify-center items-center transition-all duration-300 bg-accent text-white cursor-pointer hover:bg-red-700`}>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Send Request
                                    </span>
                                </button>
                            </form>
                        </>
                    )}
                </div>

            </div>
        </section>
    );
};

// FULL FOOTER
const Footer = () => (
    <footer className="bg-primary pt-10 pb-8 px-6 text-center text-white/40 font-heading text-sm border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="font-data tracking-wider uppercase text-xs text-white/80">Technicians Available</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Cell Clinic Dodge City. All rights reserved.</p>
    </footer>
);

// MAIN APP
export default function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0, 0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
        };
    }, []);

    return (
        <div className="bg-background min-h-screen relative font-heading">
            <Preloader />
            <div className="noise-bg"></div>
            <CustomCursor />
            <Navbar />
            <main>
                <Hero />
                <TrustBadges />
                <BrandMarquee />
                <Services />
                <About />
                <Process />
                <Reviews />
                <FAQ />
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
}
