import { useEffect, useState } from 'react'
import { database, storage } from '../firebase'
import { ref as dbRef, set, get, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import './Admin.css'

const auth = getAuth()

function Admin() {
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authChecking, setAuthChecking] = useState(true)
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: { time: '5:37 AM', hour: 5, minute: 37 },
    dhuhr: { time: '12:30 PM', hour: 12, minute: 30 },
    asr: { time: '3:32 PM', hour: 15, minute: 32 },
    maghrib: { time: '6:17 PM', hour: 18, minute: 17 },
    isha: { time: '7:45 PM', hour: 19, minute: 45 }
  })
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: 'Welcome to Al-Rahma Islamic Centre',
    heroSubtitle: 'A place of worship, unity, and community service',
    heroImageUrl: '/q2.jpg',
    prayerImageUrl: '/timing1.jpg',
    footerImageUrl: '/q1.webp'
  })
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' })
  const [announcementItems, setAnnouncementItems] = useState([])
  const [uploadingSlot, setUploadingSlot] = useState('')

  const PRAYER_ORDER = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user))
      setAuthChecking(false)
    })

    return () => unsubscribe()
  }, [])

  const to12Hour = (hour, minute) => {
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`
  }

  const toInputTime = (hour, minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  const parseInputTime = (value) => {
    const [hourStr, minuteStr] = value.split(':')
    return {
      hour: Number(hourStr),
      minute: Number(minuteStr)
    }
  }

  const parseTextTime = (value) => {
    const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!match) return null
    let hour = Number(match[1])
    const minute = Number(match[2])
    const ampm = match[3].toUpperCase()
    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0
    return { hour, minute }
  }

  const handleLogin = async () => {
    setAuthError('')

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAuthError('Please enter email and password.')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword)
      setAdminPassword('')
    } catch (error) {
      console.error('Login error:', error)
      setAuthError(error.message || 'Login failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setAuthError('')
    } catch (error) {
      console.error('Logout error:', error)
      alert(`Error signing out: ${error.message || 'Unknown error'}`)
    }
  }

  const updatePrayerTimeFromInput = (prayer, inputValue) => {
    const { hour, minute } = parseInputTime(inputValue)
    setPrayerTimes({
      ...prayerTimes,
      [prayer]: {
        ...prayerTimes[prayer],
        hour,
        minute,
        time: to12Hour(hour, minute)
      }
    })
  }

  const savePrayerTimes = async () => {
    try {
      const payload = PRAYER_ORDER.reduce((acc, prayerName) => {
        const prayer = prayerTimes[prayerName]
        acc[prayerName] = {
          hour: Number(prayer.hour),
          minute: Number(prayer.minute),
          time: to12Hour(Number(prayer.hour), Number(prayer.minute))
        }
        return acc
      }, {})

      await set(dbRef(database, 'mosque/prayerTimes'), payload)
      alert('Prayer times saved successfully!')
    } catch (error) {
      console.error('Error saving prayer times:', error)
      alert(`Error saving prayer times: ${error.code || ''} ${error.message || ''}`.trim())
    }
  }

  const saveAnnouncement = async () => {
    if (!announcementForm.message.trim()) {
      alert('Please enter an announcement message first.')
      return
    }

    try {
      const id = Date.now().toString()
      const announcementRef = dbRef(database, `mosque/announcements/${id}`)
      await set(announcementRef, {
        title: announcementForm.title.trim() || 'Announcement',
        message: announcementForm.message.trim(),
        timestamp: new Date().toISOString()
      })
      alert('Announcement saved!')
      setAnnouncementForm({ title: '', message: '' })
      loadAnnouncements()
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert(`Error saving announcement: ${error.code || ''} ${error.message || ''}`.trim())
    }
  }

  const deleteAnnouncement = async (id) => {
    try {
      await remove(dbRef(database, `mosque/announcements/${id}`))
      setAnnouncementItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert(`Error deleting announcement: ${error.code || ''} ${error.message || ''}`.trim())
    }
  }

  const loadPrayerTimes = async () => {
    try {
      const snapshot = await get(dbRef(database, 'mosque/prayerTimes'))
      if (snapshot.exists()) {
        const raw = snapshot.val()
        const normalized = { ...prayerTimes }

        PRAYER_ORDER.forEach((name) => {
          const item = raw[name]
          if (!item) return

          if (typeof item.hour === 'number' && typeof item.minute === 'number') {
            normalized[name] = {
              hour: item.hour,
              minute: item.minute,
              time: to12Hour(item.hour, item.minute)
            }
            return
          }

          if (typeof item.time === 'string') {
            const parsed = parseTextTime(item.time)
            if (parsed) {
              normalized[name] = {
                hour: parsed.hour,
                minute: parsed.minute,
                time: to12Hour(parsed.hour, parsed.minute)
              }
            }
          }
        })

        setPrayerTimes(normalized)
        alert('Prayer times loaded!')
      }
    } catch (error) {
      console.error('Error loading prayer times:', error)
    }
  }

  const saveSiteSettings = async () => {
    try {
      await set(dbRef(database, 'mosque/siteSettings'), {
        heroTitle: siteSettings.heroTitle,
        heroSubtitle: siteSettings.heroSubtitle,
        heroImageUrl: siteSettings.heroImageUrl,
        prayerImageUrl: siteSettings.prayerImageUrl,
        footerImageUrl: siteSettings.footerImageUrl
      })
      alert('Site settings saved successfully!')
    } catch (error) {
      console.error('Error saving site settings:', error)
      alert(`Error saving site settings: ${error.code || ''} ${error.message || ''}`.trim())
    }
  }

  const loadSiteSettings = async () => {
    try {
      const snapshot = await get(dbRef(database, 'mosque/siteSettings'))
      if (snapshot.exists()) {
        setSiteSettings((prev) => ({ ...prev, ...snapshot.val() }))
      }
    } catch (error) {
      console.error('Error loading site settings:', error)
    }
  }

  const loadAnnouncements = async () => {
    try {
      const snapshot = await get(dbRef(database, 'mosque/announcements'))
      if (!snapshot.exists()) {
        setAnnouncementItems([])
        return
      }

      const values = snapshot.val()
      const items = Object.entries(values)
        .filter(([, value]) => value && typeof value === 'object' && value.message)
        .map(([id, value]) => ({
          id,
          title: value.title || 'Announcement',
          message: value.message,
          timestamp: value.timestamp || ''
        }))
        .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))

      setAnnouncementItems(items)
    } catch (error) {
      console.error('Error loading announcements:', error)
    }
  }

  const handleImageUpload = async (slot, file) => {
    if (!file) return
    try {
      setUploadingSlot(slot)
      const fileRef = storageRef(storage, `mosque-images/${slot}-${Date.now()}-${file.name}`)
      await uploadBytes(fileRef, file)
      const downloadUrl = await getDownloadURL(fileRef)

      setSiteSettings((prev) => ({
        ...prev,
        [slot]: downloadUrl
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`Error uploading image: ${error.code || ''} ${error.message || ''}`.trim())
    } finally {
      setUploadingSlot('')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h2>Admin Panel</h2>
          {authChecking && <p>Checking session...</p>}
          <input
            type="email"
            placeholder="Enter admin email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {authError && <p className="helper-text">{authError}</p>}
          <button onClick={handleLogin} disabled={authChecking}>Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel - Al-Rahma Islamic Centre</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="admin-content">
        {/* Prayer Times Section */}
        <div className="admin-section">
          <h2>Prayer Times (Auto AM/PM)</h2>
          <p className="helper-text">Choose times using the 24-hour picker; AM/PM is generated automatically.</p>
          <button onClick={loadPrayerTimes} className="load-btn">Load Current Times</button>
          
          {PRAYER_ORDER.map((prayer) => (
            <div key={prayer} className="prayer-input">
              <label>{prayer.charAt(0).toUpperCase() + prayer.slice(1)}</label>
              <div className="time-row">
                <input
                  type="time"
                  value={toInputTime(prayerTimes[prayer].hour, prayerTimes[prayer].minute)}
                  onChange={(e) => updatePrayerTimeFromInput(prayer, e.target.value)}
                />
                <span className="time-preview">{prayerTimes[prayer].time}</span>
              </div>
            </div>
          ))}
          <button onClick={savePrayerTimes} className="save-btn">Save Prayer Times</button>
        </div>

        {/* Announcements Section */}
        <div className="admin-section">
          <h2>Announcements</h2>
          <input
            type="text"
            placeholder="Announcement title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder="Enter announcement message"
            value={announcementForm.message}
            onChange={(e) => setAnnouncementForm((prev) => ({ ...prev, message: e.target.value }))}
            rows="4"
          />
          <button onClick={loadAnnouncements} className="load-btn">Load Announcements</button>
          <button onClick={saveAnnouncement} className="save-btn">Save Announcement</button>

          <div className="announcement-list">
            {announcementItems.map((item) => (
              <div key={item.id} className="announcement-item">
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.message}</p>
                </div>
                <button onClick={() => deleteAnnouncement(item.id)} className="delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Site Settings Section */}
        <div className="admin-section full-width">
          <h2>Site Content & Images</h2>
          <p className="helper-text">Control hero text and replace existing images by URL or by file upload.</p>

          <div className="settings-grid">
            <div className="setting-field">
              <label>Hero Title</label>
              <input
                type="text"
                value={siteSettings.heroTitle}
                onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
              />
            </div>

            <div className="setting-field">
              <label>Hero Subtitle</label>
              <input
                type="text"
                value={siteSettings.heroSubtitle}
                onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
              />
            </div>

            <div className="setting-field">
              <label>Hero Background Image URL</label>
              <input
                type="text"
                value={siteSettings.heroImageUrl}
                onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('heroImageUrl', e.target.files?.[0])}
              />
            </div>

            <div className="setting-field">
              <label>Prayer Timetable Image URL</label>
              <input
                type="text"
                value={siteSettings.prayerImageUrl}
                onChange={(e) => setSiteSettings((prev) => ({ ...prev, prayerImageUrl: e.target.value }))}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('prayerImageUrl', e.target.files?.[0])}
              />
            </div>

            <div className="setting-field">
              <label>Footer Background Image URL</label>
              <input
                type="text"
                value={siteSettings.footerImageUrl}
                onChange={(e) => setSiteSettings((prev) => ({ ...prev, footerImageUrl: e.target.value }))}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('footerImageUrl', e.target.files?.[0])}
              />
            </div>
          </div>

          {uploadingSlot && <p className="helper-text">Uploading image for {uploadingSlot}...</p>}

          <button onClick={loadSiteSettings} className="load-btn">Load Site Settings</button>
          <button onClick={saveSiteSettings} className="save-btn">Save Site Settings</button>
        </div>
      </div>
    </div>
  )
}

export default Admin
