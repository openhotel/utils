import type { WorkerParent } from "../../types/worker.types.ts";

export const getParentProcessWorker = (
  command: string,
  args: string[],
): WorkerParent => {
  const events: Record<string, any[]> = {};

  const process = new Deno.Command(command, {
    args,
    stdin: "piped",
    stdout: "piped",
  });

  const child = process.spawn();
  const encoder = new TextEncoder();
  const writer = child.stdin.getWriter();

  const reader = child.stdout.pipeThrough(new TextDecoderStream());

  (async () => {
    for await (const line of reader) {
      const match = new RegExp(/§(\{.*?\})§/).exec(line);
      if (!match) {
        Deno.stdout.write(encoder.encode(line));
        continue;
      }
      const { event, message } = JSON.parse(match?.[1]);

      const eventList = (events[event] || []).filter(Boolean);
      for (const event of eventList) event(message);
    }
    await child.status;

    const eventList = (events.disconnected || []).filter(Boolean);
    for (const event of eventList) event();
  })();

  const on = (
    event: "disconnected" | string,
    callback: (event: string, message: any) => void,
  ) => {
    if (!events[event]) events[event] = [];
    return events[event].push(callback) - 1;
  };

  const emit = (event: string, message: any) => {
    const data = JSON.stringify({ event, message }) + "\n\r";
    writer.write(encoder.encode(data));
  };

  const remove = (event: string, id: number) =>
    (events[event] = events[event].filter((event, index) =>
      index === id ? undefined : event,
    ));

  const close = () => child.kill();

  return {
    on,
    emit,
    remove,
    close,
  };
};
