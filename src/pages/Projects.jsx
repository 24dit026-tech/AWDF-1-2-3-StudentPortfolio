import { useEffect, useState } from "react";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoList from "../components/RepoList";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
  

    fetch("https://api.github.com/users/24dit026-tech/repos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch repositories.");
        }
        return response.json();
      })
      .then((data) => {
        setRepos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="page-card">
      <h1>My GitHub Repositories</h1>

      <input
        type="text"
        placeholder="Search Repository"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <RepoList repos={filteredRepos} />
    </div>
  );
}

export default Projects;