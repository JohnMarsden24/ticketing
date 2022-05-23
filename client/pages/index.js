import axios from 'axios';
import buildClient from '../api/build-client';

const HomePage = ({ data: { currentUser } }) => {
  return <h1>{currentUser ? 'You are in!' : 'nope soi'}</h1>;
};

export const getServerSideProps = async ({ req }) => {
  const client = buildClient(req);
  const { data } = await client.get('/api/users/currentuser', {
    headers: req.headers,
  });

  return {
    props: { data },
  };
};

export default HomePage;
