import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#5865f2]">Lomall</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Professional Discord Ticket Management
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign in with Discord
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-600 hover:border-gray-400 text-gray-300 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
