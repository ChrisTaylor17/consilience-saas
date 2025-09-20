import React, { useState, useEffect } from 'react';

const UserProfileModal = ({ isOpen, onClose, walletAddress, onSave }) => {
  const [profile, setProfile] = useState({
    name: '',
    skills: [],
    interests: [],
    experience: '',
    bio: '',
    timezone: '',
    availability: ''
  });

  const skillOptions = [
    'Rust', 'JavaScript', 'TypeScript', 'Solana', 'React', 'Node.js',
    'Smart Contracts', 'DeFi', 'NFTs', 'DAOs', 'Web3', 'Blockchain',
    'UI/UX Design', 'Product Management', 'Marketing', 'Community'
  ];

  const interestOptions = [
    'DeFi Protocols', 'NFT Marketplaces', 'Gaming', 'Social Media',
    'Infrastructure', 'Developer Tools', 'Mobile Apps', 'Web Apps',
    'DAO Governance', 'Tokenomics', 'Cross-chain', 'Layer 2'
  ];

  useEffect(() => {
    if (isOpen && walletAddress) {
      // Load existing profile
      const savedProfile = localStorage.getItem(`profile_${walletAddress}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [isOpen, walletAddress]);

  const handleSkillToggle = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    localStorage.setItem(`profile_${walletAddress}`, JSON.stringify(profile));
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="minimal-panel p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light glow-text">Your Profile</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="minimal-input w-full p-3"
              placeholder="Your name or handle"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="minimal-input w-full p-3 h-20 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    profile.skills.includes(skill)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Project Interests</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    profile.interests.includes(interest)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Experience Level</label>
            <select
              value={profile.experience}
              onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
              className="minimal-input w-full p-3"
            >
              <option value="">Select experience level</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3-5 years)</option>
              <option value="expert">Expert (5+ years)</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Availability</label>
            <select
              value={profile.availability}
              onChange={(e) => setProfile(prev => ({ ...prev, availability: e.target.value }))}
              className="minimal-input w-full p-3"
            >
              <option value="">Select availability</option>
              <option value="full-time">Full-time (40+ hours/week)</option>
              <option value="part-time">Part-time (20-40 hours/week)</option>
              <option value="casual">Casual (5-20 hours/week)</option>
              <option value="weekends">Weekends only</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 btn-minimal">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 btn-minimal glow-border">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;