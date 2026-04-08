import { useState, useEffect } from 'react'
import './App.css'
import { fetchPrayerTimes, fetchAnnouncements, fetchSiteSettings } from './services/firebaseService'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [prayerTimes, setPrayerTimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [announcements, setAnnouncements] = useState([
    {
      id: 'default-1',
      title: 'Ramadan Schedule',
      message: 'Ramadan prayer schedule will be announced soon. Stay tuned for updates.'
    },
    {
      id: 'default-2',
      title: 'Join Our WhatsApp Group',
      message: 'Stay updated with the latest news, events, and announcements. Join our WhatsApp group for real-time updates.'
    }
  ])
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: 'Welcome to Al-Rahma Islamic Centre',
    heroSubtitle: 'A place of worship, unity, and community service',
    heroImageUrl: '/q2.jpg',
    prayerImageUrl: '/timing1.jpg',
    footerImageUrl: '/q1.webp'
  })

  // Hadith collection - 39 hadiths
  const hadiths = [
    {
      title: "Intention",
      text: "Actions are judged by intentions, and every person will get what he intended.",
      reference: "Sahih al-Bukhari 1, Sahih Muslim 1907"
    },
    {
      title: "Good Character",
      text: "The best among you are those who have the best manners and character.",
      reference: "Sahih al-Bukhari 3559"
    },
    {
      title: "Kind Speech",
      text: "A good word is charity.",
      reference: "Sahih al-Bukhari 2989, Sahih Muslim 1009"
    },
    {
      title: "Cleanliness",
      text: "Cleanliness is half of faith.",
      reference: "Sahih Muslim 223"
    },
    {
      title: "Ease in Religion",
      text: "Make things easy and do not make them difficult. Give glad tidings and do not repel people.",
      reference: "Sahih al-Bukhari 69, Sahih Muslim 1734"
    },
    {
      title: "Anger Control",
      text: "The strong person is not the one who overpowers others, but the one who controls himself when angry.",
      reference: "Sahih al-Bukhari 6114, Sahih Muslim 2609"
    },
    {
      title: "Silence",
      text: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
      reference: "Sahih al-Bukhari 6018, Sahih Muslim 47"
    },
    {
      title: "Smiling",
      text: "Smiling at your brother is charity.",
      reference: "Jami' at-Tirmidhi 1956 (Hasan)"
    },
    {
      title: "Mercy",
      text: "Those who show mercy will be shown mercy by the Most Merciful.",
      reference: "Jami' at-Tirmidhi 1924"
    },
    {
      title: "Knowledge",
      text: "Seeking knowledge is an obligation upon every Muslim.",
      reference: "Sunan Ibn Majah 224 (Hasan)"
    },
    {
      title: "Neighbor",
      text: "He is not a believer whose neighbor is not safe from his harm.",
      reference: "Sahih Muslim 46"
    },
    {
      title: "Consistency",
      text: "The most beloved deeds to Allah are those done consistently, even if small.",
      reference: "Sahih al-Bukhari 6464, Sahih Muslim 783"
    },
    {
      title: "Charity",
      text: "Charity does not decrease wealth.",
      reference: "Sahih Muslim 2588"
    },
    {
      title: "Forgiveness",
      text: "Whoever forgives, Allah increases him in honor.",
      reference: "Sahih Muslim 2588"
    },
    {
      title: "Prayer",
      text: "The best deed is prayer offered at its proper time.",
      reference: "Sahih al-Bukhari 527, Sahih Muslim 85"
    },
    {
      title: "Modesty",
      text: "Modesty is part of faith.",
      reference: "Sahih al-Bukhari 9, Sahih Muslim 36"
    },
    {
      title: "Helping Others",
      text: "Allah helps His servant as long as the servant helps his brother.",
      reference: "Sahih Muslim 2699"
    },
    {
      title: "Repentance",
      text: "Allah is more pleased with the repentance of His servant than one who finds his lost camel.",
      reference: "Sahih Muslim 2747"
    },
    {
      title: "Removing Harm",
      text: "Removing something harmful from the road is charity.",
      reference: "Sahih al-Bukhari 2989"
    },
    {
      title: "Trust",
      text: "When trust is lost, then await the Hour.",
      reference: "Sahih al-Bukhari 6496"
    },
    {
      title: "Truthfulness",
      text: "Truthfulness leads to righteousness, and righteousness leads to Paradise.",
      reference: "Sahih al-Bukhari 6094, Sahih Muslim 2607"
    },
    {
      title: "Love for Others",
      text: "None of you truly believes until he loves for his brother what he loves for himself.",
      reference: "Sahih al-Bukhari 13, Sahih Muslim 45"
    },
    {
      title: "Parents",
      text: "Paradise lies under the feet of mothers.",
      reference: "Sunan an-Nasa'i 3104 (Hasan)"
    },
    {
      title: "Dua",
      text: "Supplication is worship.",
      reference: "Jami' at-Tirmidhi 2969"
    },
    {
      title: "Night Prayer",
      text: "The best prayer after the obligatory prayers is the night prayer.",
      reference: "Sahih Muslim 1163"
    },
    {
      title: "Patience",
      text: "Patience is light.",
      reference: "Sahih Muslim 223"
    },
    {
      title: "Worldly Life",
      text: "The world is a prison for the believer and a paradise for the disbeliever.",
      reference: "Sahih Muslim 2956"
    },
    {
      title: "Halal Earning",
      text: "Allah is pure and accepts only what is pure.",
      reference: "Sahih Muslim 1015"
    },
    {
      title: "Humility",
      text: "Whoever humbles himself for Allah, Allah raises him.",
      reference: "Sahih Muslim 2588"
    },
    {
      title: "Gratitude",
      text: "He who does not thank people has not thanked Allah.",
      reference: "Jami' at-Tirmidhi 1954"
    },
    {
      title: "Brotherhood",
      text: "A Muslim is the brother of a Muslim.",
      reference: "Sahih al-Bukhari 2442"
    },
    {
      title: "Justice",
      text: "The just will be on pulpits of light on the Day of Judgment.",
      reference: "Sahih Muslim 1827"
    },
    {
      title: "Time",
      text: "There are two blessings many people waste: health and free time.",
      reference: "Sahih al-Bukhari 6412"
    },
    {
      title: "Mercy to Children",
      text: "He who does not show mercy to children is not one of us.",
      reference: "Sahih al-Bukhari 5997"
    },
    {
      title: "Anger",
      text: "Do not become angry.",
      reference: "Sahih al-Bukhari 6116"
    },
    {
      title: "Excellence",
      text: "Allah loves that when one of you does something, he does it with excellence.",
      reference: "Al-Bayhaqi (Hasan)"
    },
    {
      title: "Remembrance",
      text: "Keep your tongue moist with the remembrance of Allah.",
      reference: "Jami' at-Tirmidhi 3375"
    },
    {
      title: "Feeding Others",
      text: "Feed the hungry and visit the sick.",
      reference: "Sahih al-Bukhari 5376"
    },
    {
      title: "Trust in Allah",
      text: "If you rely upon Allah truly, He will provide for you.",
      reference: "Jami' at-Tirmidhi 2344"
    }
  ]

  // Get hadith of the day based on date
  const getHadithOfTheDay = () => {
    const today = new Date()
    // Calculate days since epoch and mod by number of hadiths to cycle through them
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
    const hadithIndex = daysSinceEpoch % hadiths.length
    return hadiths[hadithIndex]
  }

  const hadithOfTheDay = getHadithOfTheDay()

  // Fetch editable site settings and announcements
  useEffect(() => {
    const loadSiteContent = async () => {
      const [settingsData, announcementsData] = await Promise.all([
        fetchSiteSettings(),
        fetchAnnouncements()
      ])

      if (settingsData) {
        setSiteSettings((prev) => ({ ...prev, ...settingsData }))
      }

      if (announcementsData && typeof announcementsData === 'object') {
        const mappedAnnouncements = Object.entries(announcementsData)
          .filter(([, value]) => value && typeof value === 'object' && value.message)
          .map(([id, value]) => ({
            id,
            title: value.title || 'Announcement',
            message: value.message,
            timestamp: value.timestamp || ''
          }))
          .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))

        if (mappedAnnouncements.length > 0) {
          setAnnouncements(mappedAnnouncements)
        }
      }
    }

    loadSiteContent()
  }, [])

  // Fetch prayer times from Firebase or API
  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setLoading(true)
        
        // First, try to fetch from Firebase
        const firebaseData = await fetchPrayerTimes()
        
        if (firebaseData) {
          // If Firebase has data, use it
          const prayers = []
          Object.keys(firebaseData).forEach(key => {
            const prayer = firebaseData[key]
            if (prayer.time) {
              prayers.push({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                time: prayer.time,
                hour: prayer.hour || 0,
                minute: prayer.minute || 0
              })
            }
          })
          
          if (prayers.length > 0) {
            setPrayerTimes(prayers)
            setError(null)
            setLoading(false)
            return
          }
        }
        
        // Fallback: Fetch from public API
        const latitude = 53.7765
        const longitude = -1.7623
        const method = 2 // ISNA method
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`
        )
        const data = await response.json()
        
        if (data.code === 200 && data.data) {
          const timings = data.data.timings
          
          // Convert 24-hour format to 12-hour format with AM/PM
          const formatTime = (time24) => {
            const [hours, minutes] = time24.split(':')
            const hour = parseInt(hours)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const hour12 = hour % 12 || 12
            return `${hour12}:${minutes} ${ampm}`
          }

          const prayers = [
            { name: 'Fajr', time: formatTime(timings.Fajr), hour: parseInt(timings.Fajr.split(':')[0]), minute: parseInt(timings.Fajr.split(':')[1]) },
            { name: 'Dhuhr', time: formatTime(timings.Dhuhr), hour: parseInt(timings.Dhuhr.split(':')[0]), minute: parseInt(timings.Dhuhr.split(':')[1]) },
            { name: 'Asr', time: formatTime(timings.Asr), hour: parseInt(timings.Asr.split(':')[0]), minute: parseInt(timings.Asr.split(':')[1]) },
            { name: 'Maghrib', time: formatTime(timings.Maghrib), hour: parseInt(timings.Maghrib.split(':')[0]), minute: parseInt(timings.Maghrib.split(':')[1]) },
            { name: 'Isha', time: formatTime(timings.Isha), hour: parseInt(timings.Isha.split(':')[0]), minute: parseInt(timings.Isha.split(':')[1]) }
          ]

          setPrayerTimes(prayers)
          setError(null)
        } else {
          throw new Error('Failed to fetch prayer times')
        }
      } catch (err) {
        console.error('Error fetching prayer times:', err)
        setError('Unable to load prayer times. Showing default times.')
        // Fallback prayer times
        setPrayerTimes([
          { name: 'Fajr', time: '5:37 AM', hour: 5, minute: 37 },
          { name: 'Dhuhr', time: '12:30 PM', hour: 12, minute: 30 },
          { name: 'Asr', time: '3:32 PM', hour: 15, minute: 32 },
          { name: 'Maghrib', time: '6:17 PM', hour: 18, minute: 17 },
          { name: 'Isha', time: '7:45 PM', hour: 19, minute: 45 }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadPrayerTimes()
    
    // Refresh prayer times daily at midnight
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeUntilMidnight = tomorrow - now
    
    let dailyInterval

    const midnightTimer = setTimeout(() => {
      loadPrayerTimes()
      dailyInterval = setInterval(loadPrayerTimes, 24 * 60 * 60 * 1000)
    }, timeUntilMidnight)

    return () => {
      clearTimeout(midnightTimer)
      if (dailyInterval) clearInterval(dailyInterval)
    }
  }, [])

  // Get next prayer
  const getNextPrayer = () => {
    if (prayerTimes.length === 0) return null

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    for (let prayer of prayerTimes) {
      const prayerTimeInMinutes = prayer.hour * 60 + prayer.minute
      if (prayerTimeInMinutes > currentTimeInMinutes) {
        return prayer.name
      }
    }
    return prayerTimes[0]?.name || null // Default to Fajr if all prayers passed
  }

  const nextPrayer = getNextPrayer()

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? '' : 'bg-neutral-50'}`}
      style={darkMode ? { background: 'linear-gradient(135deg, #bbf7d0 0%, #fde68a 50%, #86efac 100%)' } : undefined}
    >
      
      {/* Shahada Banner */}
      <div
        className="text-white py-6 shadow-lg"
        style={{ background: 'linear-gradient(90deg, #15803d 0%, #166534 50%, #15803d 100%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-3xl md:text-4xl lg:text-5xl font-semibold" style={{ fontFamily: 'Traditional Arabic, Arial', letterSpacing: '0.05em' }}>
              لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَّسُولُ ٱللَّٰهِ
            </p>
            <p className="text-sm md:text-base mt-3 text-primary-100 font-medium">
              There is no god but Allah, Muhammad is the Messenger of Allah
            </p>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header
        className="border-b border-primary-300 shadow-md sticky top-0 z-50"
        style={{
          backgroundColor: '#dcfce7',
          opacity: 1,
          backdropFilter: 'none'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/Al-Rahma Islamic Centre.jpeg"
                alt="Al-Rahma Islamic Centre Logo"
                className="w-12 h-12 rounded-lg object-cover border border-primary-200"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
                  Al-Rahma Islamic Centre
                </h1>
                <p className="text-xs text-neutral-500 hidden sm:block">Bradford, West Yorkshire</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </a>
              <a href="#prayers" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                Prayer Times
              </a>
              <a href="#donate" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                Donate
              </a>
              <a href="#contact" className="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
                Contact
              </a>
              <a
                href="https://maps.app.goo.gl/j6UmkD8GZNshgGG88?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
              >
                Location
              </a>
            </nav>

            {/* CTA Button */}
            <a 
              href="#donate"
              className="bg-accent-500 hover:bg-accent-600 text-neutral-900 px-6 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            >
              Donate Now
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow">
        
        {/* Hero Section with Background Image */}
        <section
          id="home"
          className="relative h-150 overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #14532d 0%, #166534 100%)' }}
        >
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-40" style={{ backgroundColor: '#14532d' }}></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: `url('${siteSettings.heroImageUrl || '/q2.jpg'}')`,
              opacity: 0.5
            }}
          ></div>
          
          {/* Hadith Ticker */}
          <div className="absolute top-0 left-0 right-0 bg-accent-500 py-3 overflow-hidden z-10">
            <div className="ticker-wrapper">
              <div className="ticker-content">
                <div className="ticker-item flex items-center gap-4 text-white">
                  <span className="font-semibold">{hadithOfTheDay.title}:</span>
                  <span className="italic">"{hadithOfTheDay.text}"</span>
                  <span className="text-sm opacity-90">- {hadithOfTheDay.reference}</span>
                  <span className="mx-8">•</span>
                </div>
                <div className="ticker-item flex items-center gap-4 text-white">
                  <span className="font-semibold">{hadithOfTheDay.title}:</span>
                  <span className="italic">"{hadithOfTheDay.text}"</span>
                  <span className="text-sm opacity-90">- {hadithOfTheDay.reference}</span>
                  <span className="mx-8">•</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {siteSettings.heroTitle}
              </h2>
              <p className="text-xl sm:text-2xl text-white mb-8 font-light">
                {siteSettings.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#prayers"
                  className="bg-white text-primary-700 hover:bg-neutral-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  View Prayer Times
                </a>
                <a 
                  href="#donate"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Support Our Mosque
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Islamic Phrases Section */}
        <section className="py-16 bg-linear-to-br from-primary-200 to-accent-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
                Daily Remembrance (Dhikr)
              </h2>
              <p className="text-lg text-neutral-600">
                Keep your tongue moist with the remembrance of Allah
              </p>
            </div>

            <div className="max-w-6xl mx-auto overflow-x-auto">
              <table className="w-full bg-accent-50 shadow-lg rounded-xl overflow-hidden">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Arabic Phrase</th>
                    <th className="px-4 py-4 text-left font-semibold">Transliteration</th>
                    <th className="px-4 py-4 text-left font-semibold">Meaning</th>
                    <th className="px-4 py-4 text-left font-semibold">Virtue / Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">سُبْحَانَ الله</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">SubhanAllah</td>
                    <td className="px-4 py-4 text-neutral-700">Glory be to Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Praising Allah's perfection</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">الْحَمْدُ لِلَّهِ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Alhamdulillah</td>
                    <td className="px-4 py-4 text-neutral-700">All praise is due to Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Gratitude and contentment</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">اللهُ أَكْبَرُ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Allahu Akbar</td>
                    <td className="px-4 py-4 text-neutral-700">Allah is the Greatest</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Affirming Allah's greatness</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">لَا إِلٰهَ إِلَّا اللهُ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">La ilaha illallah</td>
                    <td className="px-4 py-4 text-neutral-700">There is no god but Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Core of Islamic belief</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">أَسْتَغْفِرُ اللهَ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Astaghfirullah</td>
                    <td className="px-4 py-4 text-neutral-700">I seek forgiveness from Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Repentance and purification</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">سُبْحَانَ اللهِ وَبِحَمْدِهِ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">SubhanAllahi wa bihamdihi</td>
                    <td className="px-4 py-4 text-neutral-700">Glory and praise be to Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Light on tongue, heavy on scales</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">La hawla wa la quwwata illa billah</td>
                    <td className="px-4 py-4 text-neutral-700">No power or strength except with Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Relief in hardship and surrender</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">حَسْبِيَ اللهُ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Hasbiyallahu</td>
                    <td className="px-4 py-4 text-neutral-700">Allah is sufficient for me</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Trust in Allah during trials</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">يَا اللهُ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Ya Allah</td>
                    <td className="px-4 py-4 text-neutral-700">O Allah</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Calling upon Allah</td>
                  </tr>
                  <tr className="hover:bg-primary-50 transition-colors">
                    <td className="px-4 py-4 text-xl font-arabic text-primary-700">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ</td>
                    <td className="px-4 py-4 font-medium text-neutral-800">Allahumma salli 'ala Muhammad</td>
                    <td className="px-4 py-4 text-neutral-700">O Allah, send blessings on Muhammad</td>
                    <td className="px-4 py-4 text-neutral-600 text-sm">Love and reverence for the Prophet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Prayer Times Section */}
        <section id="prayers" className="scroll-mt-32 py-16 bg-linear-to-br from-accent-100 to-primary-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
                Daily Prayer Times
              </h2>
              <p className="text-neutral-600">
                {loading ? 'Loading prayer times...' : `Updated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {nextPrayer && !loading && (
                <p className="text-neutral-900 font-bold mt-2 text-lg">
                  Next Prayer: {nextPrayer}
                </p>
              )}
            </div>

            {/* Timing Image */}
            <div className="flex justify-center">
              <img 
                src={siteSettings.prayerImageUrl || '/timing1.jpg'} 
                alt="Prayer Times Schedule" 
                className="w-full max-w-4xl rounded-xl shadow-2xl border-2 border-primary-200"
              />
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section id="donate" className="scroll-mt-32 py-16 bg-linear-to-br from-primary-200 to-accent-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="bg-accent-50 rounded-xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Bank Transfer Details</h3>
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="font-semibold text-neutral-700">Account Name:</span>
                    <span className="text-neutral-900 font-medium">Wibsey Islamic Society</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="font-semibold text-neutral-700">Bank:</span>
                    <span className="text-neutral-900 font-medium">Metro Bank</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="font-semibold text-neutral-700">Sort Code:</span>
                    <span className="text-neutral-900 font-medium">23-05-80</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                    <span className="font-semibold text-neutral-700">Account Number:</span>
                    <span className="text-neutral-900 font-medium">56594147</span>
                  </div>
                </div>
                <p className="text-sm text-primary-700 font-semibold mt-6 pt-6 border-t border-neutral-200">
                  Please support Al-Rahma Islamic Centre by making monthly Standing Order payments
                </p>
                <p className="text-sm text-neutral-600 italic mt-4">
                  "The believer's shade on the Day of Resurrection will be his charity" - Tirmidhi
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-16 bg-linear-to-br from-primary-200 to-accent-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-8 text-center">
              Latest Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-accent-50 p-6 rounded-lg border-l-4 hover:shadow-md transition-shadow ${
                    index % 2 === 0 ? 'border-primary-600' : 'border-accent-500'
                  }`}
                >
                  <h4 className="font-semibold text-lg text-neutral-800 mb-2">{item.title}</h4>
                  <p className="text-neutral-600">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="scroll-mt-32 py-16 bg-linear-to-br from-primary-200 to-accent-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
                Contact Us
              </h2>
              <p className="text-lg text-neutral-600">
                Get in touch with us for any questions or inquiries
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-primary-50 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Get In Touch</h3>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">Address</h4>
                      <p className="text-neutral-600">75 Odsal Road, Wibsey</p>
                      <p className="text-neutral-600">Bradford BD6 1PN</p>
                      <p className="text-neutral-600">United Kingdom</p>
                      <a
                        href="https://maps.app.goo.gl/j6UmkD8GZNshgGG88?g_st=iw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-primary-700 hover:text-primary-800 font-semibold underline"
                      >
                        Open Mosque Location in Google Maps
                      </a>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">Phone</h4>
                      <p className="text-neutral-600 mb-1">
                        <span className="font-medium">Zaheer:</span> 07539 836 366
                      </p>
                      <p className="text-neutral-600">
                        <span className="font-medium">Rifaqat:</span> 07813 100 885
                      </p>
                    </div>
                  </div>

                  {/* Prayer Times */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-800 mb-1">Opening Hours</h4>
                      <p className="text-neutral-600">Open for all 5 daily prayers</p>
                      <p className="text-neutral-600">Jummah: Check timetable for details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map or Additional Info */}
              <div className="bg-accent-50 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Visit Us</h3>
                
                <div className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed">
                    Al-Rahma Islamic Centre welcomes everyone to join us for daily prayers, Islamic education, and community events. 
                    We are located in the heart of Wibsey, Bradford.
                  </p>
                  
                  <div className="bg-primary-50 rounded-lg p-6 border-l-4 border-primary-600">
                    <h4 className="font-semibold text-neutral-800 mb-2">Facilities</h4>
                    <ul className="space-y-2 text-neutral-600">
                      <li className="flex items-center gap-2">
                        <span className="text-primary-600">•</span> Separate prayer areas
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-600">•</span> Wudu facilities
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-600">•</span> Islamic library
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-primary-600">•</span> Community hall
                      </li>
                    </ul>
                  </div>

                  <div className="bg-accent-50 rounded-lg p-6 border-l-4 border-accent-500">
                    <h4 className="font-semibold text-neutral-800 mb-2">Services</h4>
                    <ul className="space-y-2 text-neutral-600">
                      <li className="flex items-center gap-2">
                        <span className="text-accent-600">•</span> 5 Daily prayers
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-600">•</span> Jummah prayers
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-600">•</span> Quran classes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-600">•</span> Islamic education
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four Quls Section */}
        <section className="py-20 bg-linear-to-br from-primary-200 to-accent-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-800 mb-4">
                The Four Quls
              </h2>
              <p className="text-xl text-neutral-600">
                Four Protective Surahs from the Holy Quran
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Surah Al-Kafirun */}
              <div className="bg-primary-50 rounded-xl shadow-lg border-2 border-primary-200 p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-primary-700 mb-6 text-center">
                  Surah Al-Kafirun
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6">(The Disbelievers)</p>
                <div className="text-right leading-loose" style={{ fontFamily: 'Traditional Arabic, Arial', fontSize: '1.5rem', lineHeight: '2.5rem' }}>
                  <p className="mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  <p className="mb-3">قُلْ يَا أَيُّهَا الْكَافِرُونَ</p>
                  <p className="mb-3">لَا أَعْبُدُ مَا تَعْبُدُونَ</p>
                  <p className="mb-3">وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ</p>
                  <p className="mb-3">وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ</p>
                  <p className="mb-3">وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ</p>
                  <p>لَكُمْ دِينُكُمْ وَلِيَ دِينِ</p>
                </div>
              </div>

              {/* Surah Al-Ikhlas */}
              <div className="bg-accent-50 rounded-xl shadow-lg border-2 border-accent-200 p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-accent-700 mb-6 text-center">
                  Surah Al-Ikhlas
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6">(The Sincerity)</p>
                <div className="text-right leading-loose" style={{ fontFamily: 'Traditional Arabic, Arial', fontSize: '1.5rem', lineHeight: '2.5rem' }}>
                  <p className="mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  <p className="mb-3">قُلْ هُوَ اللَّهُ أَحَدٌ</p>
                  <p className="mb-3">اللَّهُ الصَّمَدُ</p>
                  <p className="mb-3">لَمْ يَلِدْ وَلَمْ يُولَدْ</p>
                  <p>وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ</p>
                </div>
              </div>

              {/* Surah Al-Falaq */}
              <div className="bg-primary-50 rounded-xl shadow-lg border-2 border-primary-200 p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-primary-700 mb-6 text-center">
                  Surah Al-Falaq
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6">(The Daybreak)</p>
                <div className="text-right leading-loose" style={{ fontFamily: 'Traditional Arabic, Arial', fontSize: '1.5rem', lineHeight: '2.5rem' }}>
                  <p className="mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  <p className="mb-3">قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ</p>
                  <p className="mb-3">مِن شَرِّ مَا خَلَقَ</p>
                  <p className="mb-3">وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ</p>
                  <p className="mb-3">وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ</p>
                  <p>وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ</p>
                </div>
              </div>

              {/* Surah An-Nas */}
              <div className="bg-accent-50 rounded-xl shadow-lg border-2 border-accent-200 p-8 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-accent-700 mb-6 text-center">
                  Surah An-Nas
                </h3>
                <p className="text-sm text-neutral-600 text-center mb-6">(Mankind)</p>
                <div className="text-right leading-loose" style={{ fontFamily: 'Traditional Arabic, Arial', fontSize: '1.5rem', lineHeight: '2.5rem' }}>
                  <p className="mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  <p className="mb-3">قُلْ أَعُوذُ بِرَبِّ النَّاسِ</p>
                  <p className="mb-3">مَلِكِ النَّاسِ</p>
                  <p className="mb-3">إِلَهِ النَّاسِ</p>
                  <p className="mb-3">مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ</p>
                  <p className="mb-3">الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ</p>
                  <p>مِنَ الْجِنَّةِ وَالنَّاسِ</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-white relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #166534 0%, #a16207 50%, #166534 100%)' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{ backgroundImage: `url('${siteSettings.footerImageUrl || '/q1.webp'}')` }}
        ></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-neutral-300 mb-2">75 Odsal Road, Wibsey</p>
              <p className="text-neutral-300 mb-2">Bradford BD6 1PN, UK</p>
              <p className="text-neutral-300 mb-1">Zaheer: 07539 836 366</p>
              <p className="text-neutral-300">Rifaqat: 07813 100 885</p>
              <a
                href="https://maps.app.goo.gl/j6UmkD8GZNshgGG88?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-accent-200 hover:text-accent-100 transition-colors underline"
              >
                Google Maps Location
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#donate" className="text-neutral-300 hover:text-primary-400 transition-colors">Donate</a></li>
                <li><a href="#volunteer" className="text-neutral-300 hover:text-primary-400 transition-colors">Volunteer</a></li>
                <li><a href="#classes" className="text-neutral-300 hover:text-primary-400 transition-colors">Islamic Classes</a></li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">Facebook</a>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">Twitter</a>
                <a href="#" className="text-neutral-300 hover:text-primary-400 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-8 pt-8 text-center">
            <p className="text-neutral-400 text-sm">&copy; 2026 Al-Rahma Islamic Centre. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
