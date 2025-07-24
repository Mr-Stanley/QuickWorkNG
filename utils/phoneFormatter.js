/**
 * Format Nigerian phone number to international format for WhatsApp
 * @param {string} phone - Phone number in various formats
 * @returns {string} - Formatted phone number for WhatsApp URL
 */
const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return ""

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "")

  // Handle different formats
  if (cleanPhone.startsWith("234")) {
    // Already in international format
    return cleanPhone
  } else if (cleanPhone.startsWith("0")) {
    // Local format (0801234567) -> convert to international
    return "234" + cleanPhone.substring(1)
  } else if (cleanPhone.length === 10) {
    // 10 digits without leading 0 (8012345678)
    return "234" + cleanPhone
  }

  return cleanPhone
}

/**
 * Generate WhatsApp URL
 * @param {string} phone - Phone number
 * @param {string} message - Optional pre-filled message
 * @returns {string} - WhatsApp URL
 */
const generateWhatsAppUrl = (phone, message = "") => {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ""}`
}

module.exports = {
  formatPhoneForWhatsApp,
  generateWhatsAppUrl,
}
