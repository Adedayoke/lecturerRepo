"use client";
import { lecturerApi } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { FormEvent, useReducer, useState } from "react";
import Link from "next/link";

interface LecturerSignupType {
  pfNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type ActionState = {
  type: "setPfNumber" | "setTitle" | "setFirstName" | "setLastName" | 
        "setEmail" | "setPassword" | "setConfirmPassword";
  payload: string;
};

const initialState: LecturerSignupType = {
  pfNumber: "",
  title: "Dr.",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function signupReducer(state: LecturerSignupType, action: ActionState) {
  switch (action.type) {
    case "setPfNumber":
      return { ...state, pfNumber: action.payload };
    case "setTitle":
      return { ...state, title: action.payload };
    case "setFirstName":
      return { ...state, firstName: action.payload };
    case "setLastName":
      return { ...state, lastName: action.payload };
    case "setEmail":
      return { ...state, email: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    case "setConfirmPassword":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
}

export default function Signup() {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!state.pfNumber || !state.title || !state.password) {
      setError("PF Number, title, and password are required");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (state.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Email validation if provided
    if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Prepare signup data to match API endpoint
      const signupData = {
        pfNumber: state.pfNumber,
        title: state.title,
        firstName: state.firstName || undefined,
        lastName: state.lastName || undefined,
        email: state.email || undefined,
        password: state.password,
      };

      const response = await lecturerApi.signup(signupData);

      if (response.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login?message=Account created successfully");
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || "Account creation failed. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Lecturer Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* PF Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PF Number *
              </label>
              <input
                type="text"
                value={state.pfNumber}
                onChange={(e) =>
                  dispatch({ type: "setPfNumber", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., PF001234"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <select
                value={state.title}
                onChange={(e) =>
                  dispatch({ type: "setTitle", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={state.firstName}
                onChange={(e) =>
                  dispatch({ type: "setFirstName", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={state.lastName}
                onChange={(e) =>
                  dispatch({ type: "setLastName", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: "setEmail", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="john.doe@university.edu"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "setPassword", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({ type: "setConfirmPassword", payload: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Creating Account...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Note: Courses will be auto-assigned when you upload materials.</p>
          </div>
        </form>
      </div>
    </div>
  );
}