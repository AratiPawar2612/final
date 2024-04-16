// import React from "react";
// import {
//   createCache,
//   extractStyle,
//   StyleProvider,
//   px2remTransformer,
// } from "@ant-design/cssinjs";
// import Document, { Head, Html, Main, NextScript } from "next/document";
// import type { DocumentContext } from "next/document";

// const px2rem = px2remTransformer({
//   rootValue: 16, // 16px = 1rem;
// });

// const MyDocument = () => (
//   <Html lang="en">
//     <Head />
//     <body>
//       <Main />
//       <NextScript />
//     </body>
//   </Html>
// );

// MyDocument.getInitialProps = async (ctx: DocumentContext) => {
//   const cache = createCache();
//   const originalRenderPage = ctx.renderPage;
//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App) => (props) =>
//         (
//           <StyleProvider transformers={[px2rem]} cache={cache}>
//             <App {...props} />
//           </StyleProvider>
//         ),
//     });

//   const initialProps = await Document.getInitialProps(ctx);
//   const style = extractStyle(cache, true);
//   return {
//     ...initialProps,
//     styles: (
//       <>
//         {initialProps.styles}
//         <style dangerouslySetInnerHTML={{ __html: style }} />
//       </>
//     ),
//   };
// };

// export default MyDocument;

import { Html, Head, Main, NextScript } from "next/document";


export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}