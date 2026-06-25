import { SignupForm } from "@/components/signup-form";

export default function Signup() {
  return (
    <>
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </>
  );
}