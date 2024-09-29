import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalUrl: url })  // send the original URL to the backend
      });

      // console.log("response is",response,response.body);

      if (!response.ok) {
        throw new Error('Failed to shorten the URL');
      }
  
      const data = await response.text();  // Assuming the API returns a JSON object with the shortened URL
      setShortenedUrl(window.location.href+data);  // Extract the shortened URL from the response
    } catch (err) {
      console.log("error is ",err.message,err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortenedUrlClick = async (e) => {
    e.preventDefault(); // Prevent the default anchor tag behavior (opening the link directly)
    
    try {
      const response = await fetch("http://localhost:8080"+new URL(shortenedUrl).pathname, { method: 'GET' });

      if (!response.ok) {
        throw new Error('Failed to access the shortened URL');
      }

      console.log("response")
      const data = await response.text();  // Assuming the API returns a JSON object with the shortened URL
       console.log(data);
      window.location.href = data;
    } catch (err) {
      console.error('Error fetching the shortened URL:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your URL here..."
          required
        />
         <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

     {error && <p className="error">Error: {error}</p>}

      {shortenedUrl && (
        <div className="result">
          <p >Shortened URL: <span  onClick={handleShortenedUrlClick}>{shortenedUrl}</span></p>
        </div>
      )}
    </div>
  );
}

export default App;
