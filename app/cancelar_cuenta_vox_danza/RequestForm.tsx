"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

const SUPPORT_EMAIL = "voxcorpusdanza@gmail.com";

export default function RequestForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const username = String(form.get("username") || "").trim();
    const reason = String(form.get("reason") || "").trim();

    const message = [
      "Solicito la eliminación de mi cuenta de Vox Danza y de los datos asociados.",
      "",
      `Nombre completo: ${name}`,
      `Correo registrado: ${email}`,
      username ? `Nombre de usuario: ${username}` : null,
      reason ? `Motivo de la eliminación: ${reason}` : null,
    ].filter(Boolean).join("\n");

    const subject = "Solicitud de eliminación de cuenta";
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setStatus("Tu solicitud está lista. Se abrirá tu aplicación de correo para que revises y envíes el mensaje.");
    window.location.href = url;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="delete-name">Nombre completo</label>
        <input id="delete-name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="delete-email">Correo registrado en Vox Danza</label>
        <input id="delete-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="delete-username">Nombre de usuario <span>(si aplica)</span></label>
        <input id="delete-username" name="username" type="text" autoComplete="username" />
      </div>

      <div className={styles.field}>
        <label htmlFor="delete-reason">Motivo de la eliminación <span>(opcional)</span></label>
        <textarea id="delete-reason" name="reason" rows={4} maxLength={500} />
      </div>

      <label className={styles.consent}>
        <input type="checkbox" required />
        <span>
          Confirmo que soy titular de la cuenta o representante autorizado y
          entiendo que la eliminación es permanente.
        </span>
      </label>

      <button className={styles.submit} type="submit">
        Preparar correo de solicitud <span aria-hidden="true">↗</span>
      </button>

      <p className={styles.formPrivacy}>
        Esta página no guarda lo que escribes. Se abrirá tu aplicación de correo
        con el destinatario, el asunto y el mensaje preparados; la solicitud solo
        se envía cuando tú confirmas el correo.
      </p>
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </form>
  );
}
