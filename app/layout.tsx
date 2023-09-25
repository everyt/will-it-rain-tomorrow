import Frame from 'wirt@/components/window/Frame';
import 'wirt@/styles/Root.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body>
        <Frame>{children}</Frame>
      </body>
    </html>
  );
}
