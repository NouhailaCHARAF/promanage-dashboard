import { useState, type FormEvent } from "react";
import type { UserProfile } from "../App";

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function Settings({ user, onUpdateUser }: SettingsProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    onUpdateUser({
      fullName: fullName.trim() || user.fullName,
      email: email.trim() || user.email,
      role: role.trim() || user.role,
    });
    setIsSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">
          Manage your account information and preferences
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Profile Information
          </h3>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setIsSaved(false);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsSaved(false);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setIsSaved(false);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Email Notifications
            </p>
            <p className="text-xs text-slate-500">
              Receive updates when tasks or projects change
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmailNotifications(!emailNotifications);
              setIsSaved(false);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              emailNotifications ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                emailNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          {isSaved ? (
            <span className="text-sm font-medium text-emerald-600">
              ✓ Settings saved successfully!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
