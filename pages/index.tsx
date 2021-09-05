import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/client";

const Home: NextPage = () => {
  const [session, loading] = useSession();
  const startClear = function () {};

  return (
    <div className={styles.container}>
      <Head>
        <title>Easy Blocker</title>
        <meta name="description" content="Easy Blocker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to EasyBlocker</h1>

        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn("twitter")}>Sign in</button>
          </>
        )}

        {session && (
          <>
            {session.user.image} <br />
            <button onClick={() => startClear()}>Start</button>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}

        {/* <p className={styles.description}>
          Get started by Sign in{' '}
          <a href="/api/authTwitter"><code className={styles.code}>Twitter</code></a>
          
        </p> */}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
