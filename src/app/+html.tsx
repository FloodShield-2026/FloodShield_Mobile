import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" style={{ height: '100%', width: '100%' }}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100% !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: #0A1628 !important;
                overflow: hidden !important;
              }
              body {
                display: flex !important;
              }
              #root {
                flex: 1 !important;
                display: flex !important;
              }
              #root > div {
                flex: 1 !important;
                height: 100% !important;
                width: 100% !important;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
