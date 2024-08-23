import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './voteCount.css';

const VoteCount = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/candidate/vote/count`);
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching vote counts', error);
        alert('Error fetching vote counts');
      } finally {
        setLoading(false);
      }
    };

    fetchVoteCounts();
  }, []);

  if (loading) {
    return <p>Loading vote counts...</p>;
  }

  const totalVotes = candidates.reduce((acc, candidate) => acc + candidate.count, 0);

  return (
    <div className="main-content">
      <div className="container mt-7">
        <h2 className="mb-5">Vote Count</h2>
        <div className="row">
          <div className="col">
            <div className="card shadow">
              <div className="card-header border-0">
                <h3 className="mb-0">All Parties</h3>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Party</th>
                      <th scope="col">Vote Count</th>
                      <th scope="col">Total Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map(candidate => (
                      <tr key={candidate._id}>
                        <td>{candidate.party}</td>
                        <td>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow={(candidate.count / totalVotes) * 100}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: `${(candidate.count / totalVotes) * 100}%` }}
                              ></div>
                            </div>
                        </td>
                        <td>{candidate.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteCount;