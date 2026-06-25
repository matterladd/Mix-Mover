import { SignupForm } from "@/components/signup-form";

export default function Signup() {
  return (
    <>
      <div className="flex flex-col w-full items-center justify-center">
        <h1 className="text-5xl font-bold pb-4">
              Signup
        </h1>
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </>
  );
}