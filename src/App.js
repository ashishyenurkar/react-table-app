import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Body</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.body}</td>
            <td>{item.userId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Post = ({ match }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/${match.params.id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [match.params.id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.body.toLowerCase().includes(term)
    );

    setFilteredData(filtered);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Table</Link>
            </li>
          </ul>
        </nav>

        <Route
          exact
          path="/"
          render={() => (
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
              />
              <Table data={filteredData} />
            </div>
          )}
        />
        <Route path="/post/:id" component={Post} />
      </div>
    </Router>
  );
};

export default App;