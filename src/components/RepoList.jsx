function RepoList({ repos }) {
  return (
    <div>

      {repos.map((repo) => (

        <div key={repo.id} className="project">

          <h3>{repo.name}</h3>

          <p>⭐ Stars : {repo.stargazers_count}</p>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View Repository
          </a>

        </div>

      ))}

    </div>
  );
}

export default RepoList;