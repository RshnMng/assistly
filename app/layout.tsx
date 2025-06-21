import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ApolloProviderWrapper from "./(admin)/components/ApolloProvider";

export const metadata: Metadata = {
  title: "Assistly",
  description: "Your personal AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProviderWrapper>
      <ClerkProvider>
        <html lang="en">
          <body className="min-h-screen flex">
            {children}

            {/* toaster */}
          </body>
        </html>
      </ClerkProvider>
    </ApolloProviderWrapper>
  );
}
