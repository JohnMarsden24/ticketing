import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import App from 'next/app';
import Header from '../components/header';
import axios from 'axios';

function AppComponent({ Component, pageProps, data }) {
  return (
    <>
      <Header currentUser={data?.currentUser} />
      <Component {...pageProps} />
    </>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  const client = buildClient(appContext.ctx.req);

  const response = await client.get('/api/users/currentuser');

  return { data: response?.data, ...appProps };
};

export default AppComponent;
