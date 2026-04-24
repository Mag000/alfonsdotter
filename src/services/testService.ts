export const testService = {
  async getTestMessage(): Promise<string> {
    const res = await fetch("/api/test");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.message as string;
  },
};
