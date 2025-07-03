"use client";
import { useAuth } from "@/context/AuthContext";
import { LecturerLoginType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { FormEvent, useReducer, useState } from "react";

type ActionState = {
  type: "setUsername" | "setPassword";
  payload: string;
};

const initialState: LecturerLoginType = {
  username: "",
  password: "",
};

function loginReducer(state: LecturerLoginType, action: ActionState) {
  switch (action.type) {
    case "setUsername":
      return {
        ...state,
        username: action.payload,
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload,
      };
  }
}

export default function Login() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { lecturerLogin } = useAuth(); // Use the context method

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!state.username || !state.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await lecturerLogin(state.username, state.password);
      router.push("/");
    } catch (error) {
      setError("Login failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[50%] lg:w-[35%] mx-auto"
      >
        <h1 className="text-2xl font-medium">Login as Lecturer</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="pt-8 flex flex-col gap-4">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PF number
            </label>
            <input
              type="text"
              value={state.username}
              onChange={(e) =>
                dispatch({ type: "setUsername", payload: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your pf Number"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: "setPassword", payload: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1c2841] text-white block w-full p-2 rounded text-sm hover:bg-[#243352] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
