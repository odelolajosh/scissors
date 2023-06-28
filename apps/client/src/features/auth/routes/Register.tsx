import Navbar from "@/components/common/Navbar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useForm from "@/hooks/useForm";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api";
import { RegisterCredentialsDTO } from "../api/register";
import { isValidEmail } from "@/utils";

export default function Register() {
  const { values, onChange } = useForm<RegisterCredentialsDTO>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ message: string, for?: 'email' | 'pwd' } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    if (isValidEmail(values.email) === false) {
      setErr({ message: 'Invalid email', for: 'email' });
      return;
    }
    try {
      setLoading(true);
      await verifyEmail({ email: values.email });
      setLoading(false);
      navigate('/verify', { state: values });
    } catch (err) {
      const message = (err as any).response.data.message;
      if (message === 'An account with this mail already exist') {
        setErr({ message, for: 'email' });
      } else {
        setErr({ message })
      }
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <section className="mt-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-full min-h-96 rounded-2xl px-4 py-12">
            <form onSubmit={handleSubmit}>
              <h1 className="max-w-sm mb-8 text-4xl font-bold mx-auto text-center">
                Register.
              </h1>
              <div className="max-w-sm mx-auto mt-4 flex flex-col gap-4">
                <div>
                  <Input type="email" placeholder="you@mail.com" label="Email" name="email" onChange={onChange} />
                  {err?.for === 'email' && <p className="text-red-500 text-sm mt-1">{err.message}</p>}
                </div>
                <Input type="password" placeholder="••••••••" label="Password" name="password" onChange={onChange} />
                <div className="flex justify-center mt-10">
                  <Button variant="solid" className="w-full" type="submit" loading={loading}>Let's go</Button>
                </div>
                <div className="flex justify-center">
                  <NavLink to="/login" className="text-neutral-500">Login</NavLink>
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