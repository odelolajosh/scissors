import Navbar from "@/components/common/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useForm from "@/hooks/useForm";
import { useLogin } from "@/lib/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginCredentialsDTO } from "../api/login";

export default function Login() {
  const { values, onChange } = useForm<LoginCredentialsDTO>();
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login.mutate(values, {
      onSuccess: () => navigate("/app")
    });
  };

  console.log(login.error);

  return (
    <main>
      <Navbar />
      <section className="mt-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-full min-h-96 rounded-2xl px-4 py-12">
            <form onSubmit={handleSubmit}>
              <h1 className="max-w-sm mb-8 text-4xl font-bold mx-auto text-center">
                Login.
              </h1>
              {login.isError && (
                <div className="max-w-sm mx-auto my-2 text-red-500 flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {(login.error as any)?.response?.data?.message || "An error occurred"}
                </div>
              )}
              <div className="max-w-sm mx-auto mt-4 flex flex-col gap-4">
                <Input type="email" placeholder="you@mail.com" label="Email" name="email" onChange={onChange} />
                <Input type="password" placeholder="••••••••" label="Password" name="password" onChange={onChange} />
                <div className="flex justify-center mt-10">
                  <Button type="submit" variant="solid" className="w-full" loading={login.isLoading}>Let's go</Button>
                </div>
                <div className="flex justify-center">
                  <NavLink to="/register" className="text-neutral-500">Register</NavLink>
                  {/* A vertical separator */}
                  <span className="mx-2">|</span>
                  <NavLink to="/forgot-password" className="text-neutral-500">Forgot password</NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}