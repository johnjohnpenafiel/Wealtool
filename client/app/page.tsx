import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl md:text-8xl font-bold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to Wealtool
        </h1>
        <p className="text-sm px-10 md:text-lg text-gray-600 mb-6 text-center">
          Wealtool is a tool that helps you find the best student loan options.
        </p>
        <Link href="/form">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_35px_rgba(34,211,238,0.25),0_0_35px_rgba(52,211,153,0.25),0_0_35px_rgba(59,130,246,0.25)]">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
