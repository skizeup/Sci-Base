export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>SciBase — Plateforme d&apos;apprentissage scientifique open-source</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/LucasMusic0/Sci-Base"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
