import { LoginForm } from "@/components/login-form";

export default function Login() {
    return (
      <>
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-5xl font-bold pb-4">
              Login
          </h1>
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </>
    );
}