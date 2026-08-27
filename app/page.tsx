const programs = [
  {
    title: "Primeros pasos",
    label: "Nivel inicial",
    text: "Un comienzo cercano para descubrir la danza a través del juego, la música y el movimiento.",
    image: "/primeros-pasos.png",
    alt: "Niñas de Vox Corpus disfrutando una presentación",
  },
  {
    title: "Formación infantil",
    label: "Nivel infantil",
    text: "Procesos que fortalecen coordinación, escucha, disciplina y seguridad al bailar.",
    image: "/team-girls.png",
    alt: "Grupo infantil de Vox Corpus en escena",
  },
  {
    title: "Nivel intermedio",
    label: "Nivel intermedio",
    text: "Entrenamiento para ampliar recursos, musicalidad y confianza frente al escenario.",
    image: "/grupo-intermedio.png",
    alt: "Estudiantes de nivel intermedio en una coreografía",
  },
  {
    title: "Danza urbana",
    label: "Formación urbana",
    text: "Ritmo, identidad y creación colectiva en una experiencia dinámica y formativa.",
    image: "/escenario-urbano-azul.jpg",
    alt: "Grupo de danza urbana de Vox Corpus en una presentación",
  },
  {
    title: "Contemporáneo",
    label: "Formación escénica",
    text: "Un espacio para investigar el cuerpo, la emoción y nuevas formas de expresión.",
    image: "/contemporaneo-azul.jpg",
    alt: "Bailarinas de Vox Corpus en una obra contemporánea",
  },
];

const values = [
  ["01", "Formación integral", "Técnica, sensibilidad y carácter en un mismo proceso."],
  ["02", "Acompañamiento", "Cada estudiante encuentra su ritmo y una voz propia."],
  ["03", "Experiencia escénica", "El aprendizaje también se transforma en presencia."],
  ["04", "Comunidad", "Crecer bailando es un camino que se comparte."],
];

