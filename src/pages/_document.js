import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700,700i,800&display=optional'
        />
        <meta charSet='utf-8' />
        <meta name='mobile-web-app-capable' content='yes' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' href='data:,' />
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
          crossOrigin='true'
        />
        <link
          rel='preconnect'
          href='https://use.fontawesome.com'
          crossOrigin='true'
        />
        <link
          rel='stylesheet'
          href='https://use.fontawesome.com/releases/v7.1.0/css/all.css'
          crossOrigin='anonymous'
        />
        <meta name='theme-color' content='#d81a1d' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
