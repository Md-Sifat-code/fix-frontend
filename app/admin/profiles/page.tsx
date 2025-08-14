import ProfileManager from "@/components/profile-manager"
import ProtectedContent from "@/components/protected-content"

export default function AdminProfilesPage() {
  return (
    // <ProtectedContent>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Profile Administration</h1>
        <ProfileManager />
      </div>
    // </ProtectedContent>
  )
}
