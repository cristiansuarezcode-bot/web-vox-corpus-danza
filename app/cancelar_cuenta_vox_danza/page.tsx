import type { Metadata } from "next";
import RequestForm from "./RequestForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Eliminar cuenta de Vox Danza | Vox Corpus Danza",
  description:
    "Canal oficial para solicitar la eliminación de una cuenta de Vox Danza y de los datos personales asociados.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Eliminar cuenta de Vox Danza",
    description: "Canal oficial para solicitar la eliminación de una cuenta de Vox Danza.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Eliminar cuenta de Vox Danza",
    description: "Canal oficial para solicitar la eliminación de una cuenta de Vox Danza.",
    images: [],
  },
};

const deletedData = [
  "Credenciales e información personal identificable que ya no deba conservarse.",
  "Fotografía, biografía, preferencias y demás información propia del perfil.",
  "Identificadores de instalación y datos usados para entregar notificaciones.",
  "Otros datos personales asociados a la cuenta que no estén sujetos a conservación restringida.",
];

export default function DeleteAccountPage() {
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
        <div className={styles.heroLabel}><span /> Solicitud oficial</div>
        <h1>Eliminar tu cuenta<br /><em>de Vox Danza.</em></h1>
        <p>
          Desde esta página puedes iniciar la eliminación permanente de tu
          cuenta y de los datos personales asociados, sin volver a instalar ni
          ingresar a la aplicación.
        </p>
        <a className={styles.primaryAction} href="#solicitud">
          Iniciar solicitud <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className={styles.notice} aria-label="Información importante">
        <strong>Antes de continuar</strong>
        <p>
          Eliminar la aplicación del teléfono no elimina tu cuenta. Este proceso
          es permanente y, cuando termine, perderás el acceso a la información y
          servicios vinculados a esa cuenta.
        </p>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.sectionNumber}>01</div>
        <div>
          <p className={styles.kicker}>Cómo funciona</p>
          <h2>Un proceso claro<br />en cuatro pasos.</h2>
        </div>
        <ol className={styles.steps}>
          <li><span>1</span><div><strong>Completa la solicitud</strong><p>Indica el nombre y el correo registrados en la app.</p></div></li>
          <li><span>2</span><div><strong>Envíala desde tu correo asociado</strong><p>El formulario prepara un correo dirigido a voxcorpusdanza@gmail.com.</p></div></li>
          <li><span>3</span><div><strong>Verificamos la cuenta</strong><p>La dirección remitente nos ayuda a confirmar que la solicitud corresponde a tu cuenta.</p></div></li>
          <li><span>4</span><div><strong>Confirmamos la eliminación</strong><p>Recibirás una respuesta cuando el proceso haya finalizado.</p></div></li>
        </ol>
      </section>

      <section className={`${styles.contentSection} ${styles.dataSection}`}>
        <img
          className={styles.dataGraphic}
          src="/vox-silueta-urbana.png"
          alt=""
          aria-hidden="true"
        />
        <div className={styles.sectionNumber}>02</div>
        <div>
          <p className={styles.kicker}>Alcance</p>
          <h2>Qué datos<br />se eliminan.</h2>
        </div>
        <div className={styles.dataCopy}>
          <ul>
            {deletedData.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className={styles.retentionNote}>
            <strong>Registros que pueden conservarse</strong>
            <p>
              Los historiales de matrículas, asistencia, créditos del proceso,
              pagos y auditoría pueden conservarse de forma restringida o
              anonimizada hasta por 10 años para obligaciones administrativas,
              contables, contractuales o de seguridad. No se mantienen como un
              perfil activo ni se usan para publicidad.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.formSection} id="solicitud">
        <img
          className={styles.formGraphic}
          src="/vox-forma-circulo.png"
          alt=""
          aria-hidden="true"
        />
        <div className={styles.formIntro}>
          <div className={styles.sectionNumber}>03</div>
          <p className={styles.kicker}>Enviar solicitud</p>
          <h2>Empecemos.</h2>
          <p>
            Si la cuenta pertenece a un menor de edad, la solicitud debe ser
            enviada por su madre, padre o acudiente autorizado.
          </p>
          <div className={styles.deadline}>
            <span>Plazo de atención</span>
            <strong>Dentro de 3 días hábiles</strong>
            <p>
              Una vez recibamos la solicitud desde el correo asociado y con la
              información necesaria, procesaremos la eliminación de la cuenta.
            </p>
          </div>
        </div>
        <RequestForm />
      </section>

      <section className={styles.security}>
        <strong>Protege tu cuenta</strong>
        <p>
          No envíes contraseñas, PIN, códigos QR ni documentos de identidad en
          el mensaje inicial. Si necesitamos validar información adicional, te
          indicaremos un medio seguro y el mínimo de datos necesario.
        </p>
      </section>

      <footer className={styles.footer}>
        <div>
          <img src="/vox-corpus-logo.png" alt="Vox Corpus Danza" />
          <p>Canal oficial de privacidad de la aplicación Vox Danza.</p>
        </div>
        <div>
          <a href="/politica_privacidad_vox_danza/">Política de privacidad</a>
          <a href="/">Volver al sitio principal</a>
          <span>Última actualización: 14 de agosto de 2026</span>
        </div>
      </footer>
    </main>
  );
}
