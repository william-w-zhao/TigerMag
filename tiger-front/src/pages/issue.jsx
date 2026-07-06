import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getIssueByID } from "../services/issues";
import { posthog } from "../services/posthog";

const Issue = () => {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadIssue() {
      try {
        setErrorMessage("");
        const data = await getIssueByID(id);
        setIssue(data);
        posthog.capture("issue_viewed", { issue_id: data.id, title: data.title });
      } catch (err) {
        console.error("Error loading issue:", err);
        setErrorMessage(err.message || "Could not load issue.");
      } finally {
        setLoading(false);
      }
    }

    loadIssue();
  }, [id]);

  if (loading) return <p className="p-8">Loading issue...</p>;

  if (errorMessage) {
    return <p className="p-8 text-red-600">{errorMessage}</p>;
  }

  if (!issue) return <p className="p-8">Issue not found.</p>;

  return (
    <main className="p-8">
      <iframe
        src={issue.pdf_url}
        title={issue.title}
        className="w-full h-[80vh] border border-gray-300"
      />
    </main>
  );
};

export default Issue;