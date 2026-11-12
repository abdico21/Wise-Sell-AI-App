import React from 'react';
import { 
  User, 
  Mail, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  KeyRound, 
  X, 
  ExternalLink,
  Layers,
  MapPin,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onTriggerSignOut: () => void;
  onOpenPasswordReset: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onTriggerSignOut,
  onOpenPasswordReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-900 bg-black/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold text-white">Enterprise Profile & Security</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar & Title Banner */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-base font-bold text-white truncate">{user.fullName}</h4>
              <p className="text-xs text-orange-400 font-semibold truncate">{user.role}</p>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-black border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                Organization:
              </span>
              <span className="text-white font-semibold">{user.companyName}</span>
            </div>

            <div className="p-3 rounded-xl bg-black border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                Primary Industry:
              </span>
              <span className="text-white font-semibold">{user.primaryIndustry}</span>
            </div>

            <div className="p-3 rounded-xl bg-black border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Location HQ:
              </span>
              <span className="text-white font-semibold">{user.location}</span>
            </div>

            <div className="p-3 rounded-xl bg-black border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                2FA Session Status:
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Active
              </span>
            </div>
          </div>

          {/* Security & Action Buttons */}
          <div className="pt-2 border-t border-slate-900 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenPasswordReset();
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span>Change / Reset Account Password</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTriggerSignOut();
              }}
              className="w-full py-2.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out of Current Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
