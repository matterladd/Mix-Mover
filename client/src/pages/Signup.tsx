import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { SignupForm } from "@/components/signup-form";

export default function Signup() {
    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-md">
                    <SignupForm />
                </div>
            </div>
        </>
    );
}