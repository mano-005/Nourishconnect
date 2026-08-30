import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import FAQ from './pages/FAQ.jsx'
import PartnerWithUs from './pages/PartnerWithUs.jsx'
import DonorLogin from './pages/DonorLogin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import DonorSignup from './pages/DonorSignup.jsx'
import DonorDashboard from './pages/DonorDashboard.jsx'
import DonorDonate from './pages/DonorDonate.jsx'
import DonorMyDonations from './pages/DonorMyDonations.jsx'
import DonorTrack from './pages/DonorTrack.jsx'
import DonorHomes from './pages/DonorHomes.jsx'
import DonorHistory from './pages/DonorHistory.jsx'
import DonorProfile from './pages/DonorProfile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminHomes from './pages/AdminHomes.jsx'
import AdminDonations from './pages/AdminDonations.jsx'
import AdminDonors from './pages/AdminDonors.jsx'
import AdminReports from './pages/AdminReports.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import AdminSettings from './pages/AdminSettings.jsx'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/login/donor" element={<DonorLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup" element={<DonorSignup />} />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute role="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/donate"
            element={
              <ProtectedRoute role="donor">
                <DonorDonate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/my-donations"
            element={
              <ProtectedRoute role="donor">
                <DonorMyDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/track"
            element={
              <ProtectedRoute role="donor">
                <DonorTrack />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/homes"
            element={
              <ProtectedRoute role="donor">
                <DonorHomes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/history"
            element={
              <ProtectedRoute role="donor">
                <DonorHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/profile"
            element={
              <ProtectedRoute role="donor">
                <DonorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/homes"
            element={
              <ProtectedRoute role="admin">
                <AdminHomes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <ProtectedRoute role="admin">
                <AdminDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/donors"
            element={
              <ProtectedRoute role="admin">
                <AdminDonors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute role="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Landing />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}
