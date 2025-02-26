import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weights: [300, 400, 500, 600, 700],
});

export const metadata = {
  title: "Resume & Portfolio",
  description: "Personal Resume and Portfolio Showcase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
