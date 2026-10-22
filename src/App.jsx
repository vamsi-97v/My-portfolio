import { useEffect, useRef, useState } from "react";
import { profile, stats, skills, experience, projects, education } from "./data.js";

function Reveal({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (e.target.classList.add("in"), io.disconnect()),
      { threshold: 0.12 }
    );
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

const Section = ({ id, title, children }) => (
  <section id={id} className="section">
    <Reveal>
      <h2 className="section-title"><span>{"// "}</span>{title}</h2>
      {children}
    </Reveal>
  </section>
);

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"); }
    catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const links = ["about", "skills", "experience", "projects", "contact"];

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">vamsi<span>.dev</span></a>
        <nav>
          {links.map((l) => <a key={l} href={`#${l}`}>{l}</a>)}
          <button className="icon-btn" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="mono accent">Hi, my name is</p>
          <h1>{profile.name}.</h1>
          <h2 className="hero-sub">{profile.role}</h2>
          <p className="lead">{profile.tagline}</p>
          <div className="cta">
            <a className="btn primary" href="#projects">View my work</a>
            <a className="btn" href="#contact">Get in touch</a>
          </div>
          <p className="mono muted small">● {profile.availability}</p>
        </section>

        <Section id="about" title="About">
          <p className="lead narrow">{profile.summary}</p>
          <div className="stats">
            {stats.map((s) => (
              <div className="card stat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="grid">
            {Object.entries(skills).map(([group, items]) => (
              <div className="card" key={group}>
                <h3>{group}</h3>
                <div className="tags">{items.map((i) => <span key={i} className="tag">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <div className="timeline">
            {experience.map((e) => (
              <div className="tl-item" key={e.role + e.period}>
                <h3>{e.role}</h3>
                <p className="mono accent small">{e.company} | {e.period}</p>
                {e.points.length > 0 && <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>}
              </div>
            ))}
          </div>
          <h3 className="sub-head">Education & Certification</h3>
          <div className="grid">
            {education.map((e) => (
              <div className="card" key={e.title}>
                <h3>{e.title}</h3>
                <p className="muted">{e.place}</p>
                <p className="mono accent small">{e.period}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid two">
            {projects.map((p) => (
              <article className="card project" key={p.title}>
                <p className="mono accent small">{p.subtitle}</p>
                <h3>{p.title}</h3>
                <p className="muted">{p.description}</p>
                <ul>{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                <div className="tags">{p.tech.map((t) => <span key={t} className="tag mono">{t}</span>)}</div>
                {p.link && <a className="btn small-btn" href={p.link} target="_blank" rel="noreferrer">Visit →</a>}
              </article>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <p className="lead narrow">Open to new opportunities. Let's build something great together.</p>
          <div className="cta">
            <a className="btn primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn" href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </Section>
      </main>

      <footer className="footer mono small muted">
        Designed and built by {profile.name}
      </footer>
    </>
  );
}
