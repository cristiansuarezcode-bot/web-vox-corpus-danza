"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/co/app/vox-danza/id6753774380";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.voxcorpusdanza.oficial";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const userAgent = navigator.userAgent || navigator.vendor;
  const isIPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  if (/android/i.test(userAgent)) return "android";
  if (/iPad|iPhone|iPod/i.test(userAgent) || isIPadOS) return "ios";
  return "other";
}

export default function AppDownloadRedirect() {
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    if (detectedPlatform === "other") return;

    const destination =
      detectedPlatform === "ios" ? APP_STORE_URL : GOOGLE_PLAY_URL;
    const redirectTimer = window.setTimeout(() => {
      window.location.replace(destination);
    }, 450);

    return () => window.clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="download-actions" aria-live="polite">
      {platform !== "other" && (
        <p className="redirect-status">
          Te estamos llevando a la tienda correcta…
        </p>
      )}

      <div className="store-links">
        <a className="store-link" href={APP_STORE_URL}>
          <span className="store-platform" aria-hidden="true">iOS</span>
          <span>
            <small>Descargar en</small>
            <strong>App Store</strong>
          </span>
          <ExternalLink className="store-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <a className="store-link" href={GOOGLE_PLAY_URL}>
          <span className="store-platform store-platform-android" aria-hidden="true">
            A
          </span>
          <span>
            <small>Disponible en</small>
            <strong>Google Play</strong>
          </span>
          <ExternalLink className="store-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>

      <p className="download-help">
        Si la tienda no se abre automáticamente, elige una opción.
      </p>
    </div>
  );
}
