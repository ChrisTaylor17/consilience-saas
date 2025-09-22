import React from 'react';
import { TrendingUp, Users, Zap, Award, DollarSign, Activity } from 'lucide-react';

const StatsPanel = ({ stats, userWallet }) => {
  const defaultStats = {
    totalProjects: 0,
    completedTasks: 0,
    tokensEarned: 0,
    collaborations: 0,
    reputation: 0,
    activeStreak: 0,
    ...stats
  };

  const statItems = [
    {
      icon: Users,
      label: 'Active Projects',
      value: defaultStats.totalProjects,
      change: '+12%',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Zap,
      label: 'Tasks Completed',
      value: defaultStats.completedTasks,
      change: '+8%',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: DollarSign,
      label: 'Tokens Earned',
      value: defaultStats.tokensEarned.toLocaleString(),
      change: '+24%',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Award,
      label: 'Reputation Score',
      value: defaultStats.reputation,
      change: '+5%',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const achievements = [
    { name: 'First Project', description: 'Created your first project', earned: true },
    { name: 'Team Player', description: 'Joined 5 collaborative projects', earned: true },
    { name: 'Task Master', description: 'Completed 10 tasks', earned: defaultStats.completedTasks >= 10 },
    { name: 'Token Collector', description: 'Earned 1000+ tokens', earned: defaultStats.tokensEarned >= 1000 }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Performance Stats</h3>
            <p className="text-xs text-gray-400">Your collaboration metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-green-400 font-medium">{item.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
              <div className="text-sm text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Activity Overview</h3>
            <p className="text-xs text-gray-400">Last 7 days</p>
          </div>
        </div>

        {/* Simple activity bars */}
        <div className="space-y-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const activity = Math.random() * 100;
            return (
              <div key={day} className="flex items-center space-x-3">
                <span className="text-sm text-gray-400 w-8">{day}</span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${activity}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">{Math.round(activity)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Achievements</h3>
            <p className="text-xs text-gray-400">Unlock rewards through collaboration</p>
          </div>
        </div>

        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className={`p-3 rounded-lg border transition-all ${
              achievement.earned 
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${achievement.earned ? 'text-yellow-400' : 'text-gray-300'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-yellow-500' : 'bg-gray-600'
                }`}>
                  {achievement.earned ? (
                    <Award className="w-3 h-3 text-black" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all">
            <div className="font-medium text-white">View Profile Analytics</div>
            <div className="text-xs text-gray-400">Detailed performance insights</div>
          </button>
          <button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all">
            <div className="font-medium text-white">Export Activity Report</div>
            <div className="text-xs text-gray-400">Download your collaboration data</div>
          </button>
          <button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left transition-all">
            <div className="font-medium text-white">Share Profile</div>
            <div className="text-xs text-gray-400">Show your achievements to others</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;