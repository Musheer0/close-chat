import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryClientProvider from "@/components/providers/global/react-query-provider";
const font = Host_Grotesk({
  subsets:['latin','latin-ext']
})

export const metadata = {
  title: "Close Chat",
  description: "1 one 1 private chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <ReactQueryClientProvider>
          {children}
          
        </ReactQueryClientProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
