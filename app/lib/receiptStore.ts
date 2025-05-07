export interface ReceiptItem {
  name: string;
  price: number;
  paidBy?: string;
}

export interface Receipt {
  merchant: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  tax: number;
  status: "New" | "Partial" | "Paid";
  paidBy: string[];
  url: string;
}

export function addReceipt(id: string, data: Receipt) {
  if (typeof window !== "undefined") {
    const receipts = JSON.parse(localStorage.getItem("receipts") || "{}") as Record<string, Receipt>;
    receipts[id] = data;
    localStorage.setItem("receipts", JSON.stringify(receipts));
  }
}

export function getReceipt(id: string): Receipt | undefined {
  if (typeof window !== "undefined") {
    const receipts = JSON.parse(localStorage.getItem("receipts") || "{}") as Record<string, Receipt>;
    return receipts[id];
  }
  return undefined;
} 