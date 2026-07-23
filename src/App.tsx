import { useEffect, useRef, useState } from 'react';
import {
  Phone, Mail, MapPin, Code2, Cloud, Database,
  Briefcase, GraduationCap, User, ChevronDown, Layers,
  GitBranch, Star, Award, Users, Zap
} from 'lucide-react';
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";

// ── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {count}{suffix}
    </span>
  );
}

// ── Skill bar ───────────────────────────────────────────────────────────────
function SkillBar({ label, percent, delay = 0 }: { label: string; percent: number; delay?: number }) {
  const { ref, visible } = useInView();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-xs" style={{ color: 'var(--neon-blue)' }}>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full" style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.1)' }}>
        <div
          className="skill-bar-fill"
          style={{
            '--target-width': `${percent}%`,
            width: visible ? `${percent}%` : '0%',
            transitionDelay: `${delay}ms`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 px-4 md:px-8 max-w-6xl mx-auto ${className}`}>
      {children}
    </section>
  );
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`fade-up ${visible ? 'visible' : ''} flex items-center gap-4 mb-12`}
    >
      <div className="p-3 rounded-xl" style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)' }}>
        <Icon size={22} style={{ color: 'var(--neon-blue)' }} />
      </div>
      <h2 className={`text-3xl font-bold text-white section-heading ${visible ? 'visible' : ''}`}>{title}</h2>
    </div>
  );
}

// ── Particles ───────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Typing effect ───────────────────────────────────────────────────────────
function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index % texts.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex(i => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return <span className="typing-cursor">{displayed}</span>;
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const skills = [
    { label: 'Project & Stakeholder Management', percent: 95 },
    { label: 'System Architecture & Design', percent: 90 },
    { label: 'Team Leadership & Agile', percent: 92 },
    { label: 'Performance Optimisation', percent: 88 },
    { label: 'Technology Strategy & Roadmapping', percent: 85 },
    { label: 'Full-Stack Development', percent: 90 },
  ];

  const languages = ['C#', 'HTML5', 'CSS3', 'PHP', 'Java', 'JavaScript', 'TypeScript'];
  const frameworks = ['AngularJS', 'Angular', '.NET', 'Node.js', 'MVC', 'REST API'];
  const devops = ['Jenkins', 'GitLab CI/CD'];
  const databases = ['MySQL', 'PostgreSQL', 'Redis', 'NHibernate', 'Entity Framework'];
  const cloud = ['AWS', 'Azure'];

  const experience = [
    {
      company: 'Temo Digital',
      role: 'Director & Senior Developer',
      period: 'Oct 2018 – June 2025',
      points: [
        'Managed full software lifecycles from concept to deployment using Agile methodologies to ensure efficiency, quality, and timely delivery.',
        'Led cross-functional teams, managed client relations, and aligned technical solutions with business objectives.',
        'Delivered complex projects end-to-end with strong hands-on expertise in front-end and back-end development.',
      ],
    },
    {
      company: 'Temo Consulting',
      role: 'Junior Developer',
      period: '2016 – Oct 2018',
      points: [
        'Contributed to multiple projects, quickly adapting to different environments and completing tasks across varied technologies.',
        'Built add-ons to existing systems and managed client expectations to ensure all requirements were met.',
      ],
    },
    {
      company: 'University of Cape Town',
      role: 'Tutor, Mentor & Orientation Leader',
      period: '2014 – 2015',
      points: [
        'Mentored and tutored students, boosting academic performance and confidence.',
        'Led orientation sessions, helping new students integrate and engage with campus life.',
      ],
    },
  ];

  const references = [
    { name: 'Wahseema Miller', company: 'Temo Digital', phone: '082 595 4472', email: 'waseema@temo.co.za' },
    { name: 'Russell Miller', company: 'Temo Consulting', phone: '083 700 0441', email: 'russell@temo.co.za' },
    { name: 'Garry Stewart', company: 'UCT – Temo Consulting', phone: '021 650 2665', email: 'gstewart@cs.uct.ac.za' },
  ];

  // Inline animation hook instances for various sections
  const heroTextRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 200);
  }, []);

  const statsRef = useInView();
  const aboutRef = useInView();

  return (
    <div className="relative grid-bg min-h-screen" style={{ background: 'var(--dark-bg)' }}>
      <div className="scanlines" />
      <Particles />

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(6,13,26,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,200,255,0.1)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg tracking-wider" style={{ color: 'var(--neon-blue)', fontFamily: 'Space Grotesk' }}>
            MJ<span className="text-white">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8">
            {['about', 'experience', 'skills', 'education', 'contact'].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="nav-link capitalize">
                {s}
              </button>
            ))}
          </div>
          <a onClick={() => scrollTo('contact')}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            style={{
              background: 'rgba(0,200,255,0.1)',
              border: '1px solid rgba(0,200,255,0.3)',
              color: 'var(--neon-blue)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.2)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,200,255,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.1)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Contact Me
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Background radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,100,255,0.07) 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-16 items-center py-32">
          {/* Text */}
          <div
            ref={heroTextRef}
            className={`fade-left ${heroVisible ? 'visible' : ''}`}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
              style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', color: 'var(--neon-blue)' }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-blue)' }} />
              Available for opportunities
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 text-white">
              MICHAEL<br />
              <span style={{ color: 'var(--neon-blue)', textShadow: '0 0 30px rgba(0,200,255,0.4)' }}>JANUARY</span>
            </h1>

            <div className="text-lg md:text-xl font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
              <TypingText texts={['Director', 'Senior Developer', 'Agile Leader', 'Full-Stack Engineer', 'Technology Strategist']} />
            </div>

            <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
              Results-driven Director with strong senior development expertise, leading cross-functional teams and delivering complex software projects from concept to deployment.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo('experience')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #0066ff, #00c8ff)',
                  color: '#fff',
                  boxShadow: '0 0 30px rgba(0,200,255,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,200,255,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,200,255,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <Briefcase size={16} /> View Experience
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--neon-blue)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.08)'; }}
              >
                <Mail size={16} /> Get In Touch
              </button>
            </div>
          </div>

          {/* Image */}
          <div className={`fade-right ${heroVisible ? 'visible' : ''} flex justify-center delay-200`}>
            <div className="relative">
              <div className="hero-image-wrapper w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden" style={{ padding: '3px', background: 'conic-gradient(from 0deg, #00c8ff, #0066ff, #00c8ff)' }}>
                <div className="w-full h-full rounded-full overflow-hidden" style={{ background: 'var(--dark-bg)' }}>
                  <img
                    src={`${import.meta.env.BASE_URL}images/Mike_Tech_4_T.png`}
                    alt="Michael January"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.3))' }}
                  />
                </div>
              </div>
              {/* Orbit ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '1px dashed rgba(0,200,255,0.2)',
                  transform: 'scale(1.15)',
                  animation: 'rotate-border 12s linear infinite',
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '1px dashed rgba(0,100,255,0.15)',
                  transform: 'scale(1.3)',
                  animation: 'rotate-border 20s linear infinite reverse',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="border-y" style={{ borderColor: 'rgba(0,200,255,0.08)', background: 'rgba(0,200,255,0.02)' }}>
        <div
          ref={statsRef.ref as React.RefObject<HTMLDivElement>}
          className={`max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4`}
        >
          {[
            { label: 'Years Experience', value: 8, suffix: '+', icon: Zap },
            { label: 'Projects Delivered', value: 25, suffix: '+', icon: Code2 },
            { label: 'Technologies', value: 20, suffix: '+', icon: Layers },
            { label: 'Teams Led', value: 5, suffix: '+', icon: Users },
          ].map((stat, i) => (
            <div
              key={i}
              className={`stat-box fade-up ${statsRef.visible ? 'visible' : ''} delay-${(i + 1) * 100}`}
            >
              <stat.icon size={20} className="mx-auto mb-2" style={{ color: 'var(--neon-blue)' }} />
              <div className="text-3xl font-black text-white">
                {statsRef.visible && <Counter target={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <Section id="about">
        <SectionHeading icon={User} title="Profile" />
        <div
          ref={aboutRef.ref as React.RefObject<HTMLDivElement>}
          className={`fade-up ${aboutRef.visible ? 'visible' : ''} grid md:grid-cols-3 gap-6`}
        >
          <div
            className="md:col-span-2 p-8 rounded-2xl neon-border card-hover"
            style={{ background: 'var(--card-bg)' }}
          >
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Results-driven Director with strong senior development expertise, experienced in leading cross-functional teams and delivering complex software projects from concept to deployment. Skilled in applying Agile methodologies to drive collaboration, efficiency, and on-time delivery.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Proven ability to balance technical leadership with client engagement, ensuring solutions meet business goals while maintaining high-quality standards. Adept at guiding teams through version control, automation, and modern development practices, while fostering a culture of innovation and accountability.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Phone, label: '083 462 6003', url: 'tel:+27834626003' },
              { icon: Mail, label: 'michaelcjanuary@gmail.com', url: 'mailto:michaelcjanuary@gmail.com' },
              { icon: MapPin, label: 'Strandfontein, Cape Town, South Africa', url: '' },
            ].map((item, i) => (
              <div key={i} className={`contact-item delay-${(i + 1) * 200}`}>
                <a href={item.url}>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(0,200,255,0.1)' }}>
                    <item.icon size={16} style={{ color: 'var(--neon-blue)' }} />
                  </div>
                </a>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Experience ── */}
      <Section id="experience">
        <SectionHeading icon={Briefcase} title="Work Experience" />
        <div className="relative pl-10">
          <div className="timeline-line" />
          {experience.map((job, i) => {
            const { ref, visible } = useInView();
            return (
              <div
                key={i}
                ref={ref as React.RefObject<HTMLDivElement>}
                className={`fade-up ${visible ? 'visible' : ''} relative mb-10 delay-${i * 200}`}
              >
                {/* Dot */}
                <div className="timeline-dot absolute -left-[34px] top-5" />

                <div className="p-6 rounded-2xl neon-border card-hover" style={{ background: 'var(--card-bg)' }}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{job.company}</h3>
                      <p className="font-medium" style={{ color: 'var(--neon-blue)' }}>{job.role}</p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)', color: 'var(--neon-blue)' }}
                    >
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {job.points.map((p, j) => (
                      <li key={j} className="flex gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <Star size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--neon-blue)' }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Skills ── */}
      <Section id="skills">
        <SectionHeading icon={Zap} title="Skills & Technologies" />
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skill bars */}
          <div className="p-8 rounded-2xl neon-border card-hover" style={{ background: 'var(--card-bg)' }}>
            <h3 className="text-lg font-semibold text-white mb-6">Core Competencies</h3>
            {skills.map((s, i) => (
              <SkillBar key={i} label={s.label} percent={s.percent} delay={i * 100} />
            ))}
          </div>

          {/* Tech tags */}
          <div className="space-y-6">
            {[
              { icon: Code2, title: 'Languages', items: languages },
              { icon: Layers, title: 'Frameworks', items: frameworks },
              { icon: GitBranch, title: 'DevOps', items: devops },
              { icon: Database, title: 'Databases', items: databases },
              { icon: Cloud, title: 'Cloud Platforms', items: cloud },
            ].map((group, gi) => {
              const { ref, visible } = useInView();
              return (
                <div
                  key={gi}
                  ref={ref as React.RefObject<HTMLDivElement>}
                  className={`fade-up ${visible ? 'visible' : ''} p-5 rounded-2xl neon-border card-hover delay-${gi * 100}`}
                  style={{ background: 'var(--card-bg)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <group.icon size={15} style={{ color: 'var(--neon-blue)' }} />
                    <h4 className="text-sm font-semibold text-white">{group.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(item => (
                      <span key={item} className="tech-tag">{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Education ── */}
      <Section id="education">
        <SectionHeading icon={GraduationCap} title="Education" />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              school: 'University of Cape Town',
              degrees: ['BSc Computer Science', 'BSc Games Development'],
              period: '2012 – 2018',
              icon: '🎓',
            },
            {
              school: 'South Peninsula High',
              degrees: ["Bachelor's Pass"],
              period: '2007 – 2011',
              icon: '🏫',
            },
          ].map((edu, i) => {
            const { ref, visible } = useInView();
            return (
              <div
                key={i}
                ref={ref as React.RefObject<HTMLDivElement>}
                className={`fade-up ${visible ? 'visible' : ''} p-8 rounded-2xl neon-border card-hover delay-${i * 200}`}
                style={{ background: 'var(--card-bg)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{edu.school}</h3>
                    {edu.degrees.map(d => (
                      <p key={d} className="text-sm mt-1" style={{ color: 'var(--neon-blue)' }}>{d}</p>
                    ))}
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium shrink-0"
                    style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)', color: 'var(--neon-blue)' }}
                  >
                    {edu.period}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} style={{ color: 'var(--neon-blue)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completed</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── References ── */}
      <Section id="references">
        <SectionHeading icon={Users} title="References" />
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {references.map((ref, i) => {
            const { ref: elRef, visible } = useInView();
            return (
              <div
                key={i}
                ref={elRef as React.RefObject<HTMLDivElement>}
                className={`fade-up ${visible ? 'visible' : ''} p-6 rounded-2xl neon-border card-hover delay-${i * 150}`}
                style={{ background: 'var(--card-bg)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)' }}>
                  <User size={18} style={{ color: 'var(--neon-blue)' }} />
                </div>
                <h3 className="font-bold text-white mb-1">{ref.name}</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--neon-blue)' }}>{ref.company}</p>
                <div className="space-y-2">
                  <a href={`tel:${ref.phone}`} className="flex items-center gap-2 text-xs transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                    <Phone size={12} /> {ref.phone}
                  </a>
                  <a href={`mailto:${ref.email}`} className="flex items-center gap-2 text-xs transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={12} /> {ref.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="contact">
        <SectionHeading icon={Phone} title="Contact Me" />
        {/* CTA */}
        <div className="text-center p-12 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0,100,255,0.08), rgba(0,200,255,0.08))', border: '1px solid rgba(0,200,255,0.15)' }}>
          <h3 className="text-3xl font-black text-white mb-3">Let's Build Something Great</h3>
          <p className="mb-8 text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Open to exciting opportunities, just one conversation away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:michaelcjanuary@gmail.com"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0066ff, #00c8ff)', color: '#fff', boxShadow: '0 0 30px rgba(0,200,255,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(0,200,255,0.5)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(0,200,255,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <Mail size={16} /> Email Me
            </a>
            <a
              href="tel:0834626003"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--neon-blue)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.08)'; }}
            >
              <Phone size={16} /> Call Me
            </a>
            <a
              href="https://wa.me/27834626003"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--neon-blue)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.08)'; }}
            >
              <FaWhatsapp size={16} /> Let's Chat
            </a>
            <a
              href="https://www.linkedin.com/in/michael-january-7b329884/"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{ background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.3)', color: 'var(--neon-blue)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,200,255,0.08)'; }}
            >
              <FaLinkedin size={16} /> Let's Connect
            </a>
          </div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(0,200,255,0.08)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} Michael January. Crafted with react, vue.js and tailwind.
        </p>
      </footer>
    </div>
  );
}
