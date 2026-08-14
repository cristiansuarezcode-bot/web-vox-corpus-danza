import type { Metadata } from "next";
import styles from "../cancelar_cuenta_vox_danza/page.module.css";

export const metadata: Metadata = {
  title: "Política de privacidad de Vox Danza | Vox Corpus Danza",
  description:
    "Política oficial sobre el tratamiento de datos personales en la aplicación Vox Danza.",
  openGraph: {
    title: "Política de privacidad de Vox Danza",
    description:
      "Información oficial sobre los datos utilizados por la aplicación Vox Danza.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Política de privacidad de Vox Danza",
    description:
      "Información oficial sobre los datos utilizados por la aplicación Vox Danza.",
    images: [],
  },
};

const datosTratados = [
  "Nombre, correo electrónico, identificador de cuenta y rol asignado por la academia.",
  "Fotografía de perfil y, para docentes, presentación profesional y estilos que enseña.",
  "Matrículas, clases, asistencias, eventos, créditos del proceso y clases personalizadas.",
  "Preferencias de la app, estado de lectura de notificaciones, plataforma y versión instalada.",
  "Identificador de instalación o token necesario para entregar notificaciones.",
];

const finalidades = [
  ["Acceso y cuenta", "Autenticar a la persona usuaria y mostrar la experiencia correspondiente a su rol."],
  ["Proceso académico", "Presentar información de clases, matrículas, asistencia, eventos y avance dentro de la academia."],
  ["Comunicación", "Entregar avisos operativos, académicos, de asistencia y de seguridad mediante notificaciones."],
  ["Soporte y privacidad", "Atender solicitudes de actualización, control de acceso, corrección o eliminación."],
];

