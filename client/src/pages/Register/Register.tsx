import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../../utils/api";
import "../../assets/form.css";

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

export default function Register() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    try {
      const result = await registerUser(
        values.name,
        values.email,
        values.password,
      );

      if (!result.success) {
        setStatusMessage(result.error?.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  return (
    <main className="form-page">
      <section className="form-page__content" aria-labelledby="register-title">
        <div className="form-page__header">
          <h1 className="form-page__title" id="register-title">
            Create account
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
          <label className="form__label" htmlFor="register-name">
            Name
          </label>
          <input
            className="form__input"
            id="register-name"
            maxLength={40}
            minLength={2}
            name="name"
            onChange={handleChange}
            placeholder="John Doe"
            required
            type="text"
            value={values.name || ""}
          />
          <span className="form__input-error">{errors.name}</span>

          <label className="form__label" htmlFor="register-email">
            Email
          </label>
          <input
            className="form__input"
            id="register-email"
            name="email"
            onChange={handleChange}
            placeholder="johndoe12345@gmail.com"
            required
            type="email"
            value={values.email || ""}
          />
          <span className="form__input-error">{errors.email}</span>

          <label className="form__label" htmlFor="register-password">
            Password
          </label>
          <input
            className="form__input"
            id="register-password"
            minLength={8}
            name="password"
            onChange={handleChange}
            placeholder="12345678"
            required
            type="password"
            value={values.password || ""}
          />
          <span className="form__input-error">{errors.password}</span>

          <div className="form__actions">
            <button
              className="form__submit form__submit_type_wide"
              disabled={!isValid}
              type="submit"
            >
              Create account
            </button>
            <NavLink className="form__back" to="/">
              Back
            </NavLink>
          </div>

          <p className="form__status form__status_type_footer" aria-live="polite">
            {statusMessage}
          </p>
        </form>
      </section>
    </main>
  );
}
