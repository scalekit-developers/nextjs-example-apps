import Link from 'next/link';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Hero SaaS
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/dashboard" className="hover:text-gray-300">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
