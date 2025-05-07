"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed-bottom">
      <div className="container">
        <div className="row g-0">
          <div className="col-3">
            <button
              className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center ${
                isActive("/") ? "text-primary" : "text-white-50"
              }`}
              onClick={() => router.push("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-house mb-1"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
              </svg>
              <small>Home</small>
            </button>
          </div>
          <div className="col-3">
            <button
              className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center ${
                isActive("/upload") ? "text-primary" : "text-white-50"
              }`}
              onClick={() => router.push("/upload")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-cloud-arrow-up mb-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                />
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
              </svg>
              <small>Upload</small>
            </button>
          </div>
          <div className="col-3">
            <button
              className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center ${
                isActive("/receipts") ? "text-primary" : "text-white-50"
              }`}
              onClick={() => router.push("/receipts")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-receipt mb-1"
                viewBox="0 0 16 16"
              >
                <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zM2 13.707l.647-.646a.5.5 0 0 1 .708 0L4 13.707l.647-.646a.5.5 0 0 1 .708 0L6 13.707l.647-.646a.5.5 0 0 1 .708 0L8 13.707l.647-.646a.5.5 0 0 1 .708 0L10 13.707l.647-.646a.5.5 0 0 1 .708 0L12 13.707l.647-.646a.5.5 0 0 1 .708 0L14 13.707V2.293l-.647.646a.5.5 0 0 1-.708 0L12 2.293l-.647.646a.5.5 0 0 1-.708 0L10 2.293l-.647.646a.5.5 0 0 1-.708 0L8 2.293 7.353 2.94a.5.5 0 0 1-.708 0L6 2.293 5.353 2.94a.5.5 0 0 1-.708 0L4 2.293 3.353 2.94a.5.5 0 0 1-.708 0L2 2.293v11.414z" />
                <path d="M3 4.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
              </svg>
              <small>Receipts</small>
            </button>
          </div>
          <div className="col-3">
            <button
              className={`btn w-100 py-3 d-flex flex-column align-items-center justify-content-center ${
                isActive("/pay") ? "text-primary" : "text-white-50"
              }`}
              onClick={() => router.push("/pay")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-wallet2 mb-1"
                viewBox="0 0 16 16"
              >
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
              </svg>
              <small>Pay</small>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
