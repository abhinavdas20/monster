export function ErrorMessage({ message }: { message: string }) {
  return <div className="card border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{message}</div>;
}
