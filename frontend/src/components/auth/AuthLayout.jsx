import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLabel,
}) => {
  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* Brand */}
        <Link
          to="/login"
          className="auth-brand"
        >
          <span className="brand-mark">
            S
          </span>

          <span>
            Social
          </span>
        </Link>

        {/* Heading */}
        <div className="auth-heading">
          <h1>{title}</h1>

          <p>
            {subtitle}
          </p>
        </div>

        {/* Form */}
        {children}

        {/* Footer */}
        {footerText &&
          footerLink &&
          footerLabel && (
            <div className="auth-footer">
              <span>
                {footerText}
              </span>

              <Link to={footerLink}>
                {footerLabel}
              </Link>
            </div>
          )}

      </section>
    </main>
  );
};

export default AuthLayout;