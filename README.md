# QuickSplit

QuickSplit is a modern web application that helps you split bills and receipts instantly with friends. Built with Next.js, it provides a seamless experience for managing shared expenses.

## Features

- 📸 Upload or take photos of receipts
- 💰 Split bills automatically between friends
- 📱 Mobile-friendly interface with camera integration
- 🔍 QR code scanning for quick payments
- 💳 Track payment status for each receipt
- 🌙 Dark mode support

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Bootstrap](https://getbootstrap.com) - UI components and styling
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) - QR code scanning
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) - File storage
- [OpenAI](https://openai.com) - Receipt analysis

## Development

The main pages of the application are:

- `/` - Home page with quick actions
- `/upload` - Upload or take photos of receipts
- `/pay` - Scan QR codes to pay your share
- `/receipts` - View and manage your receipts

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Vercel Blob Storage Documentation](https://vercel.com/docs/storage/vercel-blob)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
