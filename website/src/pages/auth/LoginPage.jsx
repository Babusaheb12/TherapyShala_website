import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Building2, User, Sparkles, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TherapyshalaLogo from '../../components/TherapyshalaLogo';
import { useAuth } from '../../context/AuthContext';
import { spaOwnerLogin, spaOwnerForgotPassword } from '../../services/spaOwner.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithDemo, loginOwner } = useAuth();

  // Role tab: 'owner' | 'customer'
  const [roleTab, setRoleTab] = useState('owner');

  // Mode for customer: 'signin' | 'signup'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    // SPA OWNER LOGIN (API 1)
    if (roleTab === 'owner') {
      setLoading(true);
      try {
        const response = await spaOwnerLogin({
          email: email.trim(),
          password: password.trim(),
        });

        if (response?.success && response?.token) {
          loginOwner(response.token, response.data);
          setSuccessMsg(response.message || 'Login successful! Welcome to the Spa Owner Portal.');

          const targetRoute = location.state?.from || '/owner/dashboard';
          setTimeout(() => {
            navigate(targetRoute);
          }, 800);
        } else {
          setErrorMsg(response?.message || 'Authentication failed. Please verify credentials.');
        }
      } catch (err) {
        const msg =
          err?.data?.message ||
          err?.data?.error?.message ||
          err?.message ||
          'Invalid email or password.';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    // CUSTOMER LOGIN
    if (isSignUp && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const displayName = isSignUp && name.trim()
        ? name.trim()
        : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      login({
        name: displayName,
        email: email.trim(),
        role: 'customer',
        tier: 'Sanctuary Member'
      });

      setSuccessMsg(isSignUp ? 'Account created! Welcome to Therapyshala.' : 'Logged in successfully!');
      setTimeout(() => {
        navigate(location.state?.from || '/account');
      }, 900);
    }, 600);
  };

  // FORGOT PASSWORD (API 2)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotErrorMsg('');
    setForgotSuccessMsg('');

    if (!forgotEmail.trim()) {
      setForgotErrorMsg('Please provide your registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await spaOwnerForgotPassword({ email: forgotEmail.trim() });
      if (response?.success) {
        setForgotSuccessMsg(response.message || 'New password sent to your registered email address.');
      } else {
        setForgotErrorMsg(response?.message || 'Unable to process password reset request.');
      }
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.error?.message ||
        err?.message ||
        'No account found with this email.';
      setForgotErrorMsg(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const fillOwnerDemo = () => {
    setEmail('rajesh@oasisspa.com');
    setPassword('Spa@567848');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#0D0D12] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          
          {/* Back Link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#757880] hover:text-[#F35271] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-[11px] font-medium text-[#757880] bg-white px-2.5 py-1 rounded-full border border-gray-200">
              TherapyShala Secure Auth
            </span>
          </div>

          {/* Clean Card */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-gray-200 shadow-sm">
            
            {/* Logo & Title */}
            <div className="text-center mb-6">
              <Link to="/" className="inline-block mb-3">
                <TherapyshalaLogo className="h-11 w-auto mx-auto object-contain" />
              </Link>
              <h1 className="text-2xl font-bold text-[#0D0D12] tracking-tight">
                {roleTab === 'owner' ? 'Spa Owner Portal' : (isSignUp ? 'Create an Account' : 'Welcome Back')}
              </h1>
              <p className="text-xs text-[#757880] mt-1">
                {roleTab === 'owner'
                  ? 'Sign in to manage your spa, therapists, and appointments'
                  : (isSignUp ? 'Sign up with your email to book sanctuary wellness' : 'Sign in to access your bookings and membership')}
              </p>
            </div>

            {/* Portal Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100/80 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setRoleTab('owner');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === 'owner'
                    ? 'bg-white text-[#F35271] shadow-xs'
                    : 'text-[#757880] hover:text-[#0D0D12]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Spa Owner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoleTab('customer');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === 'customer'
                    ? 'bg-white text-[#F35271] shadow-xs'
                    : 'text-[#757880] hover:text-[#0D0D12]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {roleTab === 'customer' && isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0D0D12] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={roleTab === 'owner' ? 'owner@oasisspa.com' : 'name@example.com'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#0D0D12]">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotEmail(email);
                      setForgotErrorMsg('');
                      setForgotSuccessMsg('');
                    }}
                    className="text-xs text-[#F35271] hover:underline cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-[#F35271] focus:ring-1 focus:ring-[#F35271] outline-none text-sm bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs text-[#757880]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#F35271] focus:ring-[#F35271]"
                  />
                  <span>Remember my credentials</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#F35271] hover:bg-[#E04362] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{roleTab === 'owner' ? 'Sign In to Owner Portal' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper */}
            {roleTab === 'owner' ? (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={fillOwnerDemo}
                  className="w-full py-2.5 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-xs font-semibold text-[#F35271] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fill Demo Spa Owner Credentials</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    loginWithDemo();
                    setSuccessMsg('Logged in with Demo Account!');
                    setTimeout(() => {
                      navigate(location.state?.from || '/account');
                    }, 800);
                  }}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#757880] hover:text-[#0D0D12] transition-colors cursor-pointer"
                >
                  Quick Customer Demo (1-Click)
                </button>
              </div>
            )}

            {/* Switch Sign In / Sign Up for customer or inquiry link for spa */}
            <div className="mt-5 text-center text-xs text-[#757880]">
              {roleTab === 'owner' ? (
                <span>
                  Don't have a spa code yet?{' '}
                  <Link to="/enquiry" className="text-[#F35271] font-semibold hover:underline">
                    Submit Onboarding Inquiry
                  </Link>
                </span>
              ) : (
                isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setErrorMsg('');
                      }}
                      className="text-[#F35271] font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setErrorMsg('');
                      }}
                      className="text-[#F35271] font-semibold hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </span>
                )
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Forgot Password Modal (API 2 Integrated) */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0D0D12]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#F35271]">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-[#0D0D12]">
                  Forgot Password?
                </h3>
              </div>
              <p className="text-xs text-[#757880] mb-4">
                Enter your registered spa owner email address. A temporary password will be dispatched to your inbox.
              </p>

              {forgotErrorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotErrorMsg}</span>
                </div>
              )}

              {forgotSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{forgotSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D0D12] mb-1">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="owner@oasisspa.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#F35271] outline-none text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#757880] hover:bg-gray-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#F35271] text-white text-xs font-semibold hover:bg-[#E04362] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Password</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

