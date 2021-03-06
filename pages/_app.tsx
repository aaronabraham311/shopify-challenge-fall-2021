import { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'next-auth/client';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
