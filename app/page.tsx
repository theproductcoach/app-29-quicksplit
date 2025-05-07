import Link from "next/link";

export default function Home() {
  return (
    <main className="container py-4">
      <div className="text-center px-3">
        <div className="mb-5">
          <h1 className="display-1 fw-bold text-white mb-2">QuickSplit</h1>
          <div className="text-info fs-4 fw-light">Split bills instantly</div>
        </div>

        <p className="lead mb-4 text-white-75">
          Split bills and receipts instantly with friends. Upload a receipt or
          scan a bill to get started.
        </p>

        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <Link href="/upload" className="btn btn-primary btn-lg px-4 py-3">
            Upload a Receipt
          </Link>
          <Link href="/pay" className="btn btn-outline-light btn-lg px-4 py-3">
            Pay my share
          </Link>
        </div>
      </div>
    </main>
  );
}
