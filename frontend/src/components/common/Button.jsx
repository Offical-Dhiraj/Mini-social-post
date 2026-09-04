const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className="primary-button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;