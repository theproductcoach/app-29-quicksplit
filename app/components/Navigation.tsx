"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link href="/" className="navbar-brand">
          QuickSplit
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/upload"
                className={`nav-link ${isActive("/upload") ? "active" : ""}`}
              >
                Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/scan"
                className={`nav-link ${isActive("/scan") ? "active" : ""}`}
              >
                Scan & Pay
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
