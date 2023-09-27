import 'wirt@/public/styles.css';
import Frame from 'wirt@/components/window/Frame';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body style={{ overflow: 'hidden' }}>
        <Frame>{children}</Frame>
      </body>
    </html>
  );
}
