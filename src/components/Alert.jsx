export default function Alert({ message }) {
  if (!message) return null;
  return (
    <div className="alert bg-red-100 border border-red-300 text-red-800 px-3 py-2 rounded">
      {message}
    </div>
  );
}
