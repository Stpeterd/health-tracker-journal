import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scale, TrendingUp, TrendingDown, Calendar, Plus, Users, Activity, Download, Upload, FileText, Trash2, Edit2, AlertCircle, Droplets, Dumbbell, Utensils } from 'lucide-react';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerData', JSON.stringify(healthData));
    }
  }, [healthData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerNotes', JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerWater', JSON.stringify(waterIntake));
    }
  }, [waterIntake]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerExercises', JSON.stringify(exercises));
    }
  }, [exercises]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerMeals', JSON.stringify(meals));
    }
  }, [meals]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('healthTrackerSteps', JSON.stringify(steps));
    }
  }, [steps]);

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

  const { currentWeek, previousWeek } = calculateWeeklyAverages();
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
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data');
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
              <h1 className="text-lg md:text-2xl font-bold">Health Tracker Journal</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
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

      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-6 overflow-x-auto">
            {['dashboard', 'steps', 'activity', 'nutrition', 'weekly', 'notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium transition whitespace-nowrap text-sm ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'
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
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Current Measurements</h2>
                <div className="flex space-x-2">
                  {[0, 1].map(i => (
                    <button key={i} onClick={() => setCurrentDashboardCard(i)} className={`w-2 h-2 rounded-full transition ${currentDashboardCard === i ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  ))}
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentDashboardCard * 100}%)` }}>
                  {[metricsGroup1, metricsGroup2].map((group, groupIndex) => (
                    <div key={groupIndex} className={`w-full flex-shrink-0 grid grid-cols-2 gap-3 ${groupIndex === 0 ? 'pr-2' : 'pl-2'}`}>
                      {group.map(([key, { label, unit }]) => {
                        const latestValue = healthData[healthData.length - 1]?.[key] || 0;
                        return (
                          <div key={key} className={`bg-gradient-to-br ${groupIndex === 0 ? 'from-blue-50 to-indigo-50' : 'from-purple-50 to-pink-50'} rounded-lg p-3`}>
                            <div className="text-xs text-gray-600 mb-1">{label}</div>
                            <div className="text-xl font-bold text-gray-800">{latestValue} <span className="text-xs font-normal text-gray-500">{unit}</span></div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-3 text-xs text-gray-500">Tap dots to switch →</div>
            </div>

            {healthData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-gray-800 text-sm">Goal Progress</h3>
                  </div>
                  <div className="text-xs font-medium text-gray-600">
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
                    <div className="text-xs text-gray-500">Current</div>
                    <div className="text-base font-bold text-gray-800">{healthData[healthData.length - 1]?.weight || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Goal</div>
                    <div className="text-base font-bold text-blue-600">{userProfile.targetWeight}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">To Go</div>
                    <div className="text-base font-bold text-green-600">{Math.abs((healthData[healthData.length - 1]?.weight || 0) - userProfile.targetWeight).toFixed(1)}</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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
                
                <div className="text-center mt-2 text-xs font-medium text-gray-600">
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

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">History</h2>
                <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-xs">
                  {Object.entries(metrics).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={healthData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{fontSize: '10px'}} angle={-45} textAnchor="end" height={60} />
                  <YAxis domain={selectedMetric === 'weight' ? [userProfile.targetWeight - 10, 'auto'] : ['auto', 'auto']} style={{fontSize: '11px'}} width={40} />
                  <Tooltip contentStyle={{fontSize: '12px'}} />
                  <Legend wrapperStyle={{fontSize: '12px'}} />
                  <Bar dataKey={selectedMetric} fill="#3b82f6" name={metrics[selectedMetric].label} />
                  {selectedMetric === 'weight' && (
                    <Line type="monotone" dataKey={() => userProfile.targetWeight} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span>Steps Tracker</span>
                </h2>
                <button onClick={() => setShowStepsModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-600">Today's Steps</div>
                    <div className="text-3xl font-bold text-blue-600">{getTodaySteps().toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Calories Burned</div>
                    <div className="text-3xl font-bold text-green-600">{getTodayStepsCalories()}</div>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-gray-600">
                  🎯 Goal: 10,000 steps • {((getTodaySteps() / 10000) * 100).toFixed(0)}% complete
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((getTodaySteps() / 10000) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                {steps.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No steps logged yet</p>
                  </div>
                ) : (
                  steps.map((step) => (
                    <div key={step.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">{step.date} • {step.time}</span>
                          <div className="font-bold text-gray-800 text-sm mt-1">👟 {step.count.toLocaleString()} steps</div>
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
                        <div><span className="text-gray-600">Calories:</span> <span className="font-medium text-green-600">~{step.calories}</span></div>
                      </div>
                      {step.notes && <p className="text-xs text-gray-700 mt-1">{step.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
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
                  <div className="text-center py-8 text-gray-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No exercises logged yet</p>
                  </div>
                ) : (
                  exercises.map((ex) => (
                    <div key={ex.id} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">{ex.date} • {ex.time}</span>
                          <div className="font-bold text-gray-800 text-sm mt-1">{ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}</div>
                        </div>
                        <button onClick={() => handleDeleteExercise(ex.id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-gray-600">Duration:</span> <span className="font-medium">{ex.duration}min</span></div>
                        <div><span className="text-gray-600">Intensity:</span> <span className="font-medium">{ex.intensity}</span></div>
                        {ex.calories && <div><span className="text-gray-600">Calories:</span> <span className="font-medium">{ex.calories}</span></div>}
                      </div>
                      {ex.notes && <p className="text-xs text-gray-700 mt-1">{ex.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-green-500" />
                  <span>Meal Log</span>
                </h2>
                <button onClick={() => setShowMealModal(true)} className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-600">Today's Calories</div>
                  <div className="text-2xl font-bold text-green-600">{getTodayCalories()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {meals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No meals logged yet</p>
                  </div>
                ) : (
                  meals.map((meal) => (
                    <div key={meal.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">{meal.date} • {meal.time}</span>
                          <div className="font-bold text-gray-800 text-sm mt-1">{meal.name}</div>
                        </div>
                        <button onClick={() => handleDeleteMeal(meal.id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <div><span className="text-gray-600">Type:</span> <span className="font-medium">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span></div>
                        <div><span className="text-gray-600">Calories:</span> <span className="font-medium text-green-600">{meal.calories || 0}</span></div>
                      </div>
                      {meal.notes && <p className="text-xs text-gray-700 mt-1">{meal.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>Water Intake</span>
                </h2>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Today's Progress</span>
                  <span className="text-sm font-medium">{getTodayWater().total}oz / {getTodayWater().goal}oz</span>
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min((getTodayWater().total / getTodayWater().goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <button onClick={() => addWater(8)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition text-sm">+8oz</button>
                <button onClick={() => addWater(16)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition text-sm">+16oz</button>
                <button onClick={() => addWater(32)} className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition text-sm">+32oz</button>
              </div>
              
              {getTodayWater().entries.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2 text-sm">Today's Log:</h3>
                  <div className="space-y-1">
                    {getTodayWater().entries.map((entry, index) => (
                      <div key={index} className="flex justify-between text-sm bg-blue-50 rounded px-3 py-2">
                        <span className="text-gray-600">{entry.time}</span>
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
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Weekly Averages</span>
                </h2>
                <div className="flex space-x-2">
                  {[0, 1].map(i => (
                    <button key={i} onClick={() => setCurrentWeeklyCard(i)} className={`w-2 h-2 rounded-full transition ${currentWeeklyCard === i ? 'bg-blue-600' : 'bg-gray-300'}`} />
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
                        return (
                          <button key={key} onClick={() => { setSelectedWeeklyMetric(key); setShowWeeklyHistory(true); }}
                            className={`bg-gradient-to-br ${groupIndex === 0 ? 'from-blue-50 to-indigo-50 border-blue-100' : 'from-purple-50 to-pink-50 border-purple-100'} rounded-lg p-3 border-2 text-left hover:shadow-md transition`}>
                            <div className="text-xs text-gray-600 mb-1">{label}</div>
                            <div className="flex items-baseline justify-between">
                              <div className="text-xl font-bold text-gray-800">{currentWeek[key]} <span className="text-xs font-normal text-gray-500">{unit}</span></div>
                              {TrendIcon && (
                                <div className={`flex items-center space-x-1 ${trend.color}`}>
                                  <TrendIcon className="w-3 h-3" />
                                  <span className="text-xs font-medium">{trend.text}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Last week: {previousWeek[key]} {unit}</div>
                            <div className={`text-xs mt-1 ${groupIndex === 0 ? 'text-blue-600' : 'text-purple-600'}`}>Tap for history →</div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-3 text-xs text-gray-500">Tap dots to switch →</div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Notes</span>
                </h2>
                <button onClick={() => setShowNoteModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition text-sm">
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">Track diet changes, exercises, or lifestyle adjustments 📝</p>

              <div className="space-y-2">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes yet</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500 font-medium">{note.displayDate}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditNote(note)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700 transition" title="Delete">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setShowDisclaimer(true)}
              className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-xl p-3 hover:from-yellow-200 hover:to-orange-200 transition flex items-center justify-center space-x-2"
            >
              <span className="text-xl">⚠️</span>
              <span className="font-semibold text-yellow-800 text-sm">View Calculation Disclaimer</span>
            </button>
          </div>
        )}
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Profile Settings</h2>
              
              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
                    <input type="number" value={userProfile.heightFeet} onChange={(e) => setUserProfile({...userProfile, heightFeet: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (in)</label>
                    <input type="number" value={userProfile.heightInches} onChange={(e) => setUserProfile({...userProfile, heightInches: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={userProfile.age} onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={userProfile.gender} onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (lbs)</label>
                  <input type="number" value={userProfile.targetWeight} onChange={(e) => setUserProfile({...userProfile, targetWeight: parseFloat(e.target.value) || 0})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              
              <button onClick={() => setShowProfile(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {showAddData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Add Weight Entry</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input type="number" step="0.1" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="175.5" autoFocus />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddData} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">Save</button>
                <button onClick={() => { setShowAddData(false); setNewEntry({ date: new Date().toISOString().split('T')[0], weight: '' }); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Log Exercise</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newExercise.type} onChange={(e) => setNewExercise({...newExercise, type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={newExercise.duration} onChange={(e) => setNewExercise({...newExercise, duration: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="30" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                  <select value={newExercise.intensity} onChange={(e) => setNewExercise({...newExercise, intensity: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories (optional)</label>
                  <input type="number" value={newExercise.calories} onChange={(e) => setNewExercise({...newExercise, calories: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="250" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea value={newExercise.notes} onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 resize-none text-sm" placeholder="5K run, leg day..." />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddExercise} className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition text-sm">Save</button>
                <button onClick={() => { setShowExerciseModal(false); setNewExercise({ type: 'cardio', duration: '', intensity: 'medium', calories: '', notes: '' }); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Log Meal</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newMeal.type} onChange={(e) => setNewMeal({...newMeal, type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({...newMeal, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Grilled chicken salad" autoFocus />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input type="number" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea value={newMeal.notes} onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 resize-none text-sm" placeholder="Ingredients, macros..." />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddMeal} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm">Save</button>
                <button onClick={() => { setShowMealModal(false); setNewMeal({ type: 'breakfast', name: '', calories: '', notes: '' }); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{editingNoteId ? 'Edit Note' : 'Add Note'}</h2>
              <p className="text-xs text-gray-600 mb-3">Track changes in diet, exercise, or lifestyle</p>
              
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none text-sm mb-4" placeholder="Started intermittent fasting, new workout routine, stress management..." autoFocus />
              
              <div className="flex space-x-2">
                <button onClick={handleAddNote} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                  {editingNoteId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowNoteModal(false); setNewNote(''); setEditingNoteId(null); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-800">Health Calculations Disclaimer</h2>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-semibold">⚠️ For Educational Purposes Only</p>
                
                <p>This app calculates health metrics including BMI, body fat percentage, muscle mass, bone mass, body water percentage, basal metabolic rate (BMR), and visceral fat levels using standardized formulas and estimations.</p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <p className="font-semibold text-yellow-800">Important Limitations:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-yellow-900">
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
                
                <p className="text-xs text-gray-600 italic mt-4">By using this app, you acknowledge that all calculations are approximations for tracking trends over time, not precise medical measurements.</p>
              </div>
              
              <button onClick={() => setShowDisclaimer(false)} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">I Understand</button>
            </div>
          </div>
        </div>
      )}

      {showWeeklyHistory && selectedWeeklyMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{metrics[selectedWeeklyMetric].label} History</h2>
                <button onClick={() => setShowWeeklyHistory(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {weeklyTrends.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No weekly data yet. Add more weight entries to see trends!</p>
                ) : (
                  weeklyTrends.slice().reverse().map((week, index) => {
                    const weekNum = weeklyTrends.length - index;
                    const isCurrentWeek = index === 0;
                    return (
                      <div key={index} className={`${isCurrentWeek ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200' : 'bg-gray-50 border border-gray-200'} rounded-lg p-4`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {isCurrentWeek ? '📍 Current Week' : `Week ${weekNum}`}
                            </div>
                            <div className="text-xs text-gray-600">{week.weekStart} - {week.weekEnd}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${isCurrentWeek ? 'text-blue-600' : 'text-gray-800'}`}>
                              {week[selectedWeeklyMetric]} 
                              <span className="text-sm font-normal text-gray-500 ml-1">
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
                                    return <span className="text-gray-500">— No change</span>;
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
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Overall Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600">Lowest</div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.min(...weeklyTrends.map(w => w[selectedWeeklyMetric])).toFixed(1)} {metrics[selectedWeeklyMetric].unit}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600">Highest</div>
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

      {showStepsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3">{editingStepsId ? 'Edit Steps' : 'Log Steps'}</h2>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newSteps.date} 
                    onChange={(e) => setNewSteps({...newSteps, date: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Step Count</label>
                  <input 
                    type="number" 
                    value={newSteps.count} 
                    onChange={(e) => setNewSteps({...newSteps, count: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" 
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea 
                    value={newSteps.notes} 
                    onChange={(e) => setNewSteps({...newSteps, notes: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-16 resize-none text-sm" 
                    placeholder="Morning walk, hiking trip..." 
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={handleAddSteps} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                  {editingStepsId ? 'Update' : 'Save'}
                </button>
                <button onClick={() => { setShowStepsModal(false); setNewSteps({ date: new Date().toISOString().split('T')[0], count: '', notes: '' }); setEditingStepsId(null); }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTrackerApp;
