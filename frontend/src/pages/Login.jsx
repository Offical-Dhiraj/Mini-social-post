import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue to your social feed."
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLabel="Create account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;