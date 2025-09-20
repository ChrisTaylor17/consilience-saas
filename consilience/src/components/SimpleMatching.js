import React, { useState, useEffect } from 'react';

const SimpleMatching = ({ walletAddress }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Create fake matches for demo
    const fakeMatches = [
      {
        wallet: 'ABC123...DEF',
        name: 'Alice Developer',
        skills: ['React', 'Solana', 'TypeScript'],
        match: 85
      },
      {
        wallet: 'GHI456...JKL',
        name: 'Bob Designer',
        skills: ['UI/UX', 'Figma', 'Web3'],
        match: 72
      },
      {
        wallet: 'MNO789...PQR',
        name: 'Charlie Backend',
        skills: ['Rust', 'Node.js', 'Smart Contracts'],
        match: 68
      }
    ];
    
    setMatches(fakeMatches);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg mb-4">Recommended Matches</h3>
      
      {matches.map((match, index) => (
        <div key={index} className="p-3 border border-white/20 rounded mb-3">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{match.name}</h4>
              <p className="text-sm text-white/60">{match.wallet}</p>
            </div>
            <div className="text-sm px-2 py-1 bg-green-500/20 text-green-400 rounded">
              {match.match}% match
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {match.skills.map(skill => (
              <span key={skill} className="text-xs px-2 py-1 bg-white/10 rounded">
                {skill}
              </span>
            ))}
          </div>
          
          <button className="text-sm px-3 py-1 border border-white/20 text-white">
            Connect
          </button>
        </div>
      ))}
    </div>
  );
};

export default SimpleMatching;