const proveedores = [
  ["Supabase", "Autenticación, base de datos, almacenamiento de fotografías y funciones operativas."],
  ["Firebase Cloud Messaging", "Entrega de notificaciones y administración del identificador de instalación."],
  ["Apple y Google", "Distribución de la app y servicios propios del sistema operativo."],
];

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/" aria-label="Volver al inicio de Vox Corpus Danza">
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
        </a>
        <span className={styles.utility}>Centro de privacidad · Vox Danza</span>
      </header>

      <section className={styles.hero}>
        <img
          className={styles.heroGraphic}
          src="/vox-forma-diagonal.png"
          alt=""
          aria-hidden="true"
        />
        <div className={styles.heroLabel}><span /> Documento oficial</div>
        <h1>Política de privacidad<br /><em>de Vox Danza.</em></h1>
        <p>
          Vox Corpus Danza es responsable del tratamiento de los datos personales
          utilizados por la aplicación móvil Vox Danza. Aquí explicamos qué
          información utilizamos, con qué finalidad y cómo puede ejercerse el
          derecho a consultarla, corregirla o eliminarla.
        </p>
        <a className={styles.primaryAction} href="#derechos">
          Consultar tus derechos <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className={styles.notice} aria-label="Información principal">
        <strong>Responsable y contacto</strong>
        <p>
          <b>Vox Corpus Danza</b><br />
          Parque Cultural Erato, Local 103B · Calle 75 Sur #43A-90,<br />
          Sabaneta, Antioquia, Colombia.<br />
          Teléfono: <a href="tel:+573112710369">+57 311 271 0369</a> · Correo:{` `}
          <a href="mailto:voxcorpusdanza@gmail.com">voxcorpusdanza@gmail.com</a>.
          Las cuentas de estudiantes menores de edad son gestionadas con su
          madre, padre o acudiente autorizado.
        </p>
      </section>

      <section className={`${styles.contentSection} ${styles.dataSection}`}>
        <img
          className={styles.dataGraphic}
          src="/vox-silueta-urbana.png"
          alt=""
          aria-hidden="true"
        />
        <div className={styles.sectionNumber}>01</div>
        <div>
          <p className={styles.kicker}>Información utilizada</p>
          <h2>Datos necesarios<br />para acompañar el proceso.</h2>
        </div>
        <div className={styles.dataCopy}>
          <ul>
            {datosTratados.map((dato) => <li key={dato}>{dato}</li>)}
          </ul>
          <div className={styles.retentionNote}>
            <strong>No vendemos datos personales</strong>
            <p>
              La app no usa publicidad ni comercializa información personal. Los
              datos se utilizan para prestar y proteger los servicios de Vox Danza.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionNumber}>02</div>
        <div>
          <p className={styles.kicker}>Finalidades</p>
          <h2>Por qué usamos<br />la información.</h2>
        </div>
        <ol className={styles.steps}>
          {finalidades.map(([titulo, texto], index) => (
            <li key={titulo}>
              <span>{index + 1}</span>
              <div><strong>{titulo}</strong><p>{texto}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionNumber}>03</div>
        <div>
          <p className={styles.kicker}>Visibilidad y comunidad</p>
          <h2>Información limitada<br />según cada rol.</h2>
        </div>
        <ol className={styles.steps}>
          <li><span>1</span><div><strong>Estudiantes</strong><p>Su información académica se muestra dentro de su propia sesión. No tienen un perfil público descubrible en la comunidad.</p></div></li>
          <li><span>2</span><div><strong>Docentes</strong><p>Pueden mostrar un perfil profesional con nombre, foto, presentación y estilos que enseñan.</p></div></li>
          <li><span>3</span><div><strong>Ficha operativa docente</strong><p>Un profesor solo puede consultar nombre, foto y estado de matrícula de estudiantes inscritos en sus propios cursos.</p></div></li>
          <li><span>4</span><div><strong>Administración</strong><p>El personal autorizado conserva el acceso operativo necesario para gestionar la academia.</p></div></li>
        </ol>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionNumber}>04</div>
        <div>
          <p className={styles.kicker}>Proveedores</p>
          <h2>Servicios que ayudan<br />a operar la app.</h2>
        </div>
        <ol className={styles.steps}>
          {proveedores.map(([titulo, texto], index) => (
            <li key={titulo}>
              <span>{index + 1}</span>
              <div><strong>{titulo}</strong><p>{texto}</p></div>
            </li>
          ))}
          <li><span>4</span><div><strong>Mapas externos</strong><p>“Cómo llegar” abre Google Maps, Apple Maps u otra app disponible. Vox Danza no solicita ni recopila la ubicación actual del dispositivo.</p></div></li>
        </ol>
      </section>

      <section className={styles.contentSection} id="derechos">
        <div className={styles.sectionNumber}>05</div>
        <div>
          <p className={styles.kicker}>Conservación y derechos</p>
          <h2>Control sobre<br />tus datos.</h2>
        </div>
        <ol className={styles.steps}>
          <li><span>1</span><div><strong>Consulta y corrección</strong><p>La persona usuaria o su representante puede solicitar acceso, actualización, corrección o limitación de sus datos.</p></div></li>
          <li><span>2</span><div><strong>Eliminación</strong><p>Los estudiantes pueden iniciar la eliminación desde Configuración → Gestionar cuenta. Las cuentas docentes requieren revisión para reasignar cursos activos.</p></div></li>
          <li><span>3</span><div><strong>Conservación restringida</strong><p>Al eliminar una cuenta se eliminan o anonimizan sus datos personales. Los registros históricos de matrículas, asistencia, créditos del proceso, pagos y auditoría pueden conservarse de forma restringida hasta por 10 años para obligaciones administrativas, contables, contractuales o de seguridad.</p></div></li>
          <li><span>4</span><div><strong>Procedimiento externo</strong><p>También puedes iniciar una solicitud desde la <a href="/cancelar_cuenta_vox_danza/">página pública de eliminación de cuenta</a>, sin instalar ni abrir la app.</p></div></li>
        </ol>
      </section>

      <section className={styles.security}>
        <strong>Seguridad y cambios</strong>
        <p>
          Aplicamos controles de acceso, cifrado durante la transmisión y medidas
          razonables de protección. Podemos actualizar esta política cuando cambie
          la app o la normativa; la fecha publicada identificará la versión vigente.
        </p>
      </section>

      <footer className={styles.footer}>
        <div>
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
          <p>Política oficial de la aplicación Vox Danza.</p>
        </div>
        <div>
          <a href="/cancelar_cuenta_vox_danza/">Solicitar eliminación de cuenta</a>
          <span>Última actualización: 14 de agosto de 2026</span>
        </div>
      </footer>
    </main>
  );
}
