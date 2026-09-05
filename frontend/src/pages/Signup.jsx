import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the community and start sharing posts."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Login"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;