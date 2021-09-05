import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/client";
import Image from "next/image";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let requestTimes = 0;
let requestStatus = "Waiting";

const start = async function (cursor: number) {
  const res = await fetch(`/api/jobs/start`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ cursor: cursor }),
  });
  requestTimes += 1;
  requestStatus = "Polling";
  let data = await res.json();
  await sleep(80000);
  if (data.nextCursor === 0) {
    requestStatus = "Done";
  } else {
    await start(data.nextCursor);
  }
};

const Home: NextPage = (props) => {
  const [session] = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Easy Blocker</title>
        <meta name="description" content="Twitter Block Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!session && (
          <div>
            <h1 className={styles.title}>Welcome to tBlockTool</h1>

            <p className={styles.description}>
              Get started by{"    "}
              <button className={styles.code} onClick={() => signIn("twitter")}>
                Sign in
              </button>
            </p>
          </div>
        )}

        {session && (
          <>
            <h1 className={styles.title}>Welcome {session.user?.name}</h1>
            <Image
              src={session.user?.image || "default"}
              alt="Picture of the user"
              width="100"
              height="100"
            />
            <div className={styles.code}>
              <button className={styles.code} onClick={() => start(-1)}>
                Start
              </button>

              <button className={styles.code} onClick={() => signOut()}>
                Sign out
              </button>
            </div>

            <div className="requestLog">
              <p>已请求次数:{requestTimes}</p>
              <p>状态:{requestStatus}</p>
            </div>

            <div className={styles.code}>
              <p>Tips:</p>
              <li>该服务不会存储您的任何信息，关掉网页即刻销毁</li>
              <li>But用完还是应该去Twitter里设置里取消对该应用的授权</li>
              <li>免费的Twitter开发者账户有请求限制，速度会比较慢</li>
              <li>请不要关闭页面，请耐心等待完成</li>
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

Home.getInitialProps = async ({ req }) => {
  return { requetTimes: 0, requetStatus: "Waiting" };
};

export default Home;
