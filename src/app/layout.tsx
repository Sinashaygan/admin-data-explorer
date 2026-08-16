import ReactQueryProvider from "../providers/ReactQueryProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