const gallery = [
  {
    src: "/escenario-grupo.jpg",
    alt: "Elenco de Vox Corpus cerrando una coreografía grupal",
    className: "experience-main",
  },
  {
    src: "/escenario-urbano-rojo.jpg",
    alt: "Grupo infantil de danza urbana en el escenario",
    className: "experience-side",
  },
  {
    src: "/escenario-contemporaneo.jpg",
    alt: "Grupo de danza contemporánea vestido de blanco",
    className: "experience-side",
  },
  {
    src: "/comunidad-vox.jpg",
    alt: "Comunidad Vox Corpus reunida con sus reconocimientos",
    className: "experience-wide",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Vox Corpus Danza, inicio">
          <span className="brand-mark" aria-hidden="true" />
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#academia">La academia</a>
          <a href="#programas">Programas</a>
          <a href="#experiencias">Experiencias</a>
          <a href="#horarios">Horarios</a>
          <a href="#contacto">Contacto</a>
          <a className="nav-cta" href="#contacto">Inscríbete <span aria-hidden="true">→</span></a>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Abrir menú"><span>Menú</span></summary>
          <nav aria-label="Navegación móvil">
            <a href="#inicio">Inicio</a>
            <a href="#academia">La academia</a>
            <a href="#programas">Programas</a>
            <a href="#experiencias">Experiencias</a>
            <a href="#horarios">Horarios</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy-panel">
          <img
            className="hero-graphic"
            src="/vox-forma-circulo.png"
            alt=""
            aria-hidden="true"
          />
          <p className="eyebrow">Formación en danza para la vida</p>
          <h1>La danza como fundamento <span>para la vida</span></h1>
          <p className="hero-copy">
            Acompañamos procesos de formación artística donde cada cuerpo puede
            aprender, expresarse y crecer con disciplina, libertad y comunidad.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#programas">Conoce los programas <span aria-hidden="true">→</span></a>
            <a className="button button-secondary" href="#contacto">Solicita información</a>
          </div>
        </div>

        <figure className="hero-media">
          <img src="/escenario-contemporaneo.jpg" alt="Estudiantes de Vox Corpus en una presentación de danza contemporánea" />
          <figcaption>Formación · Comunidad · Escena</figcaption>
          <div className="hero-index" aria-hidden="true">
            <strong>01</strong><span>02</span><span>03</span><span>04</span>
          </div>
        </figure>
      </section>

      <section className="value-strip" aria-label="Principios de Vox Corpus">
        {values.map(([number, title, text]) => (
          <article key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{text}</p></div>
          </article>
        ))}
      </section>

      <section className="programs-section" id="programas">
        <div className="section-heading">
          <div>
            <p className="section-label">Programas</p>
            <h2>Clases para <span>cada etapa</span></h2>
          </div>
          <p>
            Propuestas para explorar, aprender y avanzar. Cada programa
            acompaña un momento distinto del proceso formativo.
          </p>
        </div>

        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.title}>
              <div className="program-image">
                <img src={program.image} alt={program.alt} />
              </div>
              <div className="program-body">
                <p>{program.label}</p>
                <h3>{program.title}</h3>
                <span>{program.text}</span>
                <a href="#contacto" aria-label={`Solicitar información sobre ${program.title}`}>Información <b aria-hidden="true">→</b></a>
              </div>
            </article>
          ))}
        </div>

        <div className="schedule-callout" id="horarios">
          <div>
            <p className="section-label">Horarios y grupos</p>
            <h3>Encuentra el proceso adecuado.</h3>
          </div>
          <p>
            La disponibilidad se organiza según el programa y el nivel. Escríbenos
            para conocer los grupos y horarios vigentes y recibir orientación personal.
          </p>
          <a className="button button-secondary" href="mailto:voxcorpusdanza@gmail.com">
            Consultar horarios <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="academy-section" id="academia">
        <div className="academy-media">
          <img src="/comunidad-vox.jpg" alt="Estudiantes de Vox Corpus celebrando sus procesos y reconocimientos" />
          <span>Vox Corpus Danza</span>
        </div>
        <div className="academy-copy">
          <p className="section-label">La academia</p>
          <h2>Formar para la vida, <span>bailar con propósito.</span></h2>
          <p className="academy-lead">
            Entendemos la danza como una herramienta para construir presencia,
            autonomía, sensibilidad y vínculos reales.
          </p>
          <p>
            Cada clase hace parte de un proceso humano y artístico. Acompañamos
            a nuestros estudiantes para que desarrollen recursos técnicos sin
            perder la alegría, la autenticidad ni el sentido de comunidad.
          </p>
          <div className="academy-points">
            <div><strong>Proceso</strong><span>Aprender paso a paso.</span></div>
            <div><strong>Expresión</strong><span>Dar valor a una voz propia.</span></div>
            <div><strong>Escena</strong><span>Convertir el trabajo en memoria.</span></div>
          </div>
        </div>
      </section>

      <section className="stage-section">
        <img
          className="stage-graphic"
          src="/vox-silueta-urbana.png"
          alt=""
          aria-hidden="true"
        />
        <div className="stage-copy">
          <p className="section-label section-label-light">Experiencia escénica</p>
          <h2>El escenario también <span>educa.</span></h2>
          <p>
            Presentarse, trabajar en equipo y sostener una creación fortalece
            la confianza. En Vox Corpus, la escena es una parte viva del proceso.
          </p>
          <a className="button button-light" href="#experiencias">Ver nuestra energía <span aria-hidden="true">→</span></a>
        </div>
        <div className="stage-media">
          <img src="/escenario-grupo.jpg" alt="Elenco de Vox Corpus en una presentación grupal" />
        </div>
      </section>

      <section className="experiences-section" id="experiencias">
        <div className="section-heading experiences-heading">
          <div>
            <p className="section-label">Experiencias</p>
            <h2>La danza <span>se vive</span></h2>
          </div>
          <p>Ensayar. Crear. Compartir. Celebrar cada nuevo movimiento.</p>
        </div>

        <div className="experience-grid">
          {gallery.map((image, index) => (
            <figure className={image.className} key={image.src}>
              <img src={image.src} alt={image.alt} />
              <figcaption><span>Vox Corpus</span><b>0{index + 1}</b></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="community-quote">
        <p>Más que una academia</p>
        <blockquote>“Cada cuerpo tiene algo que decir.”</blockquote>
        <span>Una comunidad para aprender, crear y crecer bailando.</span>
      </section>

      <section className="contact-section" id="contacto">
        <img
          className="contact-graphic"
          src="/vox-forma-equis.png"
          alt=""
          aria-hidden="true"
        />
        <div>
          <p className="section-label">Próximo paso</p>
          <h2>Tu historia puede empezar <span>aquí.</span></h2>
        </div>
        <div className="contact-copy">
          <p>
            Cuéntanos qué programa te interesa. Te orientaremos personalmente
            sobre el nivel, los grupos disponibles y el proceso de inscripción.
          </p>
          <div className="contact-status"><span>Atención personalizada</span><strong>Horarios según programa y nivel</strong></div>
          <a className="button button-primary" href="mailto:voxcorpusdanza@gmail.com">Escríbenos <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-brand-mark" aria-hidden="true" />
          <p>La danza como fundamento para la vida.</p>
          <a href="mailto:voxcorpusdanza@gmail.com">voxcorpusdanza@gmail.com</a>
        </div>
        <div className="footer-links">
          <p>Navega</p>
          <a href="#academia">La academia</a>
          <a href="#programas">Programas</a>
          <a href="#experiencias">Experiencias</a>
          <a href="#horarios">Horarios</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="footer-links">
          <p>Información</p>
          <a href="/app/">Descarga Vox Danza</a>
          <a href="/politica_privacidad_vox_danza/">Política de privacidad</a>
          <a href="/cancelar_cuenta_vox_danza/">Eliminar cuenta de Vox Danza</a>
          <span>Canal oficial de Vox Corpus Danza</span>
          <small>© {new Date().getFullYear()} Vox Corpus Danza</small>
        </div>
        <a className="footer-cta" href="#contacto">Inscríbete <span aria-hidden="true">→</span></a>
      </footer>
    </main>
  );
}
