import PreferencesForm from './Preferences'
import CreateUserProfile from './CreateProfile'
import ProfileImagePage from './ProfileImage'
function UserDetailsPage() {
  return (
    <div className="h-full flex flex-col sm:flex-row p-4 sm:p-8 gap-4 bg-gray-900">
    {/* Left Section */}
    <div className="flex justify-center items-center h-auto sm:h-full w-full sm:w-1/2 p-4">
      <CreateUserProfile />
    </div>
  
    {/* Right Section */}
    <div className="justify-center items-center grid grid-cols-1 sm:grid-rows-1 h-auto sm:h-full w-full sm:w-1/2">
      {/* Profile Image Section */}
      <div className="flex justify-center items-center h-auto sm:h-1/2 p-4">
        <ProfileImagePage />
      </div>
  
      {/* Preferences Form Section */}
      <div className="flex justify-center items-center h-auto sm:h-1/2 p-4">
        <PreferencesForm />
      </div>
    </div>
  </div>
  
  )
}

export default UserDetailsPage
