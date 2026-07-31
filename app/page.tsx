const programs = [
  {
    number: "01",
    title: "Primeros pasos",
    text: "Un espacio de descubrimiento para bailar, jugar y construir confianza a través del movimiento.",
    image: "/primeros-pasos.png",
    alt: "Niñas de Vox Corpus en una presentación",
  },
  {
    number: "02",
    title: "Formación",
    text: "Técnica, musicalidad y presencia para crecer paso a paso y encontrar una voz propia al bailar.",
    image: "/grupo-intermedio.png",
    alt: "Grupo infantil de Vox Corpus en escena",
  },
  {
    number: "03",
    title: "Escena & equipo",
    text: "Entrenamiento, creación colectiva y experiencias escénicas que convierten el esfuerzo en memoria.",
    image: "/tiny-rockers.png",
    alt: "Equipo de danza urbana realizando una figura",
  },
];

const gallery = [
  {
    src: "/escenario-grupo.jpg",
    alt: "Elenco de Vox Corpus cerrando una coreografía grupal",
    className: "gallery-wide",
  },
  {
    src: "/contemporaneo-azul.jpg",
    alt: "Tres bailarinas en una coreografía contemporánea bajo luz azul",
    className: "gallery-tall",
  },
  {
    src: "/escenario-urbano-rojo.jpg",
    alt: "Grupo infantil de danza urbana en el escenario",
    className: "gallery-standard",
  },
  {
    src: "/escenario-contemporaneo.jpg",
    alt: "Grupo de danza contemporánea vestido de blanco",
    className: "gallery-standard",
  },
  {
    src: "/comunidad-vox.jpg",
    alt: "Comunidad de Vox Corpus reunida con sus reconocimientos",
    className: "gallery-wide gallery-community",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Vox Corpus Danza, inicio">
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#nosotros">Nosotros</a>
          <a href="#programas">Formación</a>
          <a href="#galeria">Galería</a>
          <a className="nav-cta" href="#contacto">Inscripciones</a>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Abrir menú"><span>Menú</span></summary>
          <nav aria-label="Navegación móvil">
            <a href="#nosotros">Nosotros</a>
            <a href="#programas">Formación</a>
            <a href="#galeria">Galería</a>
            <a href="#contacto">Inscripciones</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="inicio">
        <img
          className="hero-image"
          src="/escenario-grupo.jpg"
          alt="Presentación grupal de Vox Corpus Danza"
        />
        <div className="hero-wash" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow"><span /> Academia de danza · Formación escénica</p>
          <h1>
            Donde el cuerpo
            <span>encuentra su voz.</span>
          </h1>
          <p className="hero-copy">
            Un espacio para descubrir el movimiento, desarrollar disciplina y
            vivir la danza con libertad, carácter y comunidad.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#programas">Conoce la formación <span aria-hidden="true">↗</span></a>
            <a className="button button-ghost" href="#galeria">Ver nuestra energía</a>
          </div>
        </div>

        <div className="hero-footer" aria-label="Nuestros pilares">
          <p><span>01</span> Formación</p>
          <p><span>02</span> Comunidad</p>
          <p><span>03</span> Escena</p>
        </div>
        <p className="hero-scroll" aria-hidden="true">Desliza para descubrir <span>↓</span></p>
      </section>

      <section className="manifesto" id="nosotros">
        <div className="manifesto-mark" aria-hidden="true">VOX</div>
        <img className="manifesto-silhouette" src="/silueta-contemporaneo.png" alt="" />
        <div className="section-label"><span>01</span> Nuestra esencia</div>
        <div className="manifesto-layout">
          <h2>
            No solo<br />aprendemos pasos.
            <em>Construimos presencia.</em>
          </h2>
          <div className="manifesto-copy">
            <p className="lead">
              En Vox Corpus entendemos la danza como una forma de expresión,
              encuentro y crecimiento.
            </p>
            <p>
              Acompañamos cada proceso con sensibilidad y disciplina. Aquí cada
              cuerpo tiene algo que decir y cada escenario es una oportunidad
              para hacerlo visible.
            </p>
            <a className="text-link" href="#programas">Explora el camino <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section className="programs" id="programas">
        <div className="programs-heading">
          <div>
            <div className="section-label section-label-dark"><span>02</span> El camino</div>
            <h2>Encuentra tu<br /><em>propio ritmo.</em></h2>
          </div>
          <p>
            Procesos pensados para distintas etapas. El punto de partida cambia;
            las ganas de moverse nos conectan.
          </p>
        </div>

        <div className="program-list">
          {programs.map((program) => (
            <article className="program-card" key={program.number}>
              <div className="program-image-wrap">
                <img src={program.image} alt={program.alt} />
              </div>
              <p className="program-number">/{program.number}</p>
              <div>
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </div>
              <span className="program-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>

        <div className="styles-strip" aria-label="Estilos de danza">
          <span>Urbano</span><i>✦</i><span>Contemporáneo</span><i>✦</i><span>Creación</span><i>✦</i><span>Escena</span>
        </div>
      </section>

      <section className="gallery" id="galeria">
        <div className="gallery-heading">
          <div className="section-label"><span>03</span> En movimiento</div>
          <h2>La energía<br /><em>se vive en escena.</em></h2>
          <p>Entrenar. Crear. Compartir. Volver a empezar.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <figure className={image.className} key={image.src}>
              <img src={image.src} alt={image.alt} />
              <figcaption>Vox Corpus <span>0{index + 1}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="community">
        <img className="community-silhouette silhouette-left" src="/silueta-salto.png" alt="" />
        <img className="community-silhouette silhouette-right" src="/silueta-acrobacia-1.png" alt="" />
        <div className="community-content">
          <p className="eyebrow eyebrow-dark"><span /> Más que una academia</p>
          <h2>Somos movimiento.<br />Somos escena.<br /><em>Somos Vox Corpus.</em></h2>
          <p>
            Una comunidad que celebra el proceso, la autenticidad y la alegría
            de crecer bailando.
          </p>
        </div>
      </section>

      <section className="contact" id="contacto">
        <div className="contact-index" aria-hidden="true">04</div>
        <div className="section-label section-label-dark"><span>04</span> Próximo paso</div>
        <div className="contact-layout">
          <h2>Tu próxima historia<br />puede empezar <em>aquí.</em></h2>
          <div className="contact-copy">
            <p>
              Estamos preparando la información completa de grupos, horarios,
              ubicación y proceso de inscripción.
            </p>
            <div className="coming-soon">
              <span>Muy pronto</span>
              <p>Nuevos canales de contacto e inscripciones</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
          <p>El cuerpo habla. Nosotros bailamos.</p>
        </div>
        <div className="footer-nav">
          <p>Navega</p>
          <a href="#nosotros">Nosotros</a>
          <a href="#programas">Formación</a>
          <a href="#galeria">Galería</a>
        </div>
        <div className="footer-status">
          <p>Información</p>
          <span>Sitio en construcción</span>
          <small>© {new Date().getFullYear()} Vox Corpus Danza</small>
        </div>
      </footer>
    </main>
  );
}
