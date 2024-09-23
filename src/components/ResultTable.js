// ResultsTable.js
import React from 'react';

const ResultsTable = ({ rounds }) => {

    console.log(rounds)
  return (
    <table style={{ margin: '20px auto', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '10px' }}>Round</th>
          <th style={{ border: '1px solid black', padding: '10px' }}>Player 1</th>
          <th style={{ border: '1px solid black', padding: '10px' }}>Player 2</th>
          <th style={{ border: '1px solid black', padding: '10px' }}>Winner</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((round, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid black', padding: '10px' }}>{round.round}</td>
            <td style={{ border: '1px solid black', padding: '10px' }}>{round.player1.name}</td>
            <td style={{ border: '1px solid black', padding: '10px' }}>{round.player2.name}</td>
            <td style={{ border: '1px solid black', padding: '10px' }}>{round.winner}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
