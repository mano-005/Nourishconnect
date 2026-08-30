// Matches a donation record to the currently signed-in donor.
// Prefers email (set automatically when a donor submits through the app),
// and falls back to a case-insensitive name match for donations that were
// logged manually by an admin under the donor's display name.
export function isOwnDonation(donation, user) {
  if (!user) return false
  if (donation.donorEmail && user.email) {
    return donation.donorEmail.toLowerCase() === user.email.toLowerCase()
  }
  if (!donation.donor || !user.name) return false
  return donation.donor.toLowerCase() === user.name.toLowerCase()
}
