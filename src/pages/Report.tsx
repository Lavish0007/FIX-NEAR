import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Layers,
  Sparkles,
  Navigation,
  AlertCircle,
} from 'lucide-react';
import { issueService } from '../services/api';
import { PageTransition } from '../components/PageTransition';

const CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Garbage',
  'Water Leakage',
  'Drainage',
  'Road Damage',
  'Public Toilet',
  'Traffic Signal',
  'Park/Public Space',
  'Other',
];

const PRIORITIES = [
  { value: 'LOW', label: 'Low', desc: 'Minor cosmetic defect' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Noticeable everyday inconvenience' },
  { value: 'HIGH', label: 'High', desc: 'Potential traffic or pedestrian hazard' },
  { value: 'CRITICAL', label: 'Critical', desc: 'Immediate risk to life or severe property damage' },
];

export const Report: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper: 1: Describe, 2: Locate, 3: Prioritize, 4: Review, 5: Submitted
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [description, setDescription] = useState('');

  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const [priority, setPriority] = useState('MEDIUM');
  const [frequency, setFrequency] = useState('Not sure');
  const [affectedCount, setAffectedCount] = useState('Not sure');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status & Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedIssue, setSubmittedIssue] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Browser Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setLocation(`GPS: ${lat}, ${lng} (Near current coordinates)`);
        setGeoLoading(false);
        if (errors.location) {
          setErrors((prev) => {
            const n = { ...prev };
            delete n.location;
            return n;
          });
        }
      },
      (_err) => {
        setGeoLoading(false);
        alert('Location access denied. Please enter the address manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const err: { [key: string]: string } = {};
    if (!title.trim()) err.title = 'Issue title is required.';
    else if (title.trim().length < 5) err.title = 'Title must be at least 5 characters.';
    if (!description.trim()) err.description = 'Please describe the problem.';
    else if (description.trim().length < 15) err.description = 'Please provide at least 15 characters of detail.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const err: { [key: string]: string } = {};
    if (!location.trim()) err.location = 'Specific location or address is required.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((s) => Math.min(5, s + 1) as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(1, s - 1) as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting || submittedIssue) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const res = await issueService.create({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        priority,
        frequency,
        affectedCount,
        landmark: landmark.trim() || undefined,
        imageUrl: imagePreview || undefined,
      });

      if (!res.success || !res.issue) {
        throw new Error('The report could not be saved. Please try again.');
      }

      setSubmittedIssue(res.issue);
      setCurrentStep(5);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to submit report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyId = () => {
    if (!submittedIssue) return;
    navigator.clipboard.writeText(submittedIssue.reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-28 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="space-y-3 mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Issue reporting
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              Report an Issue
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Describe a local infrastructure problem and submit it to your FixNear account.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          {currentStep < 5 && (
            <div className="mb-10 pb-6 border-b border-slate-200/80 dark:border-slate-800">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-xs font-mono">
                {[
                  { step: 1, label: '01 Describe' },
                  { step: 2, label: '02 Locate' },
                  { step: 3, label: '03 Prioritize' },
                  { step: 4, label: '04 Review' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`pb-2 border-b-2 transition-all ${
                      currentStep === s.step
                        ? 'border-indigo-600 dark:border-indigo-400 text-slate-950 dark:text-white font-bold'
                        : currentStep > s.step
                        ? 'border-slate-900 dark:border-slate-300 text-slate-700 dark:text-slate-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 shadow-sm shadow-slate-950/5">
            <AnimatePresence mode="wait">
              {/* STEP 1: DESCRIBE */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">01 · Describe the Issue</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      What is damaged or causing an issue in your neighborhood?
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      <span>Issue Title *</span>
                      <span className="font-mono text-slate-400 font-normal">{title.length}/80</span>
                    </div>
                    <input
                      type="text"
                      maxLength={80}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Broken streetlight near Main Gate"
                      className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                    />
                    {errors.title && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <Layers className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      <span>Detailed Description *</span>
                      <span className="font-mono text-slate-400 font-normal">{description.length}/500</span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain what is broken, how long it has been in this state, and how it impacts people walking or driving..."
                      className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center gap-2"
                    >
                      Next: Locate Problem
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LOCATE */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">02 · Locate the Problem</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Pinpoint the exact street, crossroads, or park landmark so repair teams can find it.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Location / Address Reference *
                      </label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={geoLoading}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <Navigation className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
                        {geoLoading ? 'Acquiring GPS...' : 'Use Browser GPS'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Market Road, opposite Bus Depot"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.location && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Nearest Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opposite Central Park Gate 2"
                      className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-white shadow-sm shadow-slate-950/5 transition-colors"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center gap-2"
                    >
                      Next: Prioritize
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PRIORITIZE & EVIDENCE */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">03 · Prioritize &amp; Evidence</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Assess the urgency and attach an optional photo for field verification.
                    </p>
                  </div>

                  {/* Priority Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Severity Priority Level *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            priority === p.value
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold block">{p.label}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                            {p.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="report-frequency" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Issue Frequency
                      </label>
                      <select
                        id="report-frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none text-slate-900 dark:text-white"
                      >
                        <option value="Not sure">Not sure</option>
                        <option value="Continuous">Continuous (Always broken)</option>
                        <option value="Intermittent">Intermittent (Flickers/Fluctuates)</option>
                        <option value="During Rain">During Rain / Weather</option>
                        <option value="Night Only">Night Time Only</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="report-affected-count" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Approx. People Affected
                      </label>
                      <select
                        id="report-affected-count"
                        value={affectedCount}
                        onChange={(e) => setAffectedCount(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none text-slate-900 dark:text-white"
                      >
                        <option value="Not sure">Not sure</option>
                        <option value="A few neighbors">A few neighbors (1-5)</option>
                        <option value="Dozens of residents">Dozens of residents (10-50)</option>
                        <option value="Entire block / street">Entire block / street (100+)</option>
                        <option value="All commuters on main artery">All commuters on main road</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Photographic Evidence (Optional)
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {!imagePreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-2xl p-6 text-center transition-all group"
                      >
                        <Upload className="w-5 h-5 mx-auto text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-2">
                          Attach photograph of defect
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          PNG or JPG under 2MB
                        </span>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs">
                        <img
                          src={imagePreview}
                          alt="Evidence preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1.5 bg-slate-950/80 text-white rounded-full hover:bg-slate-950"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center gap-2"
                    >
                      Next: Review Summary
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">04 · Review Summary</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Check your details before saving the report.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Issue Title</span>
                      <span className="text-lg font-bold text-slate-950 dark:text-white">{title}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase block">Category</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{category}</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase block">Priority</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{priority}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Location</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{location}</span>
                      {landmark && (
                        <span className="text-slate-500 text-xs block mt-0.5">Landmark: {landmark}</span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                      <span className="text-[11px] font-mono text-slate-400 uppercase block">Description</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-500">
                      <div>
                        <span className="font-mono text-[10px] uppercase block">Frequency:</span>
                        <span>{frequency}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase block">Impact:</span>
                        <span>{affectedCount}</span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submitError}
                    </p>
                  )}

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to edit
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving report...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Submit Civic Report
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: VISUALLY STRONG CONFIRMATION */}
              {currentStep === 5 && submittedIssue && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      REPORT SUBMITTED
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-950 dark:text-white">
                      Your report has been saved.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Keep your report ID to look up its current status and updates.
                    </p>
                  </div>

                  {/* Highlighted Animated Report ID Box */}
                  <motion.div
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="p-6 bg-slate-50 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg mx-auto space-y-4 shadow-sm shadow-slate-950/5"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-750">
                      <div className="text-left">
                        <span className="text-[11px] font-mono text-slate-400 uppercase block">
                          Report ID
                        </span>
                        <span className="text-2xl font-mono font-bold text-slate-950 dark:text-white">
                          {submittedIssue.reportId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={copyId}
                        className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            Copy ID
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-left text-xs space-y-1">
                      <div className="font-bold text-slate-950 dark:text-white text-sm">
                        {submittedIssue.title}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>{submittedIssue.location}</span>
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                          {submittedIssue.priority} PRIORITY
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to={`/track?id=${submittedIssue.reportId}`}
                      className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm shadow-indigo-950/10 inline-flex items-center justify-center gap-2"
                    >
                      Track Issue
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/my-reports"
                      className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm shadow-slate-950/5"
                    >
                      View My Reports
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
