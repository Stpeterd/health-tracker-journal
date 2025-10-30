import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scale, TrendingUp, TrendingDown, Calendar, Plus, Users, Activity, Download, Upload, FileText, Trash2, Edit2, AlertCircle, Droplets, Dumbbell, Utensils, Check, Sparkles, Moon, Sun } from 'lucide-react';

const HealthTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [showAddData, setShowAddData] = useState(false);
  const [currentDashboardCard, setCurrentDashboardCard] = useState(0);
  const [currentWeeklyCard, setCurrentWeeklyCard] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showWeeklyHistory, setShowWeeklyHistory] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedWeeklyMetric, setSelectedWeeklyMetric] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [editingStepsId, setEditingStepsId] = useState(null);
  const [showCurrentWeekDetails, setShowCurrentWeekDetails] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerDarkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Fitbit states
  const [fitbitConnected, setFitbitConnected] = useState(false);
  const [fitbitLoading, setFitbitLoading] = useState(false);
  const [fitbitError, setFitbitError] = useState('');
  
  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerProfile');
      return saved ? JSON.parse(saved) : {
        heightFeet: 5,
        heightInches: 10,
        age: 30,
        gender: 'male',
        targetWeight: 170
      };
    }
    return {
      heightFeet: 5,
      heightInches: 10,
      age: 30,
      gender: 'male',
      targetWeight: 170
    };
  });

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: ''
  });

  const [healthData, setHealthData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerData');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerNotes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [waterIntake, setWaterIntake] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerWater');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [exercises, setExercises] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerExercises');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [meals, setMeals] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerMeals');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [steps, setSteps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthTrackerSteps');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newSteps, setNewSteps] = useState({
    date: new Date().toISOString().split('T')[0],
    count: '',
    notes: ''
  });

  const [newExercise, setNewExercise] = useState({
    type: 'cardio',
    duration: '',
    intensity: 'medium',
    calories: '',
    notes: ''
  });
  
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    notes: ''
  });

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerDarkMode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  // Fitbit Connection Functions
  const connectFitbit = async () => {
    setFitbitLoading(true);
    setFitbitError('');

    try {
      // In production, this would use Fitbit's OAuth 2.0 flow
      // For now, simulate the connection
      alert('Fitbit Integration Info:\n\n' +
            'To connect Fitbit in production:\n' +
            '1. Register app at dev.fitbit.com\n' +
            '2. Implement OAuth 2.0 flow\n' +
            '3. Request activity & sleep permissions\n' +
            '4. Fetch step data from Fitbit API\n\n' +
            'For now, manually add steps using the + button!');
      
      setFitbitConnected(true);
      
    } catch (error) {
      setFitbitError('Failed to connect to Fitbit. Please try again.');
      console.error('Fitbit connection error:', error);
    } finally {
      setFitbitLoading(false);
    }
  };

  const disconnectFitbit = () => {
    setFitbitConnected(false);
    alert('Fitbit disconnected successfully');
  };

