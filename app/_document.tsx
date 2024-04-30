// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import favicon from '../public/favicon.svg';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add custom CSS files, meta tags, or fonts here */}
          <link rel="icon" type="image/svg+xml" href={favicon} />
          {/* <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: newRelicScript }}
          /> */}
        </Head>
        <body>
          <Main /> {/* This is where your app content will be injected */}
          <NextScript /> {/* Scripts injected here */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
