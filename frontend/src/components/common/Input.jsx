const Input = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="form-field">

      <label className="form-label">
        {label}
      </label>

      <input
        className={`form-input ${
          error
            ? "form-input-error"
            : ""
        }`}
        {...props}
      />

      {error && (
        <span className="form-error">
          {error}
        </span>
      )}

    </div>
  );
};

export default Input;