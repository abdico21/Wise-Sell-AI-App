import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Building, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Smartphone, 
  LogOut,
  Sparkles,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { UserProfile, IndustryType } from '../types';
import { WiseSellLogo } from './WiseSellLogo';

export type AuthMode = 
  | 'signin' 
  | 'signin-confirm' 
  | 'signup' 
  | 'signup-confirm'
  | 'forgot-password' 
  | 'reset-confirm' 
  | 'reset-success'
  | 'signout-confirm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogoutSuccess: () => void;
  initialMode?: AuthMode;
  showToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogoutSuccess,
  initialMode = 'signin',
  showToast,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [email, setEmail] = useState<string>('abdico.veiws22@gmail.com');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('Abdi Mohammed');
  const [companyName, setCompanyName] = useState<string>('WiseSell Enterprise Ethiopia');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | 'Multi-Industry Enterprise'>('Multi-Industry Enterprise');

  // Confirmation states
  const [twoFactorCode, setTwoFactorCode] = useState<string>('849210');
  const [resetCode, setResetCode] = useState<string>('491823');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset mode when opened
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle 1-Click Quick Demo Sign In
  const handleQuickDemoFill = (demoEmail: string, demoName: string, demoRole: UserProfile['role']) => {
    setEmail(demoEmail);
    setFullName(demoName);
    setPassword('WiseSell2026!');
    setErrorMsg(null);
  };

  // 1. Submit Sign In -> Proceed to Sign In 2FA Confirmation
  const handleSubmitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your business email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      // Move to 2FA / Sign-In Confirmation step
      setMode('signin-confirm');
      showToast('2FA Security Code Dispatched to your device');
    }, 700);
  };

  // 2. Submit Sign In Confirmation (OTP Verification)
  const handleConfirmSignInOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      setErrorMsg('Please enter the 6-digit confirmation code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email,
        fullName: fullName || 'Abdi Mohammed',
        role: email.includes('admin') || email.includes('abdico') ? 'Enterprise Admin' : 'Growth Marketer',
        companyName: companyName || 'WiseSell Commerce Group',
        primaryIndustry: selectedIndustry,
        location: 'Addis Ababa, Ethiopia (HQ)',
        is2faVerified: true,
        lastLoginTime: 'Just now',
      };

      onLoginSuccess(authenticatedUser);
      showToast(`Sign-In Confirmed: Welcome back, ${authenticatedUser.fullName}!`);
      onClose();
    }, 800);
  };

  // 3. Submit Sign Up -> Registration Confirmation
  const handleSubmitSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !companyName) {
      setErrorMsg('Please fill in all required enterprise registration fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('signup-confirm');
    }, 800);
  };

  // 4. Submit Forgot Password Request -> Reset Confirmation
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered account email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('reset-confirm');
      showToast('Password reset token dispatched to your email.');
    }, 700);
  };

  // 5. Submit Password Reset Confirmation
  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long with uppercase and numbers.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMode('reset-success');
      showToast('Password successfully updated and confirmed.');
    }, 800);
  };

  // 6. Confirm Sign Out
  const handleConfirmSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogoutSuccess();
      showToast('Successfully signed out of WiseSell AI session.');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header with Logo & Close Button */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-900 bg-black/60">
          <WiseSellLogo size="sm" showWordmark={true} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 1: SIGN IN FORM */}
          {/* ============================================================== */}
          {mode === 'signin' && (
            <form onSubmit={handleSubmitSignIn} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Enterprise Sign In</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Access your autonomous marketing, inventory & salesforce agents
                </p>
              </div>

              {/* Quick Demo Fill Buttons */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Demo Accounts (1-Tap):
                </span>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('abdico.veiws22@gmail.com', 'Abdi Mohammed', 'Enterprise Admin')}
                    className="p-1.5 px-2.5 rounded-lg bg-black border border-orange-500/30 hover:border-orange-500 text-left text-xs text-slate-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-orange-400">abdico.veiws22@gmail.com</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">Enterprise Admin (Addis Ababa)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill('merchant.lead@wisesell.ai', 'Liya Bekele', 'Growth Marketer')}
                    className="p-1.5 px-2.5 rounded-lg bg-black border border-blue-500/30 hover:border-blue-500 text-left text-xs text-slate-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold text-blue-400">merchant.lead@wisesell.ai</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">Growth & Campaign Director</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Corporate Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-[11px] text-orange-400 hover:text-orange-300 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Continue to Sign In Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-slate-900">
                <span className="text-xs text-slate-400">Don't have an enterprise account? </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs font-semibold text-orange-400 hover:underline cursor-pointer"
                >
                  Register new business
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 2: SIGN IN CONFIRMATION (2FA / OTP STEP) */}
          {/* ============================================================== */}
          {mode === 'signin-confirm' && (
            <form onSubmit={handleConfirmSignInOtp} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-blue-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Sign-In Confirmation</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  A 6-digit confirmation code was sent to <span className="text-white font-semibold">{email}</span>
                </p>
              </div>

              {/* Verified Session Context Card */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Sign-In Target:</span>
                  <span className="text-white font-mono font-medium">{email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Authorized Role:</span>
                  <span className="text-orange-400 font-semibold">Enterprise Admin</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Location Security:</span>
                  <span className="text-emerald-400 font-medium">Addis Ababa, Ethiopia (Verified)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1 text-center">
                  Enter 6-Digit Confirmation Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="849210"
                  className="w-full text-center tracking-[0.4em] font-mono text-lg font-bold bg-black border border-slate-700 rounded-xl py-3 text-orange-400 focus:outline-none focus:border-orange-500"
                  required
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorCode('849210');
                      showToast('Demo OTP 849210 auto-filled');
                    }}
                    className="text-orange-400 hover:underline cursor-pointer"
                  >
                    Auto-fill demo code (849-210)
                  </button>
                  <span>Expires in 04:59</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Confirming Session Security...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Sign-In & Establish Session</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Back to sign-in credentials
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 3: SIGN UP FORM */}
          {/* ============================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSubmitSignUp} className="space-y-3.5">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Register Enterprise</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deploy WiseSell AI multi-agent commerce automation
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Abdi Mohammed"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Ethiopian Apparel Group"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Industry</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Multi-Industry Enterprise">Multi-Industry Enterprise (All)</option>
                    <option value="Coffee & Agriculture">Coffee & Agriculture (Yirgacheffe, Teff, Spices)</option>
                    <option value="Fashion & Traditional Apparel">Fashion & Traditional Apparel (Habesha Kemis, Hoodies)</option>
                    <option value="Consumer Electronics">Consumer Electronics (MagSafe, Solar, Audio)</option>
                    <option value="Natural Cosmetics & Wellness">Natural Cosmetics & Wellness (Black Seed, Shea)</option>
                    <option value="Handcrafted Home & Artisan">Handcrafted Home & Artisan (Jebena, Leather Bags)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abdi@company.et"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Create Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Submit & Proceed to Account Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-slate-900">
                <span className="text-xs text-slate-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-semibold text-orange-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 4: SIGN UP CONFIRMATION */}
          {/* ============================================================== */}
          {mode === 'signup-confirm' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Account Successfully Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Welcome to WiseSell AI, <span className="text-white font-semibold">{fullName}</span>. Your multi-agent enterprise hub for <span className="text-orange-400 font-semibold">{companyName}</span> is ready.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered Email:</span>
                  <span className="text-white font-mono">{email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Configured Industry:</span>
                  <span className="text-blue-400 font-semibold">{selectedIndustry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Autonomous Agents:</span>
                  <span className="text-emerald-400 font-semibold">5 / 5 Initialized</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const newUser: UserProfile = {
                    id: `usr-${Date.now()}`,
                    email: email,
                    fullName: fullName,
                    role: 'Enterprise Admin',
                    companyName: companyName,
                    primaryIndustry: selectedIndustry,
                    location: 'Addis Ababa, Ethiopia',
                    is2faVerified: true,
                    lastLoginTime: 'Just now',
                  };
                  onLoginSuccess(newUser);
                  onClose();
                  showToast('Welcome to WiseSell AI Enterprise!');
                }}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter WiseSell Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 5: FORGOT PASSWORD REQUEST */}
          {/* ============================================================== */}
          {mode === 'forgot-password' && (
            <form onSubmit={handleRequestPasswordReset} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Reset Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter your corporate email to receive a password reset code
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abdico.veiws22@gmail.com"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Sending Reset Link...</span>
                ) : (
                  <>
                    <span>Send Password Reset Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Return to sign in
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 6: PASSWORD RESET CONFIRMATION */}
          {/* ============================================================== */}
          {mode === 'reset-confirm' && (
            <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Password Reset Confirmation</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Set New Secure Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Security reset code was sent to <span className="text-white font-semibold">{email}</span>
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Reset Security Code</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="491823"
                    required
                    className="w-full font-mono text-center tracking-widest bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-orange-400 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Updating Credentials...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Password Reset</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 7: PASSWORD RESET SUCCESS */}
          {/* ============================================================== */}
          {mode === 'reset-success' && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Password Reset Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Your credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>

              <button
                onClick={() => setMode('signin')}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 8: SIGN OUT CONFIRMATION */}
          {/* ============================================================== */}
          {mode === 'signout-confirm' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Sign-Out Confirmation</h3>
                  <p className="text-xs text-slate-400">
                    Confirm termination of current enterprise session
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  You are currently signed in as <span className="font-semibold text-white">{currentUser?.fullName || 'Enterprise Admin'}</span> ({currentUser?.email || email}).
                </p>
                <div className="p-2 rounded bg-black/60 border border-slate-800 text-[11px] text-slate-400">
                  💡 Note: Scheduled background automation tasks across Telebirr, TikTok Shop & Shopify will continue processing on the server.
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Stay Signed In
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignOut}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? 'Signing Out...' : 'Confirm Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
