import React, { useState, useEffect } from 'react';

const UserProfileModal = ({ isOpen, onClose, walletAddress, onSave }) => {
  const [profile, setProfile] = useState({
    name: '',
    skills: [],
    interests: [],
    experience: '',
    bio: '',
    location: '',
    timezone: '',
    availability: '',
    background: '',
    goals: '',
    communicationStyle: '',
    workingHours: '',
    learningGoals: '',
    projectPreferences: '',
    personalityType: ''
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

          {/* Location & Timezone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                className="minimal-input w-full p-3"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                className="minimal-input w-full p-3"
              >
                <option value="">Select timezone</option>
                <option value="UTC-8">PST (UTC-8)</option>
                <option value="UTC-5">EST (UTC-5)</option>
                <option value="UTC+0">GMT (UTC+0)</option>
                <option value="UTC+1">CET (UTC+1)</option>
                <option value="UTC+8">CST (UTC+8)</option>
                <option value="UTC+9">JST (UTC+9)</option>
              </select>
            </div>
          </div>

          {/* Professional Background */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Professional Background</label>
            <textarea
              value={profile.background || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, background: e.target.value }))}
              className="minimal-input w-full p-3 h-20 resize-none"
              placeholder="Your professional experience, education, previous projects..."
            />
          </div>

          {/* Goals & Motivations */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Goals & Motivations</label>
            <textarea
              value={profile.goals || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
              className="minimal-input w-full p-3 h-20 resize-none"
              placeholder="What do you want to achieve? What motivates you in blockchain/Web3?"
            />
          </div>

          {/* Communication Preferences */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Preferred Communication Style</label>
            <select
              value={profile.communicationStyle || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, communicationStyle: e.target.value }))}
              className="minimal-input w-full p-3"
            >
              <option value="">Select style</option>
              <option value="direct">Direct & to the point</option>
              <option value="collaborative">Collaborative & discussion-focused</option>
              <option value="structured">Structured & organized</option>
              <option value="casual">Casual & flexible</option>
            </select>
          </div>

          {/* Working Hours & Learning Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Preferred Working Hours</label>
              <select
                value={profile.workingHours || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, workingHours: e.target.value }))}
                className="minimal-input w-full p-3"
              >
                <option value="">Select hours</option>
                <option value="morning">Morning person (6AM-12PM)</option>
                <option value="afternoon">Afternoon (12PM-6PM)</option>
                <option value="evening">Evening (6PM-12AM)</option>
                <option value="night">Night owl (12AM-6AM)</option>
                <option value="flexible">Flexible schedule</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Personality Type</label>
              <select
                value={profile.personalityType || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, personalityType: e.target.value }))}
                className="minimal-input w-full p-3"
              >
                <option value="">Select type</option>
                <option value="leader">Natural leader</option>
                <option value="collaborator">Team collaborator</option>
                <option value="independent">Independent worker</option>
                <option value="mentor">Mentor/Teacher</option>
                <option value="learner">Eager learner</option>
              </select>
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-sm text-white/60 mb-2">What do you want to learn?</label>
            <textarea
              value={profile.learningGoals || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, learningGoals: e.target.value }))}
              className="minimal-input w-full p-3 h-16 resize-none"
              placeholder="What skills or technologies do you want to learn or improve?"
            />
          </div>

          {/* Project Preferences */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Project Preferences</label>
            <textarea
              value={profile.projectPreferences || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, projectPreferences: e.target.value }))}
              className="minimal-input w-full p-3 h-16 resize-none"
              placeholder="What types of projects excite you? What size teams do you prefer?"
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