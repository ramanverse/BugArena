const slugifyLib = require('slugify')

/**
 * Convert a string into a URL-safe slug with random suffix to ensure uniqueness
 */
const slugify = (str, addSuffix = false) => {
  const base = slugifyLib(str, { lower: true, strict: true, trim: true })
  if (!addSuffix) return base
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}

module.exports = { slugify }
