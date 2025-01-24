"use client";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

export function Log() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/todo");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <a
          href="#"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 "
        >
          <div>
            <div className="px-10">
              <div className="text-3xl text-black font-extrabold">Login</div>
            </div>
            <div className="pt-2">
              <LabelledInput
                onChange={(e) => setEmail(e.target.value)}
                label="Username"
                placeholder="jadon@gmail.com"
              />
              <LabelledInput
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type={"password"}
                placeholder="123456"
              />
              <button
                type="button"
                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                onClick={handleSignup} // Add the signup handler
              >
                Log in
              </button>
            </div>
          </div>
        </a>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* New Here? Signup Link */}
      <div className="flex justify-center mt-4">
        <span className="text-gray-700">
          New here?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
