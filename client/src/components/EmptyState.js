export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
}) {
  return (
    <div className="text-center py-20 text-gray-500">
      <div className="text-5xl mb-4">📭</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
