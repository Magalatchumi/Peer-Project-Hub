import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 mt-20">
      <div className="container-max py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              PPH
            </h3>

            <p className="text-sm text-gray-400">
              Peer Project Hub
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Build. Share. Connect.
            </p>

            <p className="text-sm text-gray-400 mt-2">
              A community for student developers to showcase projects
              and collaborate.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Navigation
            </h4>

            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Explore
                </Link>
              </li>

              <li>
                <Link
                  to="/technologies"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Technologies
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Resources
            </h4>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">
              Follow Us
            </h4>

            <div className="flex gap-3">

              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors text-sm font-semibold"
              >
                GH
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors text-sm font-semibold"
              >
                X
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors text-sm font-semibold"
              >
                in
              </a>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} Peer Project Hub. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}