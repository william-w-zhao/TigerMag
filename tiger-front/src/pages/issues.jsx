import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIssues } from "../services/issues";
import Loading from "../components/Loading";

const IssueCover = ({ pdfUrl, title }) => {
  return (
    <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
      <iframe
        src={`${pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
        title={title}
        className="w-full h-full border-0 pointer-events-none"
      />
    </div>
  );
};

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadIssues() {
      try {
        setErrorMessage("");
        const data = await getIssues();
        setIssues(data);
      } catch (err) {
        console.error("Error loading issues:", err);
        setErrorMessage(err.message || "Could not load issues.");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  if (loading) return <p className="p-8"><Loading/></p>;

  if (errorMessage) {
    return <p className="p-8 text-red-600">{errorMessage}</p>;
  }

  return (
    <main className="p-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-16 gap-y-14">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="block hover:opacity-80 transition"
          >
          <IssueCover pdfUrl={issue.pdf_url} title={issue.title} />
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-center">
            {issue.title}
          </h2>
        </Link>
        ))}
      </div>
    </main>
  );
};

export default Issues;