const metrics = {
    weight: { label: 'Weight', unit: 'lbs', icon: Scale, group: 1 },
    bmi: { label: 'BMI', unit: '', icon: Activity, group: 1 },
    bodyFat: { label: 'Body Fat', unit: '%', icon: TrendingDown, group: 1 },
    muscleMass: { label: 'Muscle Mass', unit: 'lbs', icon: TrendingUp, group: 1 },
    boneMass: { label: 'Bone Mass', unit: 'lbs', icon: Activity, group: 2 },
    bodyWater: { label: 'Body Water', unit: '%', icon: Activity, group: 2 },
    bmr: { label: 'BMR', unit: 'cal', icon: Activity, group: 2 },
    visceralFat: { label: 'Visceral Fat', unit: '', icon: Activity, group: 2 }
  };

  const metricsGroup1 = Object.entries(metrics).filter(([_, m]) => m.group === 1);
  const metricsGroup2 = Object.entries(metrics).filter(([_, m]) => m.group === 2);

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
      const bodyDensity = 1.10938 - (0.0008267 * sumSkinfolds) + (0.0000016 * sumSkinfolds * sumSkinfolds) - (0.0002574 * userProfile.age);
      bodyFat = ((4.95 / bodyDensity) - 4.50) * 100;
      bodyFat = Math.max(5, Math.min(40, bodyFat));
      
    } else {
      const tricepsSkinfold = 12 + (bmi - 20) * 2.0 + (userProfile.age - 30) * 0.2;
      const suprailiacSkinfold = 10 + (bmi - 20) * 2.3 + (userProfile.age - 30) * 0.25;
      const thighSkinfold = 14 + (bmi - 20) * 2.1 + (userProfile.age - 30) * 0.22;
      
      const sumSkinfolds = tricepsSkinfold + suprailiacSkinfold + thighSkinfold;
      const bodyDensity = 1.0994921 - (0.0009929 * sumSkinfolds) + (0.0000023 * sumSkinfolds * sumSkinfolds) - (0.0001392 * userProfile.age);
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

    return { currentWeek, previousWeek, currentWeekData };
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
          weekStart: currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weekEnd: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

  const { currentWeek, previousWeek, currentWeekData } = calculateWeeklyAverages();
  const weeklyTrends = calculateHistoricalWeeklyAverages();

  const getTrendIndicator = (current, previous) => {
    const diff = parseFloat(current) - parseFloat(previous);
    if (diff > 0) return { icon: TrendingUp, color: 'text-red-500', text: `+${diff.toFixed(1)}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-green-500', text: `${diff.toFixed(1)}` };
    return { icon: null, color: 'text-gray-500', text: '0' };
  };

  const getTodayWater = () => {
    const today = new Date().toISOString().split('T')[0];
    return waterIntake[today] || { total: 0, goal: 64, entries: [] };
  };

  const addWater = (amount) => {
    const today = new Date().toISOString().split('T')[0];
    const currentData = getTodayWater();
    const newEntry = {
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: amount
    };
    
    setWaterIntake({
      ...waterIntake,
      [today]: {
        ...currentData,
        total: currentData.total + amount,
        entries: [...currentData.entries, newEntry]
      }
    });
  };

  const getTodayExercises = () => {
    const today = new Date().toISOString().split('T')[0];
    return exercises.filter(ex => ex.date === today);
  };

  const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(m => m.date === today);
  };

  const getTodayCalories = () => {
    return getTodayMeals().reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0);
  };

  const getTodaySteps = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySteps = steps.filter(s => s.date === today);
    return todaySteps.reduce((sum, s) => sum + parseInt(s.count), 0);
  };

  const calculateStepsCalories = (stepCount) => {
    // Formula: steps × 0.04 × (weight ÷ 150)
    // Assumes ~80 calories per 2000 steps for a 150lb person
    const latestWeight = healthData[healthData.length - 1]?.weight || userProfile.targetWeight || 150;
    return Math.round(stepCount * 0.04 * (latestWeight / 150));
  };

  const getTodayStepsCalories = () => {
    return calculateStepsCalories(getTodaySteps());
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      alert('Please enter a note');
      return;
    }

    if (editingNoteId) {
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, text: newNote, displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (edited)' }
          : note
      ));
      setEditingNoteId(null);
    } else {
      const note = {
        id: Date.now(),
        text: newNote,
        date: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setNotes([note, ...notes]);
    }

    setNewNote('');
    setShowNoteModal(false);
  };

  const handleEditNote = (note) => {
    setNewNote(note.text);
    setEditingNoteId(note.id);
    setShowNoteModal(true);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleAddExercise = () => {
    if (!newExercise.duration) {
      alert('Please enter duration');
      return;
    }

    const exercise = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...newExercise
    };

    setExercises([exercise, ...exercises]);
    setNewExercise({ type: 'cardio', duration: '', intensity: 'medium', calories: '', notes: '' });
    setShowExerciseModal(false);
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm('Delete this exercise?')) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };

  const handleAddMeal = () => {
    if (!newMeal.name) {
      alert('Please enter meal name');
      return;
    }

    const meal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...newMeal
    };

    setMeals([meal, ...meals]);
    setNewMeal({ type: 'breakfast', name: '', calories: '', notes: '' });
    setShowMealModal(false);
  };

  const handleDeleteMeal = (id) => {
    if (window.confirm('Delete this meal?')) {
      setMeals(meals.filter(m => m.id !== id));
    }
  };

  const handleAddSteps = () => {
    if (!newSteps.count || parseInt(newSteps.count) <= 0) {
      alert('Please enter a valid step count');
      return;
    }

    if (editingStepsId) {
      // Edit existing entry
      setSteps(steps.map(s => 
        s.id === editingStepsId
          ? {
              ...s,
              date: newSteps.date,
              count: parseInt(newSteps.count),
              calories: calculateStepsCalories(parseInt(newSteps.count)),
              notes: newSteps.notes
            }
          : s
      ));
      setEditingStepsId(null);
    } else {
      // Add new entry
      const stepEntry = {
        id: Date.now(),
        date: newSteps.date,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        count: parseInt(newSteps.count),
        calories: calculateStepsCalories(parseInt(newSteps.count)),
        notes: newSteps.notes
      };
      setSteps([stepEntry, ...steps]);
    }

    setNewSteps({ date: new Date().toISOString().split('T')[0], count: '', notes: '' });
    setShowStepsModal(false);
  };

  const handleEditSteps = (step) => {
    setNewSteps({
      date: step.date,
      count: step.count.toString(),
      notes: step.notes || ''
    });
    setEditingStepsId(step.id);
    setShowStepsModal(true);
  };

  const handleDeleteSteps = (id) => {
    if (window.confirm('Delete this step entry?')) {
      setSteps(steps.filter(s => s.id !== id));
    }
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

  const handleExportData = () => {
    const dataToExport = {
      profile: userProfile,
      healthData: healthData,
      notes: notes,
      waterIntake: waterIntake,
      exercises: exercises,
      meals: meals,
      steps: steps,
      darkMode: darkMode,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-tracker-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        if (imported.profile) setUserProfile(imported.profile);
        if (imported.healthData) setHealthData(imported.healthData);
        if (imported.notes) setNotes(imported.notes);
        if (imported.waterIntake) setWaterIntake(imported.waterIntake);
        if (imported.exercises) setExercises(imported.exercises);
        if (imported.meals) setMeals(imported.meals);
        if (imported.steps) setSteps(imported.steps);
        if (imported.darkMode !== undefined) setDarkMode(imported.darkMode);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data');
      }
    };
    reader.readAsText(file);
  };

  // Theme classes
  const bgMain = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const bgCard = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-white';
  const inputBorder = darkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`min-h-screen ${bgMain}`}>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Scale className="w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-lg md:text-2xl font-bold">Health Tracker Journal</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition" 
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={handleExportData} className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition" title="Export">
                <Download className="w-5 h-5" />
              </button>
              <label className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition cursor-pointer" title="Import">
                <Upload className="w-5 h-5" />
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              <button onClick={() => setShowProfile(true)} className="bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-opacity-30 transition whitespace-nowrap">
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button onClick={() => setShowAddData(true)} className="bg-white text-blue-600 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition whitespace-nowrap">
                <Plus className="w-5 h-5" />
                <span>Add Weight</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${bgCard} shadow-md`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-6 overflow-x-auto">
            {['dashboard', 'steps', 'activity', 'nutrition', 'weekly', 'notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium transition whitespace-nowrap text-sm ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : `border-transparent ${textSecondary} hover:text-gray-800 dark:hover:text-gray-200`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-20">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary}`}>Current Measurements</h2>
                <div className="flex space-x-2">
                  {[0, 1].map(i => (
                    <button key={i} onClick={() => setCurrentDashboardCard(i)} className={`w-2 h-2 rounded-full transition ${currentDashboardCard === i ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
          {/* Fitbit Integration */}
          <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
            <h3 className={`font-bold ${textPrimary} flex items-center space-x-2 text-sm mb-4`}>
              <Activity className="w-5 h-5 text-green-600" />
              <span>Connected Devices</span>
            </h3>
            
            <div className="space-y-3">
              {/* Fitbit */}
              <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${fitbitConnected ? 'text-green-600' : darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-medium text-sm ${textPrimary}`}>Fitbit</p>
                    <p className={`text-xs ${textSecondary}`}>
                      {fitbitConnected ? 'Connected - Ready to sync' : 'Sync steps automatically'}
                    </p>
                  </div>
                </div>
                {fitbitConnected ? (
                  <button
                    onClick={disconnectFitbit}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs hover:bg-red-200 transition"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={connectFitbit}
                    disabled={fitbitLoading}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {fitbitLoading ? 'Connecting...' : 'Connect'}
                  </button>
                )}
              </div>
              
              {fitbitError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{fitbitError}</p>
                </div>
              )}
              
              {fitbitConnected && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Check className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700">
                    Fitbit connected! Use the Steps tab to log your activity.
                  </p>
                </div>
              )}
            </div>
          </div>
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentDashboardCard * 100}%)` }}>
                  {[metricsGroup1, metricsGroup2].map((group, groupIndex) => (
                    <div key={groupIndex} className={`w-full flex-shrink-0 grid grid-cols-2 gap-3 ${groupIndex === 0 ? 'pr-2' : 'pl-2'}`}>
                      {group.map(([key, { label, unit }]) => {
                        const latestValue = healthData[healthData.length - 1]?.[key] || 0;
                        return (
                          <div key={key} className={`${darkMode ? 'bg-gray-700' : `bg-gradient-to-br ${groupIndex === 0 ? 'from-blue-50 to-indigo-50' : 'from-purple-50 to-pink-50'}`} rounded-lg p-3`}>
                            <div className={`text-xs ${textSecondary} mb-1`}>{label}</div>
                            <div className={`text-xl font-bold ${textPrimary}`}>{latestValue} <span className={`text-xs font-normal ${textSecondary}`}>{unit}</span></div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`text-center mt-3 text-xs ${textSecondary}`}>Tap dots to switch →</div>
            </div>

            {healthData.length > 0 && (
              <div className={`${bgCard} rounded-xl shadow-lg p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <h3 className={`font-bold ${textPrimary} text-sm`}>Goal Progress</h3>
                  </div>
                  <div className={`text-xs font-medium ${textSecondary}`}>
                    {(() => {
                      const current = healthData[healthData.length - 1]?.weight || 0;
                      const start = healthData[0]?.weight || current;
                      const target = userProfile.targetWeight;
                      const totalToLose = start - target;
                      const lostSoFar = start - current;
                      const percentage = totalToLose !== 0 ? Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100)) : 0;
                      return `${percentage.toFixed(0)}%`;
                    })()}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center">
                    <div className={`text-xs ${textSecondary}`}>Current</div>
                    <div className={`text-base font-bold ${textPrimary}`}>{healthData[healthData.length - 1]?.weight || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs ${textSecondary}`}>Goal</div>
                    <div className="text-base font-bold text-blue-600">{userProfile.targetWeight}</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs ${textSecondary}`}>To Go</div>
                    <div className="text-base font-bold text-green-600">{Math.abs((healthData[healthData.length - 1]?.weight || 0) - userProfile.targetWeight).toFixed(1)}</div>
                  </div>
                </div>
                
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" style={{
                    width: `${(() => {
                      const current = healthData[healthData.length - 1]?.weight || 0;
                      const start = healthData[0]?.weight || current;
                      const target = userProfile.targetWeight;
                      const totalToLose = start - target;
                      const lostSoFar = start - current;
                      return totalToLose !== 0 ? Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100)) : 0;
                    })()}%`
                  }} />
                </div>
                
                <div className={`text-center mt-2 text-xs font-medium ${textSecondary}`}>
                  {(() => {
                    const current = healthData[healthData.length - 1]?.weight || 0;
                    const target = userProfile.targetWeight;
                    const remaining = current - target;
                    if (remaining > 0) return `${remaining.toFixed(1)} lbs to goal 💪`;
                    if (remaining < 0) return `🎉 Goal exceeded by ${Math.abs(remaining).toFixed(1)} lbs!`;
                    return `🎯 Goal reached!`;
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span>Steps Tracker</span>
                </h2>
                <button onClick={() => setShowStepsModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} rounded-lg p-4 mb-3`}>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className={`text-xs ${textSecondary}`}>Today's Steps</div>
                    <div className="text-3xl font-bold text-blue-600">{getTodaySteps().toLocaleString()}</div>
                  </div>
                  <div>
                    <div className={`text-xs ${textSecondary}`}>Calories Burned</div>
                    <div className="text-3xl font-bold text-green-600">{getTodayStepsCalories()}</div>
                  </div>
                </div>
                <div className={`mt-3 text-center text-xs ${textSecondary}`}>
                  🎯 Goal: 10,000 steps • {((getTodaySteps() / 10000) * 100).toFixed(0)}% complete
                </div>
                <div className={`mt-2 w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((getTodaySteps() / 10000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {steps.length === 0 ? (
                  <div className={`text-center py-8 ${textSecondary}`}>
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No steps logged yet</p>
                  </div>
                ) : (
                  steps.map((step) => (
                    <div key={step.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100'} rounded-lg p-3 border`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className={`text-xs ${textSecondary} font-medium`}>{step.date} • {step.time}</span>
                          <div className={`font-bold ${textPrimary} text-sm mt-1`}>👟 {step.count.toLocaleString()} steps</div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditSteps(step)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteSteps(step.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div><span className={textSecondary}>Calories:</span> <span className="font-medium text-green-600">~{step.calories}</span></div>
                      </div>
                      {step.notes && <p className={`text-xs ${textPrimary} mt-1`}>{step.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <Dumbbell className="w-5 h-5 text-orange-500" />
                  <span>Exercise Log</span>
                </h2>
                <button onClick={() => setShowExerciseModal(true)} className="bg-orange-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {exercises.length === 0 ? (
                  <div className={`text-center py-8 ${textSecondary}`}>
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No exercises logged yet</p>
                  </div>
                ) : (
                  exercises.map((ex) => (
                    <div key={ex.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100'} rounded-lg p-3 border`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className={`text-xs ${textSecondary} font-medium`}>{ex.date} • {ex.time}</span>
                          <div className={`font-bold ${textPrimary} text-sm mt-1`}>{ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}</div>
                        </div>
                        <button onClick={() => handleDeleteExercise(ex.id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className={textSecondary}>Duration:</span> <span className="font-medium">{ex.duration}min</span></div>
                        <div><span className={textSecondary}>Intensity:</span> <span className="font-medium">{ex.intensity}</span></div>
                        {ex.calories && <div><span className={textSecondary}>Calories:</span> <span className="font-medium">{ex.calories}</span></div>}
                      </div>
                      {ex.notes && <p className={`text-xs ${textPrimary} mt-1`}>{ex.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <Utensils className="w-5 h-5 text-green-500" />
                  <span>Meal Log</span>
                </h2>
                <button onClick={() => setShowMealModal(true)} className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-3 mb-3`}>
                <div className="text-center">
                  <div className={`text-xs ${textSecondary}`}>Today's Calories</div>
                  <div className="text-2xl font-bold text-green-600">{getTodayCalories()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {meals.length === 0 ? (
                  <div className={`text-center py-8 ${textSecondary}`}>
                    <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No meals logged yet</p>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div key={meal.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'} rounded-lg p-3 border`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className={`text-xs ${textSecondary} font-medium`}>{meal.date} • {meal.time}</span>
                          <div className={`font-bold ${textPrimary} text-sm mt-1`}>{meal.name}</div>
                        </div>
                        <button onClick={() => handleDeleteMeal(meal.id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div><span className={textSecondary}>Type:</span> <span className="font-medium">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span></div>
                        <div><span className={textSecondary}>Calories:</span> <span className="font-medium text-green-600">{meal.calories || 0}</span></div>
                      </div>
                      {meal.notes && <p className={`text-xs ${textPrimary} mt-1`}>{meal.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>Water Intake</span>
                </h2>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${textSecondary}`}>Today's Progress</span>
                  <span className={`text-sm font-medium ${textPrimary}`}>{getTodayWater().total}oz / {getTodayWater().goal}oz</span>
                </div>
                <div className={`relative h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min((getTodayWater().total / getTodayWater().goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <button onClick={() => addWater(8)} className={`flex-1 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>+8oz</button>
                <button onClick={() => addWater(16)} className={`flex-1 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>+16oz</button>
                <button onClick={() => addWater(32)} className={`flex-1 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>+32oz</button>
              </div>
              
              {getTodayWater().entries.length > 0 && (
                <div>
                  <h3 className={`font-medium ${textPrimary} mb-2 text-sm`}>Today's Log:</h3>
                  <div className="space-y-1">
                    {getTodayWater().entries.map((entry, index) => (
                      <div key={index} className={`flex justify-between text-sm ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded px-3 py-2`}>
                        <span className={textSecondary}>{entry.time}</span>
                        <span className="font-medium text-blue-600">+{entry.amount}oz</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <Calendar className="w-5 h-5" />
                  <span>Weekly Averages</span>
                </h2>
                <div className="flex space-x-2">
                  {[0, 1].map(i => (
                    <button key={i} onClick={() => setCurrentWeeklyCard(i)} className={`w-2 h-2 rounded-full transition ${currentWeeklyCard === i ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentWeeklyCard * 100}%)` }}>
                  {[metricsGroup1, metricsGroup2].map((group, groupIndex) => (
                    <div key={groupIndex} className={`w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3 ${groupIndex === 0 ? 'pr-2' : 'pl-2'}`}>
                      {group.map(([key, { label, unit }]) => {
                        const trend = getTrendIndicator(currentWeek[key], previousWeek[key]);
                        const TrendIcon = trend.icon;
                        const isWeightMetric = key === 'weight';
                        return (
                          <button 
                            key={key} 
                            onClick={() => { 
                              if (isWeightMetric) {
                                setShowCurrentWeekDetails(true);
                              } else {
                                setSelectedWeeklyMetric(key); 
                                setShowWeeklyHistory(true);
                              }
                            }}
                            className={`${darkMode ? 'bg-gray-700 border-gray-600' : `bg-gradient-to-br ${groupIndex === 0 ? 'from-blue-50 to-indigo-50 border-blue-100' : 'from-purple-50 to-pink-50 border-purple-100'}`} rounded-lg p-3 border-2 text-left hover:shadow-md transition`}>
                            <div className={`text-xs ${textSecondary} mb-1`}>{label}</div>
                            <div className="flex items-baseline justify-between">
                              <div className={`text-xl font-bold ${textPrimary}`}>{currentWeek[key]} <span className={`text-xs font-normal ${textSecondary}`}>{unit}</span></div>
                              {TrendIcon && (
                                <div className={`flex items-center space-x-1 ${trend.color}`}>
                                  <TrendIcon className="w-3 h-3" />
                                  <span className="text-xs font-medium">{trend.text}</span>
                                </div>
                              )}
                            </div>
                            <div className={`text-xs ${textSecondary} mt-1`}>Last week: {previousWeek[key]} {unit}</div>
                            <div className={`text-xs mt-1 ${groupIndex === 0 ? 'text-blue-600' : 'text-purple-600'}`}>
                              {isWeightMetric ? 'Tap for entries →' : 'Tap for history →'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`text-center mt-3 text-xs ${textSecondary}`}>Tap dots to switch →</div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className={`${bgCard} rounded-xl shadow-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-lg font-bold ${textPrimary} flex items-center space-x-2`}>
                  <FileText className="w-5 h-5" />
                  <span>Notes</span>
                </h2>
                <button onClick={() => setShowNoteModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <p className={`text-xs ${textSecondary} mb-3`}>Track diet changes, exercises, or lifestyle adjustments 📝</p>

              <div className="space-y-2">
                {notes.length === 0 ? (
                  <div className={`text-center py-8 ${textSecondary}`}>
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'} rounded-lg p-3 border`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs ${textSecondary} font-medium`}>{note.displayDate}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditNote(note)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${textPrimary} whitespace-pre-wrap`}>{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowDisclaimer(true)}
              className={`w-full ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'} border-2 rounded-xl p-3 hover:opacity-80 transition flex items-center justify-center space-x-2`}
            >
              <span className="text-xl">⚠️</span>
              <span className={`font-semibold text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>View Calculation Disclaimer</span>
            </button>
          </div>
        )}
      </div>

      {/* ALL MODALS */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>Profile Settings</h2>
              
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Height (ft)</label>
                    <input type="number" value={userProfile.heightFeet} onChange={(e) => setUserProfile({...userProfile, heightFeet: parseInt(e.target.value) || 0})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Height (in)</label>
                    <input type="number" value={userProfile.heightInches} onChange={(e) => setUserProfile({...userProfile, heightInches: parseInt(e.target.value) || 0})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Age</label>
                  <input type="number" value={userProfile.age} onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value) || 0})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Gender</label>
                  <select value={userProfile.gender} onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Target Weight (lbs)</label>
                  <input type="number" value={userProfile.targetWeight} onChange={(e) => setUserProfile({...userProfile, targetWeight: parseFloat(e.target.value) || 0})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} />
                </div>
              </div>
              
              <button onClick={() => setShowProfile(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {showAddData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>Add Weight Entry</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Weight (lbs)</label>
                  <input type="number" step="0.1" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} placeholder="175.5" autoFocus />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddData} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Save</button>
                <button onClick={() => { setShowAddData(false); setNewEntry({ date: new Date().toISOString().split('T')[0], weight: '' }); }} className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>Log Exercise</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Type</label>
                  <select value={newExercise.type} onChange={(e) => setNewExercise({...newExercise, type: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Duration (min)</label>
                  <input type="number" value={newExercise.duration} onChange={(e) => setNewExercise({...newExercise, duration: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} placeholder="30" />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Intensity</label>
                  <select value={newExercise.intensity} onChange={(e) => setNewExercise({...newExercise, intensity: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Calories (optional)</label>
                  <input type="number" value={newExercise.calories} onChange={(e) => setNewExercise({...newExercise, calories: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} placeholder="250" />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Notes (optional)</label>
                  <textarea value={newExercise.notes} onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 h-16 resize-none text-sm`} placeholder="5K run, leg day..." />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddExercise} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition text-sm">Save</button>
                <button onClick={() => { setShowExerciseModal(false); setNewExercise({ type: 'cardio', duration: '', intensity: 'medium', calories: '', notes: '' }); }} className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>Log Meal</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Type</label>
                  <select value={newMeal.type} onChange={(e) => setNewMeal({...newMeal, type: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Meal Name</label>
                  <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} placeholder="Grilled chicken salad" autoFocus />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Calories</label>
                  <input type="number" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`} placeholder="500" />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Notes (optional)</label>
                  <textarea value={newMeal.notes} onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 h-16 resize-none text-sm`} placeholder="Ingredients, macros..." />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddMeal} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm">Save</button>
                <button onClick={() => { setShowMealModal(false); setNewMeal({ type: 'breakfast', name: '', calories: '', notes: '' }); }} className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>{editingNoteId ? 'Edit Note' : 'Add Note'}</h2>
              <p className={`text-xs ${textSecondary} mb-3`}>Track changes in diet, exercise, or lifestyle</p>
              
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 h-32 resize-none text-sm mb-4`} placeholder="Started intermittent fasting, new workout routine, stress management..." autoFocus />
              
              <div className="flex space-x-2">
                <button onClick={handleAddNote} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                  {editingNoteId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowNoteModal(false); setNewNote(''); setEditingNoteId(null); }} className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h2 className={`text-xl font-bold ${textPrimary}`}>Health Calculations Disclaimer</h2>
              </div>
              
              <div className={`space-y-3 text-sm ${textPrimary}`}>
                <p className="font-semibold">⚠️ For Educational Purposes Only</p>
                
                <p>This app calculates health metrics including BMI, body fat percentage, muscle mass, bone mass, body water percentage, basal metabolic rate (BMR), and visceral fat levels using standardized formulas and estimations.</p>
                
                <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-400'} border-l-4 p-3 rounded`}>
                  <p className={`font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>Important Limitations:</p>
                  <ul className={`list-disc ml-5 mt-2 space-y-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                    <li>These are estimates based on population averages and may not accurately reflect your individual body composition</li>
                    <li>Results can vary significantly based on factors like hydration, muscle density, bone density, and body structure</li>
                    <li>Professional body composition analysis uses specialized equipment and is much more accurate</li>
                  </ul>
                </div>
                
                <p className="font-semibold">Medical Advice:</p>
                <p>This app is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding:</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  <li>Weight loss or fitness goals</li>
                  <li>Nutrition and dietary changes</li>
                  <li>Exercise programs</li>
                  <li>Health concerns or medical conditions</li>
                </ul>
                
                <p className="font-semibold">Accuracy Note:</p>
                <p>Body fat percentage calculations use skinfold equations (Jackson-Pollock for males, Jackson-Pollock-Ward for females). These provide rough estimates but can have significant margins of error.</p>
                
                <p className="font-semibold">Steps Calorie Calculation:</p>
                <p>Calories burned from steps are estimated using the formula: steps × 0.04 × (weight ÷ 150). This assumes approximately 80-100 calories per 2,000 steps for a 150lb person, adjusted for your current weight. Actual calories burned vary based on walking speed, terrain, fitness level, and individual metabolism.</p>
                
                <p className={`text-xs ${textSecondary} italic mt-4`}>By using this app, you acknowledge that all calculations are approximations for tracking trends over time, not precise medical measurements.</p>
              </div>
              
              <button onClick={() => setShowDisclaimer(false)} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">I Understand</button>
            </div>
          </div>
        </div>
      )}

      {showWeeklyHistory && selectedWeeklyMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${textPrimary}`}>{metrics[selectedWeeklyMetric].label} History</h2>
                <button onClick={() => setShowWeeklyHistory(false)} className={textSecondary + " hover:text-gray-700"}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {weeklyTrends.length === 0 ? (
                  <p className={`text-center ${textSecondary} py-8`}>No weekly data yet. Add more weight entries to see trends!</p>
                ) : (
                  weeklyTrends.slice().reverse().map((week, index) => {
                    const weekNum = weeklyTrends.length - index;
                    const isCurrentWeek = index === 0;
                    return (
                      <div key={index} className={`${isCurrentWeek ? (darkMode ? 'bg-blue-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200') : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')} rounded-lg p-4 border-2`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className={`text-sm font-semibold ${textPrimary}`}>
                              {isCurrentWeek ? '📍 Current Week' : `Week ${weekNum}`}
                            </div>
                            <div className={`text-xs ${textSecondary}`}>{week.weekStart} - {week.weekEnd}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${isCurrentWeek ? 'text-blue-600' : textPrimary}`}>
                              {week[selectedWeeklyMetric]} 
                              <span className={`text-sm font-normal ${textSecondary} ml-1`}>
                                {metrics[selectedWeeklyMetric].unit}
                              </span>
                            </div>
                            {index < weeklyTrends.length - 1 && (
                              <div className="text-xs mt-1">
                                {(() => {
                                  const current = week[selectedWeeklyMetric];
                                  const previous = weeklyTrends[weeklyTrends.length - index - 2][selectedWeeklyMetric];
                                  const diff = current - previous;
                                  if (diff > 0) {
                                    return <span className="text-red-500">▲ +{diff.toFixed(1)}</span>;
                                  } else if (diff < 0) {
                                    return <span className="text-green-500">▼ {diff.toFixed(1)}</span>;
                                  } else {
                                    return <span className={textSecondary}>— No change</span>;
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {weeklyTrends.length > 0 && (
                <div className={`mt-6 pt-4 border-t ${borderColor}`}>
                  <h3 className={`font-semibold ${textPrimary} mb-3 text-sm`}>Overall Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg p-3`}>
                      <div className={`text-xs ${textSecondary}`}>Lowest</div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.min(...weeklyTrends.map(w => w[selectedWeeklyMetric])).toFixed(1)} {metrics[selectedWeeklyMetric].unit}
                      </div>
                    </div>
                    <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-50'} rounded-lg p-3`}>
                      <div className={`text-xs ${textSecondary}`}>Highest</div>
                      <div className="text-lg font-bold text-purple-600">
                        {Math.max(...weeklyTrends.map(w => w[selectedWeeklyMetric])).toFixed(1)} {metrics[selectedWeeklyMetric].unit}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCurrentWeekDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${textPrimary}`}>Current Week Weight Entries</h2>
                <button onClick={() => setShowCurrentWeekDetails(false)} className={textSecondary + " hover:text-gray-700"}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {currentWeekData && currentWeekData.length > 0 ? (
                  <>
                    <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} rounded-lg p-4 border-2 mb-4`}>
                      <div className="text-center">
                        <div className={`text-sm ${textSecondary} mb-1`}>Weekly Average</div>
                        <div className="text-3xl font-bold text-blue-600">{currentWeek.weight} lbs</div>
                        <div className={`text-xs ${textSecondary} mt-1`}>{currentWeekData.length} {currentWeekData.length === 1 ? 'entry' : 'entries'} this week</div>
                      </div>
                    </div>

                    {currentWeekData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index) => (
                      <div key={index} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className={`text-sm font-semibold ${textPrimary}`}>
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className={`text-xs ${textSecondary} mt-1`}>
                              {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric' })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {entry.weight}
                              <span className={`text-sm font-normal ${textSecondary} ml-1`}>lbs</span>
                            </div>
                            {entry.bmi && (
                              <div className={`text-xs ${textSecondary} mt-1`}>
                                BMI: {entry.bmi}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className={`text-center ${textSecondary} py-8`}>No weight entries for this week yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showStepsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${bgCard} rounded-xl shadow-2xl max-w-md w-full`}>
            <div className="p-5">
              <h2 className={`text-xl font-bold ${textPrimary} mb-3`}>{editingStepsId ? 'Edit Steps' : 'Log Steps'}</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Date</label>
                  <input 
                    type="date" 
                    value={newSteps.date} 
                    onChange={(e) => setNewSteps({...newSteps, date: e.target.value})} 
                    className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Step Count</label>
                  <input 
                    type="number" 
                    value={newSteps.count} 
                    onChange={(e) => setNewSteps({...newSteps, count: e.target.value})} 
                    className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 text-sm`}
                    placeholder="10000" 
                    autoFocus 
                  />
                  {newSteps.count && (
                    <div className="mt-1 text-xs text-green-600">
                      ≈ {calculateStepsCalories(parseInt(newSteps.count) || 0)} calories burned
                    </div>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Notes (optional)</label>
                  <textarea 
                    value={newSteps.notes} 
                    onChange={(e) => setNewSteps({...newSteps, notes: e.target.value})} 
                    className={`w-full border ${inputBorder} ${inputBg} ${textPrimary} rounded-lg px-3 py-2 h-16 resize-none text-sm`}
                    placeholder="Morning walk, hiking trip..." 
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddSteps} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                  {editingStepsId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowStepsModal(false); setNewSteps({ date: new Date().toISOString().split('T')[0], count: '', notes: '' }); setEditingStepsId(null); }} className={`flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary} py-2 rounded-lg font-medium hover:bg-opacity-80 transition text-sm`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTrackerApp;
