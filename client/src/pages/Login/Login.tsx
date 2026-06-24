import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../assets/form.css";
import { loginUser } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

const useFormWithValidation = () => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, validationMessage, form } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validationMessage,
    }));

    setIsValid(form ? form.checkValidity() : false);
  };

  return { values, errors, isValid, handleChange };
};

export default function Login() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const [statusMessage, setStatusMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      const result = await loginUser(
        values.email,
        values.password,
      );

      if (result.data) {
        login(result.data.token, result.data.user);
        navigate('/knowledge');
      }

    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  };

  return (
    <main className="form-page">
      <section className="form-page__content" aria-labelledby="login-title">
        <div className="form-page__header">
          <h1 className="form-page__title" id="login-title">
            Sign in
          </h1>
          <p className="form-page__text">
            Access your organisation&apos;s secure workspace
          </p>
        </div>

        <nav className="form-page__nav" aria-label="Authentication">
          <NavLink
            className={({ isActive }) =>
              `form-page__nav-link${isActive ? " form-page__nav-link_active" : ""}`
            }
            to="/login"
          >
            Login
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `form-page__nav-link${isActive ? " form-page__nav-link_active" : ""}`
            }
            to="/register"
          >
            Register
          </NavLink>
        </nav>

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="login-email">
            Email
          </label>
          <input
            className="form__input"
            id="login-email"
            name="email"
            onChange={handleChange}
            placeholder="johndoe12345@gmail.com"
            required
            type="email"
            value={values.email || ""}
          />
          <span className="form__input-error">{errors.email}</span>

          <label className="form__label" htmlFor="login-password">
            Password
          </label>
          <input
            className="form__input"
            id="login-password"
            minLength={8}
            name="password"
            onChange={handleChange}
            placeholder="12345678"
            required
            type="password"
            value={values.password || ""}
          />
          <span className="form__input-error">{errors.password}</span>

          <p className="form__status" aria-live="polite">
            {statusMessage}
          </p>

          <div className="form__actions">
            <button className="form__submit" disabled={!isValid} type="submit">
              Login
            </button>
            <NavLink className="form__back" to="/">
              Back
            </NavLink>
          </div>
        </form>
      </section>
    </main>
  );
}
