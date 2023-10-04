import 'wirt@/public/styles.css';
import Frame from 'wirt@/components/window/Frame';
import localFont from 'next/font/local';
const NanumSquareNeo = localFont({ src: '../public/fonts/NanumSquareNeo-Variable.woff2', display: 'swap', weight:'300' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className={NanumSquareNeo.className}>
      <body style={{ overflow: 'hidden' }}>
        <Frame>{children}</Frame>
      </body>
    </html>
  );
}