import LoginButton from "../components/LoginButton";

const Login = () => {
  return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Login</h1>
          <LoginButton />
        </div>
    </div>
  );
};

export default Login;
