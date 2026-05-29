import { SETTINGS_LABELS } from '../../constants/settings.constants'

export function EditProfileSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{SETTINGS_LABELS.EDIT_PROFILE.SECTION_TITLE}</h2>
      <p className="text-gray-600">{SETTINGS_LABELS.EDIT_PROFILE.SECTION_SUBTITLE}</p>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        {SETTINGS_LABELS.EDIT_PROFILE.DEVELOPMENT}
      </div>
    </div>
  )
}
