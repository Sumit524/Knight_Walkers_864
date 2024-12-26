import PreferencesForm from './Preferences';
import CreateUserProfile from './CreateProfile';
import ProfileImagePage from './ProfileImage';

function UserDetailsPage() {
  return (
    <div className="h-full flex flex-col sm:flex-row p-4 sm:p-8 gap-4 ">
      {/* Create User Profile Section */}
      <div className="flex justify-center items-center h-auto sm:h-full w-full sm:w-1/3 p-4 bg-gray-800 rounded-lg">
        <CreateUserProfile />
      </div>

      {/* Profile Image Section */}
      <div className="flex justify-center items-center h-auto sm:h-full w-full sm:w-1/3 p-4 bg-gray-800 rounded-lg">
        <ProfileImagePage />
      </div>

      {/* Preferences Form Section */}
      <div className="flex justify-center items-center h-auto sm:h-full w-full sm:w-1/3 p-4 bg-gray-800 rounded-lg">
        <PreferencesForm />
      </div>
    </div>
  );
}

export default UserDetailsPage;
