export default function GlobalLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">{text}</p>
    </div>
  );
}
