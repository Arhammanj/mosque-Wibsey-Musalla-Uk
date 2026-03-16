import { database } from '../firebase'
import { ref, get, onValue } from 'firebase/database'

// Fetch prayer times
export const fetchPrayerTimes = async () => {
  try {
    const prayerRef = ref(database, 'mosque/prayerTimes')
    const snapshot = await get(prayerRef)
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    return null
  }
}

// Real-time listener for prayer times
export const onPrayerTimesChange = (callback) => {
  const prayerRef = ref(database, 'mosque/prayerTimes')
  onValue(prayerRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val())
    }
  })
}

// Fetch events
export const fetchEvents = async () => {
  try {
    const eventsRef = ref(database, 'mosque/events')
    const snapshot = await get(eventsRef)
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error('Error fetching events:', error)
    return null
  }
}

// Fetch announcements
export const fetchAnnouncements = async () => {
  try {
    const announcementRef = ref(database, 'mosque/announcements')
    const snapshot = await get(announcementRef)
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return null
  }
}

// Fetch editable site settings (hero text/images and section images)
export const fetchSiteSettings = async () => {
  try {
    const siteSettingsRef = ref(database, 'mosque/siteSettings')
    const snapshot = await get(siteSettingsRef)
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
