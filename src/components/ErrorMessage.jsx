function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Something went wrong!</h2>

      <p>{message}</p>

      <button onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;