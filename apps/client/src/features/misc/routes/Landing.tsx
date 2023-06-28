import Navbar from "@/components/common/Navbar";
import Button from "@/components/ui/Button";

const LINKS = [
  { to: "login", label: "Login" },
  { to: "register", label: "Get started" },
]

export function Landing() {
  return (
    <main>
      <Navbar links={LINKS} />
      <section className="my-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-full min-h-96 rounded-2xl px-4 py-12">
            <h1 className="text-5xl font-bold mx-auto text-center max-w-2xl">
              Beautify those ugly links in seconds. No sign up required.
            </h1>
            <p className="text-lg text-neutral-500 mx-auto text-center max-w-2xl mt-4">
              <span className="block mt-2 line-through">https://thatshortener.com/very-long-url-that-is-very-long</span>
              <span>https://scissor.ly/abc</span>
            </p>
            <div className="flex justify-center mt-8">
              <Button to="/login" variant="solid">Get Started</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}