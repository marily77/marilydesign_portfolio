// Footer.jsx
import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-copyright">
          © {year} Marily · {t('footer.rights', 'Kõik õigused kaitstud')}
        </span>
        <div className="footer-links">
          <a href="https://github.com/marily77" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="marily@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}