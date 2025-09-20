import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

const UserMatcher = ({ walletAddress, userProfile, onMatch }) => {
  const [matches, setMatches] = useState([]);
  const [allProfiles, setAllProfiles] = useState({});

  useEffect(() => {
    // Load all user profiles for matching
    const loadProfiles = () => {
      const profiles = {};
      // Get all stored profiles from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profile_')) {
          try {
            const profile = JSON.parse(localStorage.getItem(key));
            const wallet = key.replace('profile_', '');
            if (wallet !== walletAddress) {
              profiles[wallet] = profile;
            }
          } catch (error) {
            console.error('Error loading profile:', error);
          }
        }
      }
      setAllProfiles(profiles);
    };

    loadProfiles();
  }, [walletAddress]);

  const calculateMatch = (profile1, profile2) => {
    if (!profile1 || !profile2) return 0;
    
    let score = 0;
    
    // Skill complementarity (30%)
    const commonSkills = profile1.skills?.filter(skill => 
      profile2.skills?.includes(skill)
    ).length || 0;
    const totalSkills = new Set([...(profile1.skills || []), ...(profile2.skills || [])]).size;
    if (totalSkills > 0) {
      score += (commonSkills / totalSkills) * 30;
    }
    
    // Interest alignment (25%)
    const commonInterests = profile1.interests?.filter(interest => 
      profile2.interests?.includes(interest)
    ).length || 0;
    const totalInterests = new Set([...(profile1.interests || []), ...(profile2.interests || [])]).size;
    if (totalInterests > 0) {
      score += (commonInterests / totalInterests) * 25;
    }
    
    // Experience compatibility (20%)
    const expLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const exp1 = expLevels.indexOf(profile1.experience || 'beginner');
    const exp2 = expLevels.indexOf(profile2.experience || 'beginner');
    const expDiff = Math.abs(exp1 - exp2);
    score += Math.max(0, (3 - expDiff) / 3) * 20;
    
    // Timezone compatibility (15%)
    if (profile1.timezone && profile2.timezone) {
      const tz1 = parseInt(profile1.timezone.replace('UTC', ''));
      const tz2 = parseInt(profile2.timezone.replace('UTC', ''));
      const tzDiff = Math.abs(tz1 - tz2);
      score += Math.max(0, (12 - tzDiff) / 12) * 15;
    }
    
    // Communication style (10%)
    if (profile1.communicationStyle === profile2.communicationStyle) {
      score += 10;
    }
    
    return Math.round(score);
  };

  useEffect(() => {
    if (!userProfile) return;
    
    const matchedUsers = Object.entries(allProfiles).map(([wallet, profile]) => {
      const matchScore = calculateMatch(userProfile, profile);
      return {
        walletAddress: wallet,
        profile,
        matchScore,
        reasons: getMatchReasons(userProfile, profile)
      };
    }).filter(match => match.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
    
    setMatches(matchedUsers);
  }, [userProfile, allProfiles]);

  const getMatchReasons = (profile1, profile2) => {
    const reasons = [];
    
    const commonSkills = profile1.skills?.filter(skill => 
      profile2.skills?.includes(skill)
    ) || [];
    if (commonSkills.length > 0) {
      reasons.push(`Shared skills: ${commonSkills.slice(0, 2).join(', ')}`);
    }
    
    const commonInterests = profile1.interests?.filter(interest => 
      profile2.interests?.includes(interest)
    ) || [];
    if (commonInterests.length > 0) {
      reasons.push(`Common interests: ${commonInterests.slice(0, 2).join(', ')}`);
    }
    
    if (profile1.timezone === profile2.timezone) {
      reasons.push('Same timezone');
    }
    
    if (profile1.communicationStyle === profile2.communicationStyle) {
      reasons.push('Compatible communication style');
    }
    
    return reasons;
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-4 text-white/60">
        <p>No matches found. Complete your profile to find compatible teammates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recommended Matches</h3>
      {matches.map((match) => (
        <div key={match.walletAddress} className="minimal-panel p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{match.profile.name || 'Anonymous'}</h4>
              <p className="text-sm text-white/60">
                {match.walletAddress.slice(0, 8)}...{match.walletAddress.slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm px-2 py-1 rounded ${
                match.matchScore >= 70 ? 'bg-green-500/20 text-green-400' :
                match.matchScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {match.matchScore}% match
              </div>
            </div>
          </div>
          
          {match.profile.bio && (
            <p className="text-sm text-white/70 mb-2">{match.profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-2">
            {match.profile.skills?.slice(0, 4).map(skill => (
              <span key={skill} className="text-xs px-2 py-1 bg-white/10 rounded">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="text-xs text-white/60 mb-3">
            {match.reasons.join(' • ')}
          </div>
          
          <button
            onClick={() => onMatch(match)}
            className="text-sm btn-minimal px-3 py-1"
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserMatcher;