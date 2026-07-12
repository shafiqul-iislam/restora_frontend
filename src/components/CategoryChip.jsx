export default function CategoryChip({ label, emoji, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
        active
          ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
          : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      {emoji && <span className="text-base leading-none">{emoji}</span>}
      {label}
    </button>
  );
}
