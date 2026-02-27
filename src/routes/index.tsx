import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useState } from "react";
import { FileIcon, GlobeIcon, TanstackLogo, WindowIcon } from "../assets/icons";
import { RoundedButton } from "../components/RoundedButton";

export const Home: React.FC = () => {
  const [greeted, setGreeted] = useState<string | null>(null);

  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log("Incremented count to", count + 1);
  };

  const greet = useCallback((): void => {
    invoke<string>("greet")
      .then((s) => {
        setGreeted(s);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 gap-16 sm:p-20 sm:grid sm:grid-rows-[20px_1fr_20px] sm:items-center sm:justify-items-center font-(family-name:--font-inter-sans)">
      <main className="flex flex-col gap-8 sm:row-start-2 items-center sm:items-start">
        <div className="flex flex-row gap-2 items-center">
          <TanstackLogo className="dark:invert" width={180} height={38} />
          <span className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-cyan-500">
            Start
          </span>
        </div>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-(family-name:--font-jetbrains-mono)">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/5 dark:bg-white/6 px-1 py-0.5 rounded font-semibold">
              src/routes/index.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>
        <div className="flex flex-col gap-2 text-center px-8 w-full">
          <RoundedButton onClick={greet} title='Call "greet" from Rust' />
          <p>{greeted ?? "Click the button to call the Rust function"}</p>
          <RoundedButton
            onClick={increment}
            title="Increment counter from web"
          />
          <p>Count: {count}</p>
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center sm:row-start-3">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://tanstack.com/start/latest/docs/framework/react/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileIcon />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://tanstack.com/start/latest/docs/framework/react/examples/basic"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WindowIcon />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://tanstack.com/start"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GlobeIcon />
          Go to tanstack.com/start →
        </a>
      </footer>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
});
