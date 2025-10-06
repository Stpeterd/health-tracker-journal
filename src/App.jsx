import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scale, TrendingUp, TrendingDown, Calendar, Plus, Users, Activity, Download, Upload } from 'lucide-react';

const HealthTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [showAddData, setShowAddData] = useState(false);
  
  // Load user profile from localStorage or use defaults
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('healthTrackerProfile');
    return saved ? JSON.parse(saved) : {
      heightFeet: 5,
      heightInches: 10,
      age: 30,
      gender: 'male',
      targetWeight: 170
    };
  });

  const [showProfile, setShowProfile] = useState(false);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: ''
  });

  // Load health data from localStorage or use empty array
  const [healthData, setHealthData] = useState(() => {
    const saved = localStorage.getItem('healthTrackerData');
    return saved ? JSON.parse(saved) : [];
  });

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('healthTrackerProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Save health data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('healthTrackerData', JSON.stringify(healthData));
  }, [healthData]);

  const metrics = {
    weight: { label: 'Weight', unit: 'lbs', icon: Scale },
    bmi: { label: 'BMI', unit: '', icon: Activity },
    bodyFat: { label: 'Body Fat', unit: '%', icon: TrendingDown },
    muscleMass: { label: 'Muscle Mass', unit: 'lbs', icon: TrendingUp },
    boneMass: { label: 'Bone Mass', unit: 'lbs', icon: Activity },
    bodyWater: { label: 'Body Water', unit: '%', icon: Activity },
    bmr: { label: 'BMR', unit: 'cal', icon: Activity },
    visceralFat: { label: 'Visceral Fat', unit: '', icon: Activity }
  };

  const calculateMetrics = (weight) => {
    const totalHeightInches = (userProfile.heightFeet * 12) + userProfile.heightInches;
    const heightInMeters = totalHeightInches * 0.0254;
    const weightInKg = weight * 0.453592;
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    let bodyFat;
    
    if (userProfile.gender === 'male') {
      const chestSkinfold = 8 + (bmi - 20) * 1.8 + (userProfile.age - 30) * 0.15;
      const abdominalSkinfold = 12 + (bmi - 20) * 2.2 + (userProfile.age - 30) * 0.2;
      const thighSkinfold = 10 + (bmi - 20) * 2.0 + (userProfile.age - 30) * 0.18;
      
      const sumSkinfolds = chestSkinfold + abdominalSkinfold + thighSkinfold;
      
      const bodyDensity = 1.10938 - (0.0008267 * sumSkinfolds) + 
                          (0.0000016 * sumSkinfolds * sumSkinfolds) - 
                          (0.0002574 * userProfile.age);
      
      bodyFat = ((4.95 / bodyDensity) - 4.50) * 100;
      bodyFat = Math.max(5, Math.min(40, bodyFat));
      
    } else {
      const tricepsSkinfold = 12 + (bmi - 20) * 2.0 + (userProfile.age - 30) * 0.2;
      const suprailiacSkinfold = 10 + (bmi - 20) * 2.3 + (userProfile.age - 30) * 0.25;
      const thighSkinfold = 14 + (bmi - 20) * 2.1 + (userProfile.age - 30) * 0.22;
      
      const sumSkinfolds = tricepsSkinfold + suprailiacSkinfold + thighSkinfold;
      
      const bodyDensity = 1.0994921 - (0.0009929 * sumSkinfolds) + 
                          (0.0000023 * sumSkinfolds * sumSkinfolds) - 
                          (0.0001392 * userProfile.age);
      
      bodyFat = ((4.95 / bodyDensity) - 4.50) * 100;
      bodyFat = Math.max(10, Math.min(45, bodyFat));
    }
    
    const fatMass = weight * (bodyFat / 100);
    const boneMass = weight * 0.04;
    const muscleMass = weight - fatMass - boneMass;
    
    const bodyWater = userProfile.gender === 'male' ? 60 - (bodyFat * 0.4) : 55 - (bodyFat * 0.4);
    
    let bmr;
    const totalHeightCm = totalHeightInches * 2.54;
    if (userProfile.gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * totalHeightCm - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * totalHeightCm - 5 * userProfile.age - 161;
    }
    
    let visceralFat = (bmi - 20) * 0.8 + (bodyFat - 15) * 0.2;
    visceralFat = Math.max(1, Math.min(20, Math.round(visceralFat)));
    
    return {
      bmi: parseFloat(bmi.toFixed(1)),
      bodyFat: parseFloat(bodyFat.toFixed(1)),
      muscleMass: parseFloat(muscleMass.toFixed(1)),
      boneMass: parseFloat(boneMass.toFixed(1)),
      bodyWater: parseFloat(bodyWater.toFixed(1)),
      bmr: Math.round(bmr),
      visceralFat: visceralFat
    };
  };

  const calculateWeeklyAverages = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeekData = healthData.filter(d => new Date(d.date) >= oneWeekAgo);
    const previousWeekData = healthData.filter(d => new Date(d.date) >= twoWeeksAgo && new Date(d.date) < oneWeekAgo);

    const calculateAvg = (data, metric) => {
      if (data.length === 0) return 0;
      const sum = data.reduce((acc, item) => acc + item[metric], 0);
      return (sum / data.length).toFixed(1);
    };

    const currentWeek = {};
    const previousWeek = {};

    Object.keys(metrics).forEach(metric => {
      currentWeek[metric] = calculateAvg(currentWeekData, metric);
      previousWeek[metric] = calculateAvg(previousWeekData, metric);
    });

    return { currentWeek, previousWeek };
  };

  const calculateHistoricalWeeklyAverages = () => {
    const weeks = [];
    const sortedData = [...healthData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedData.length === 0) return [];

    const firstDate = new Date(sortedData[0].date);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    
    let currentWeekStart = new Date(firstDate);
    
    while (currentWeekStart <= lastDate) {
      const weekEnd = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekData = sortedData.filter(d => {
        const date = new Date(d.date);
        return date >= currentWeekStart && date < weekEnd;
      });

      if (weekData.length > 0) {
        const weekAvg = {
          weekStart: currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };

        Object.keys(metrics).forEach(metric => {
          const sum = weekData.reduce((acc, item) => acc + item[metric], 0);
          weekAvg[metric] = parseFloat((sum / weekData.length).toFixed(1));
        });

        weeks.push(weekAvg);
      }

      currentWeekStart = weekEnd;
    }

    return weeks;
  };

  const { currentWeek, previousWeek } = calculateWeeklyAverages();
  const weeklyTrends = calculateHistoricalWeeklyAverages();

  const getTrendIndicator = (current, previous) => {
    const diff = parseFloat(current) - parseFloat(previous);
    if (diff > 0) return { icon: TrendingUp, color: 'text-red-500', text: `+${diff.toFixed(1)}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-green-500', text: `${diff.toFixed(1)}` };
    return { icon: null, color: 'text-gray-500', text: '0' };
  };

  const handleAddData = () => {
    const weight = parseFloat(newEntry.weight);
    if (!weight || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    const calculatedMetrics = calculateMetrics(weight);
    
    const entry = {
      date: newEntry.date,
      weight: weight,
      ...calculatedMetrics
    };

    const filteredData = healthData.filter(d => d.date !== newEntry.date);
    setHealthData([...filteredData, entry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setShowAddData(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: ''
    });
  };

  // Export data as JSON file
  const handleExportData = () => {
    const dataToExport = {
      profile: userProfile,
      healthData: healthData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        if (imported.profile) setUserProfile(imported.profile);
        if (imported.healthData) setHealthData(imported.healthData);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Scale className="w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-lg md:text-2xl font-bold">Health Tracker Pro</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportData}
                className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition"
                title="Export Data"
              >
                <Download className="w-5 h-5" />
              </button>
              <label className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition cursor-pointer" title="Import Data">
                <Upload className="w-5 h-5" />
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              <button
                onClick={() => setShowProfile(true)}
                className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 transition whitespace-nowrap"
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={() => setShowAddData(true)}
                className="bg-white text-blue-600 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Add Weight</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'weekly'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Weekly Averages
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`py-4 px-2 border-b-2 font-medium transition ${
                activeTab === 'trends'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Trends
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Measurements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics).map(([key, { label, unit }]) => {
                  const latestValue = healthData[healthData.length - 1]?.[key] || 0;
                  return (
                    <div key={key} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">{label}</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {latestValue} <span className="text-sm font-normal text-gray-500">{unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">History</h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  {Object.entries(metrics).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name={metrics[selectedMetric].label}
                  />
                  {selectedMetric === 'weight' && (
                    <Line 
                      type="monotone" 
                      dataKey={() => userProfile.targetWeight} 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target Weight"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Calendar className="w-6 h-6" />
                <span>Weekly Averages Comparison</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(metrics).map(([key, { label, unit }]) => {
                  const trend = getTrendIndicator(currentWeek[key], previousWeek[key]);
                  const TrendIcon = trend.icon;
                  return (
                    <div key={key} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-100">
                      <div className="text-sm text-gray-600 mb-2">{label}</div>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold text-gray-800">
                          {currentWeek[key]} <span className="text-sm font-normal text-gray-500">{unit}</span>
                        </div>
                        {TrendIcon && (
                          <div className={`flex items-center space-x-1 ${trend.color}`}>
                            <TrendIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{trend.text}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Last week: {previousWeek[key]} {unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Weekly Average Trends</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                {Object.entries(metrics).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekStart" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name={`${metrics[selectedMetric].label} (Weekly Avg)`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {showAddData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Weight Measurement</h2>
              <p className="text-sm text-gray-600 mb-6">All other metrics will be calculated automatically based on your profile</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg"
                    placeholder="Enter weight"
                    autoFocus
                  />
                </div>
                
                {newEntry.weight && (
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Preview of calculated metrics:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {(() => {
                        const preview = calculateMetrics(parseFloat(newEntry.weight));
                        return (
                          <>
                            <div><span className="text-gray-600">BMI:</span> <span className="font-medium">{preview.bmi}</span></div>
                            <div><span className="text-gray-600">Body Fat:</span> <span className="font-medium">{preview.bodyFat}%</span></div>
                            <div><span className="text-gray-600">Muscle:</span> <span className="font-medium">{preview.muscleMass} lbs</span></div>
                            <div><span className="text-gray-600">BMR:</span> <span className="font-medium">{preview.bmr} cal</span></div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddData}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Save Measurement
                </button>
                <button
                  onClick={() => setShowAddData(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h2>
              <p className="text-sm text-gray-600 mb-6">Your profile info is used to calculate body metrics</p>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (feet)</label>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={userProfile.heightFeet}
                      onChange={(e) => setUserProfile({...userProfile, heightFeet: parseInt(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={userProfile.heightInches}
                      onChange={(e) => setUserProfile({...userProfile, heightInches: parseInt(e.target.value) || 0})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={userProfile.gender}
                    onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (lbs)</label>
                  <input
                    type="number"
                    value={userProfile.targetWeight}
                    onChange={(e) => setUserProfile({...userProfile, targetWeight: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowProfile(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTrackerApp;
