"use client"

import { useState } from "react"

interface HealthTip {
  id: string
  title: string
  content: string
  category: "general" | "nutrition" | "exercise" | "hygiene"
  audioUrl?: string
}

export default function HealthTipsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [nutritionLog, setNutritionLog] = useState<string[]>([])
  const [newFood, setNewFood] = useState("")
  const [activeTab, setActiveTab] = useState<"tips" | "nutrition">("tips")
  const [offlineMode, setOfflineMode] = useState(false)

  const healthTips: HealthTip[] = [
    {
      id: "1",
      title: "Drink Clean Water",
      content: "Always boil water for 10 minutes before drinking. Clean water prevents many diseases.",
      category: "hygiene",
    },
    {
      id: "2",
      title: "Eat Green Vegetables",
      content: "Include spinach, fenugreek, and other green leafy vegetables in your daily diet for iron and vitamins.",
      category: "nutrition",
    },
    {
      id: "3",
      title: "Wash Hands Frequently",
      content: "Wash hands with soap for 20 seconds before eating and after using the toilet.",
      category: "hygiene",
    },
    {
      id: "4",
      title: "Daily Exercise",
      content: "Walk for 30 minutes daily. It helps control blood pressure and diabetes.",
      category: "exercise",
    },
  ]

  const translations = {
    en: {
      title: "Health Tips & Nutrition",
      healthTips: "Health Tips",
      nutritionTracker: "Nutrition Tracker",
      allCategories: "All Categories",
      general: "General",
      nutrition: "Nutrition",
      exercise: "Exercise",
      hygiene: "Hygiene",
      logFood: "Log Food Item",
      addFood: "Add Food",
      todaysMeals: "Today's Meals",
      shareWithCHW: "Share with CHW",
      backHome: "Back to Home",
      foodPlaceholder: "Enter food item (e.g., Rice, Dal)",
      mealsLogged: "meals logged today",
      offlineNotice: "You're offline. Data will sync when online.",
      saveOffline: "Save Offline",
      playAudio: "Play Audio",
      voiceInput: "Voice Input",
    },
    hi: {
      title: "स्वास्थ्य सुझाव और पोषण",
      healthTips: "स्वास्थ्य सुझाव",
      nutritionTracker: "पोषण ट्रैकर",
      allCategories: "सभी श्रेणियां",
      general: "सामान्य",
      nutrition: "पोषण",
      exercise: "व्यायाम",
      hygiene: "स्वच्छता",
      logFood: "भोजन लॉग करें",
      addFood: "भोजन जोड़ें",
      todaysMeals: "आज का भोजन",
      shareWithCHW: "CHW के साथ साझा करें",
      backHome: "घर वापस",
      foodPlaceholder: "भोजन आइटम दर्ज करें (जैसे चावल, दाल)",
      mealsLogged: "आज भोजन लॉग किया गया",
      offlineNotice: "आप ऑफ़लाइन हैं। ऑनलाइन होने पर डेटा सिंक होगा।",
      saveOffline: "ऑफ़लाइन सेव करें",
      playAudio: "ऑडियो चलाएं",
      voiceInput: "आवाज़ इनपुट",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations]

  const handleAddFood = () => {
    if (newFood.trim()) {
      setNutritionLog([...nutritionLog, newFood.trim()])
      setNewFood("")
      if (offlineMode) {
        localStorage.setItem("nutritionLog", JSON.stringify([...nutritionLog, newFood.trim()]))
      }
    }
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      recognition.onresult = (event: any) => {
        setNewFood(event.results[0][0].transcript)
      }
      recognition.start()
    }
  }

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const filteredTips =
    selectedCategory === "all" ? healthTips : healthTips.filter((tip) => tip.category === selectedCategory)

  const shareWithCHW = () => {
    const data = {
      nutritionLog,
      date: new Date().toISOString().split("T")[0],
    }
    if (offlineMode) {
      localStorage.setItem("pendingCHWShare", JSON.stringify(data))
      alert(t.offlineNotice)
    } else {
      // Simulate sharing with CHW
      alert("Nutrition data shared with Community Health Worker")
    }
  }

  return (
    <div className="health-tips-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">{t.title}</h1>
          <div className="language-selector">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </header>

      {offlineMode && (
        <div className="offline-banner">
          <span className="offline-icon">📱</span>
          {t.offlineNotice}
        </div>
      )}

      <main className="main-content">
        <div className="tab-navigation">
          <button className={`tab-button ${activeTab === "tips" ? "active" : ""}`} onClick={() => setActiveTab("tips")}>
            {t.healthTips}
          </button>
          <button
            className={`tab-button ${activeTab === "nutrition" ? "active" : ""}`}
            onClick={() => setActiveTab("nutrition")}
          >
            {t.nutritionTracker}
          </button>
        </div>

        {activeTab === "tips" && (
          <div className="tips-section">
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-dropdown"
              >
                <option value="all">{t.allCategories}</option>
                <option value="general">{t.general}</option>
                <option value="nutrition">{t.nutrition}</option>
                <option value="exercise">{t.exercise}</option>
                <option value="hygiene">{t.hygiene}</option>
              </select>
            </div>

            <div className="tips-grid">
              {filteredTips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-header">
                    <h3 className="tip-title">{tip.title}</h3>
                    <button className="audio-button" onClick={() => playAudio(tip.content)} title={t.playAudio}>
                      🔊
                    </button>
                  </div>
                  <p className="tip-content">{tip.content}</p>
                  <span className={`tip-category ${tip.category}`}>{t[tip.category as keyof typeof t]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="nutrition-section">
            <div className="nutrition-input">
              <h3>{t.logFood}</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  placeholder={t.foodPlaceholder}
                  className="food-input"
                />
                <button className="voice-button" onClick={handleVoiceInput} title={t.voiceInput}>
                  🎤
                </button>
              </div>
              <button className="add-food-button" onClick={handleAddFood}>
                {t.addFood}
              </button>
            </div>

            <div className="nutrition-log">
              <h3>{t.todaysMeals}</h3>
              <p className="meals-count">
                {nutritionLog.length} {t.mealsLogged}
              </p>
              <div className="meals-list">
                {nutritionLog.map((food, index) => (
                  <div key={index} className="meal-item">
                    <span className="meal-icon">🍽️</span>
                    <span className="meal-name">{food}</span>
                    <span className="meal-time">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>

              {nutritionLog.length > 0 && (
                <button className="share-button" onClick={shareWithCHW}>
                  {t.shareWithCHW}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="navigation-footer">
          <button className="back-button" onClick={() => (window.location.href = "/")}>
            ← {t.backHome}
          </button>
        </div>
      </main>
    </div>
  )
}
