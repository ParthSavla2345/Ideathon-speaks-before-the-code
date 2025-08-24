"use client"

import { useState } from "react"
import Link from "next/link"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: "hospital" | "chw" | "ambulance" | "police"
  available24h: boolean
  distance: string
}

export default function EmergencyPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [emergencyType, setEmergencyType] = useState("")

  const emergencyContacts: EmergencyContact[] = [
    {
      id: "1",
      name: "District Hospital",
      phone: "108",
      type: "hospital",
      available24h: true,
      distance: "5 km",
    },
    {
      id: "2",
      name: "Local CHW - Priya Sharma",
      phone: "+91-9876543210",
      type: "chw",
      available24h: false,
      distance: "1 km",
    },
    {
      id: "3",
      name: "Ambulance Service",
      phone: "102",
      type: "ambulance",
      available24h: true,
      distance: "3 km",
    },
    {
      id: "4",
      name: "Police Station",
      phone: "100",
      type: "police",
      available24h: true,
      distance: "2 km",
    },
  ]

  const emergencyTypes = [
    "Heart Attack",
    "Breathing Problems",
    "Severe Injury",
    "High Fever",
    "Pregnancy Emergency",
    "Poisoning",
    "Mental Health Crisis",
  ]

  const translations = {
    en: {
      title: "Emergency Help",
      selectEmergency: "Select Emergency Type",
      emergencyContacts: "Emergency Contacts",
      callNow: "Call Now",
      available24h: "24/7 Available",
      distance: "Distance",
      firstAid: "First Aid Instructions",
      backHome: "Back to Home",
      heartAttack: "Heart Attack: Call 108 immediately. Keep patient calm and sitting.",
      breathing: "Breathing Problems: Sit upright, loosen tight clothes, call for help.",
      injury: "Severe Injury: Do not move patient. Apply pressure to bleeding wounds.",
      fever: "High Fever: Give paracetamol, use cold compress, seek medical help.",
      pregnancy: "Pregnancy Emergency: Call 108, keep mother calm, prepare for delivery.",
      poisoning: "Poisoning: Do not induce vomiting. Call poison control immediately.",
      mentalHealth: "Mental Health: Stay calm, remove harmful objects, call for support.",
    },
    hi: {
      title: "आपातकालीन सहायता",
      selectEmergency: "आपातकाल का प्रकार चुनें",
      emergencyContacts: "आपातकालीन संपर्क",
      callNow: "अभी कॉल करें",
      available24h: "24/7 उपलब्ध",
      distance: "दूरी",
      firstAid: "प्राथमिक चिकित्सा निर्देश",
      backHome: "होम पर वापस",
      heartAttack: "दिल का दौरा: तुरंत 108 पर कॉल करें। मरीज़ को शांत और बैठाकर रखें।",
      breathing: "सांस की समस्या: सीधे बैठें, तंग कपड़े ढीले करें, मदद के लिए कॉल करें।",
      injury: "गंभीर चोट: मरीज़ को न हिलाएं। खून बहने वाले घावों पर दबाव डालें।",
      fever: "तेज़ बुखार: पैरासिटामोल दें, ठंडी पट्टी करें, डॉक्टर से मिलें।",
      pregnancy: "गर्भावस्था आपातकाल: 108 पर कॉल करें, माँ को शांत रखें।",
      poisoning: "ज़हर: उल्टी न कराएं। तुरंत ज़हर नियंत्रण को कॉल करें।",
      mentalHealth: "मानसिक स्वास्थ्य: शांत रहें, हानिकारक वस्तुएं हटाएं।",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const playVoice = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const getFirstAidInstruction = (type: string) => {
    const instructions: { [key: string]: string } = {
      "Heart Attack": t.heartAttack,
      "Breathing Problems": t.breathing,
      "Severe Injury": t.injury,
      "High Fever": t.fever,
      "Pregnancy Emergency": t.pregnancy,
      Poisoning: t.poisoning,
      "Mental Health Crisis": t.mentalHealth,
    }
    return instructions[type] || ""
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return "🏥"
      case "chw":
        return "👩‍⚕️"
      case "ambulance":
        return "🚑"
      case "police":
        return "👮"
      default:
        return "📞"
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="header" style={{ backgroundColor: "#dc3545" }}>
        <div className="container">
          <h1>{t.title}</h1>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: "12px" }}>
            {t.backHome}
          </Link>
        </div>
      </header>

      <main className="container" style={{ padding: "32px 16px" }}>
        {/* Emergency Type Selection */}
        <div className="card">
          <div className="card-header">
            <h2>{t.selectEmergency}</h2>
          </div>

          <div className="form-group">
            <select className="form-select" value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)}>
              <option value="">Select emergency type...</option>
              {emergencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {emergencyType && (
            <div className="alert alert-danger">
              <strong>First Aid:</strong> {getFirstAidInstruction(emergencyType)}
              <button
                className="voice-btn"
                onClick={() => playVoice(getFirstAidInstruction(emergencyType))}
                style={{ marginLeft: "12px" }}
              >
                🔊
              </button>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="card">
          <div className="card-header">
            <h2>{t.emergencyContacts}</h2>
          </div>

          <div>
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  padding: "20px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  border: "2px solid #dee2e6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{getContactIcon(contact.type)}</span>
                    <div>
                      <h3 style={{ marginBottom: "4px" }}>{contact.name}</h3>
                      <p style={{ color: "#666", marginBottom: "0" }}>{contact.phone}</p>
                    </div>
                  </div>
                  <button className="btn btn-danger" onClick={() => makeCall(contact.phone)}>
                    {t.callNow}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span className="status-indicator status-pending">
                    {t.distance}: {contact.distance}
                  </span>
                  {contact.available24h && <span className="status-indicator status-online">{t.available24h}</span>}
                  <button
                    className="voice-btn"
                    onClick={() => playVoice(`${contact.name}, ${contact.phone}, ${contact.distance} away`)}
                  >
                    🔊
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Call Buttons */}
        <div className="button-grid">
          <button className="btn btn-danger btn-large" onClick={() => makeCall("108")}>
            🚑 Call Ambulance (108)
          </button>
          <button className="btn btn-danger btn-large" onClick={() => makeCall("100")}>
            👮 Call Police (100)
          </button>
          <button className="btn btn-danger btn-large" onClick={() => makeCall("101")}>
            🚒 Call Fire (101)
          </button>
        </div>
      </main>
    </div>
  )
}
