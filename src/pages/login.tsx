import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/app.module.css";
import { useAuth } from "@/lib/hooks/auth";

interface FormElements extends HTMLFormElement {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface FormTarget extends FormEvent<HTMLFormElement> {
  target: FormElements;
}

export default function Home() {
  const [loginError, setLoginError] = useState(null);
  const { loading, loggedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();
    const { email, password } = event.target;
    setLoginError(null);
    handleLogin(email.value, password.value)
      .then(() => router.push("/protected-route"))
      .catch((err) => setLoginError(err.message));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && loggedIn) {
    router.push("/protected-route");
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" />

        <button type="submit">Login</button>

        {loginError && <div className={styles.formError}>{loginError}</div>}
      </form>
    </div>
  );
}

async function handleLogin(email: string, password: string) {
  const resp = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await resp.json();

  if (data.success) {
    return;
  }
  throw new Error("Wrong email or password");
}
