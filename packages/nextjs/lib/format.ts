import { formatUnits } from "viem";

export function shortenAddress(address: string, chars = 4) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatMon(wei: bigint, digits = 4) {
  const value = formatUnits(wei, 18);
  const num = parseFloat(value);
  if (Number.isNaN(num)) return value;
  return num.toFixed(digits).replace(/\.?0+$/, "");
}

export function formatDeadline(timestamp: bigint | number) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function monToWei(mon: string): bigint {
  const parts = mon.split(".");
  const whole = parts[0] || "0";
  const frac = (parts[1] || "").padEnd(18, "0").slice(0, 18);
  return BigInt(whole + frac);
}

export function defaultDeadlines(claimMinutes: number, workMinutes: number) {
  const now = Date.now();
  return {
    claim: new Date(now + claimMinutes * 60 * 1000),
    work: new Date(now + workMinutes * 60 * 1000),
  };
}

export function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): Date {
  return new Date(value);
}
