import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Contact.css";

const SOCIAL_LINKS = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/marily77",
    handle: "@marily77",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/marily-valkijainen/",
    handle: "marily-valkijainen",
  },
];

export default function Contact() {
  const { t } = useTranslation();
  const formRef = useRef(null);

  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [charCount, setCharCount] = useState(0);

  const MAX_MSG = 1000;

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  const errors = {
    name: !fields.name.trim() ? t("contact.err.nameRequired", "Nimi on kohustuslik") : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
      ? t("contact.err.emailInvalid", "Kehtetu e-mail")
      : "",
    message:
      fields.message.trim().length < 10
        ? t("contact.err.messageShort", "Vähemalt 10 tähemärki")
        : "",
  };

  const isValid = !errors.name && !errors.email && !errors.message;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid) return;

    setStatus("sending");

    // Formspree — asenda YOUR_FORM_ID oma Formspree ID-ga
    // Või kasuta emailjs / muud teenust
    try {
      const res = await fetch("https://formspree.io/f/mvzyjobk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setStatus("success");
        setFields({ name: "", email: "", message: "" });
        setCharCount(0);
        setTouched({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="ct-page">
      {/* ── Decorative grid lines ── */}
      <div className="ct-grid-lines" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <div className="ct-inner">
        {/* ── Left: heading + info ── */}
        <aside className="ct-left">
          <span className="ct-eyebrow">
            {t("contact.eyebrow", "Võta ühendust")}
          </span>

          <h1 className="ct-title">
            {t("contact.title1", "Räägime")}
            <br />
            <span className="ct-title--accent">
              {t("contact.title2", "andmetest.")}
            </span>
          </h1>

          <p className="ct-body">
            {t(
              "contact.body",
              "Olen avatud koostöö, praktika ja projektide osas. Kirjuta mulle — vastan tavaliselt 24h jooksul."
            )}
          </p>

          {/* Social links */}
          <ul className="ct-socials">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-social-link"
                >
                  <span className="ct-social-label">{s.label}</span>
                  <span className="ct-social-handle">{s.handle}</span>
                  <span className="ct-social-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Availability badge */}
          <div className="ct-availability">
            <span className="ct-avail-dot" aria-hidden="true" />
            <span>{t("contact.available", "Saadaval uuteks võimalusteks")}</span>
          </div>
        </aside>

        {/* ── Right: form ── */}
        <section className="ct-right">
          {status === "success" ? (
            <div className="ct-success">
              <span className="ct-success-icon" aria-hidden="true">✓</span>
              <h2 className="ct-success-title">
                {t("contact.success.title", "Saadetud!")}
              </h2>
              <p className="ct-success-body">
                {t(
                  "contact.success.body",
                  "Sõnum on teel. Vastan sulle varsti."
                )}
              </p>
              <button
                className="ct-btn-reset"
                onClick={() => setStatus("idle")}
              >
                {t("contact.success.again", "Saada uus sõnum")}
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              className="ct-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name */}
              <div className={`ct-field ${touched.name && errors.name ? "ct-field--error" : touched.name && !errors.name ? "ct-field--ok" : ""}`}>
                <label className="ct-label" htmlFor="ct-name">
                  {t("contact.form.name", "Nimi")}
                </label>
                <input
                  id="ct-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="ct-input"
                  placeholder={t("contact.form.namePlaceholder", "Sinu nimi")}
                  value={fields.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.name && errors.name && (
                  <span className="ct-field-error">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className={`ct-field ${touched.email && errors.email ? "ct-field--error" : touched.email && !errors.email ? "ct-field--ok" : ""}`}>
                <label className="ct-label" htmlFor="ct-email">
                  {t("contact.form.email", "E-mail")}
                </label>
                <input
                  id="ct-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="ct-input"
                  placeholder={t("contact.form.emailPlaceholder", "sinu@email.com")}
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <span className="ct-field-error">{errors.email}</span>
                )}
              </div>

              {/* Message */}
              <div className={`ct-field ct-field--textarea ${touched.message && errors.message ? "ct-field--error" : touched.message && !errors.message ? "ct-field--ok" : ""}`}>
                <label className="ct-label" htmlFor="ct-message">
                  {t("contact.form.message", "Sõnum")}
                </label>
                <textarea
                  id="ct-message"
                  name="message"
                  className="ct-textarea"
                  rows={6}
                  maxLength={MAX_MSG}
                  placeholder={t(
                    "contact.form.messagePlaceholder",
                    "Kirjelda lühidalt, millest soovid rääkida..."
                  )}
                  value={fields.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="ct-field-footer">
                  {touched.message && errors.message ? (
                    <span className="ct-field-error">{errors.message}</span>
                  ) : (
                    <span />
                  )}
                  <span className="ct-char-count">
                    {charCount}/{MAX_MSG}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`ct-submit ${status === "sending" ? "ct-submit--sending" : ""}`}
                disabled={status === "sending"}
              >
                {status === "sending" ? (
                  <span className="ct-submit-spinner" />
                ) : (
                  <>
                    <span>{t("contact.form.send", "Saada sõnum")}</span>
                    <span className="ct-submit-arrow" aria-hidden="true">→</span>
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="ct-form-error">
                  {t(
                    "contact.form.error",
                    "Midagi läks valesti. Proovi uuesti või kirjuta otse GitHubi kaudu."
                  )}
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}