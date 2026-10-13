import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  FileEdit,
  MapPin,
  Save,
  Search,
  Camera,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Identify a Problem',
      headline: 'Notice maintenance hazards in your everyday routine.',
      description:
        'Walk through your neighborhood and notice issues that compromise safety or community comfort: broken streetlights, cracked road surfaces, leaking drainage conduits, or overflowing waste bins.',
      icon: Eye,
      tip: 'Take note of visible landmarks and whether the issue is intermittent or continuous.',
    },
    {
      num: '02',
      title: 'Create a Report',
      headline: 'Open FixNear directly in your mobile or desktop browser.',
      description:
        'No registration walls or password setups. Simply click "Report an Issue" to launch the lightweight submission form.',
      icon: FileEdit,
      tip: 'Keep the issue title brief, clear, and descriptive (e.g. "Burned-out bulb at East crosswalk").',
    },
    {
      num: '03',
      title: 'Add Location & Details',
      headline: 'Pinpoint where the problem is located.',
      description:
        'Describe the exact street, crossroad, or park landmark. Select the priority and attach a photograph directly from your phone’s camera or gallery if you have one.',
      icon: MapPin,
      tip: 'Clear landmark descriptions ensure field teams locate the defect immediately without repeated inquiries.',
    },
    {
      num: '04',
      title: 'Save to Database',
      headline: 'Instant generation of your permanent ticket code.',
      description:
        'Upon submitting, FixNear immediately generates a standardized verification code (e.g. FX-20261002-4821) and saves the report into MongoDB Atlas.',
      icon: Save,
      tip: 'Copy the report ID to your clipboard or keep it in My Reports for one-click reference.',
    },
    {
      num: '05',
      title: 'Track the Report',
      headline: 'Monitor status across the municipal lifecycle.',
      description:
        'Enter your code into the Track page anytime to see whether your report is Under Review, Verified, Assigned to crews, In Progress, or Resolved.',
      icon: Search,
      tip: 'Reports persist in the cloud database across devices and browser sessions.',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Platform Architecture
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-950 dark:text-white">
              How It Works
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              FixNear strips away bureaucratic friction. A step-by-step walkthrough of how everyday
              citizens report, catalog, and track neighborhood problems.
            </p>
          </div>

          {/* 5 Sequential Steps */}
          <div className="space-y-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shadow-slate-950/5 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Step Number + Icon */}
                  <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-start gap-4">
                    <span className="text-4xl sm:text-5xl font-bold font-display text-indigo-600 dark:text-indigo-400 tracking-tight">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Step Description */}
                  <div className="lg:col-span-6 space-y-3">
                    <h3 className="text-2xl font-bold font-display text-slate-950 dark:text-white">
                      {step.title}
                    </h3>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      {step.headline}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Practical Field Tip */}
                  <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                      Reporting Best Practice
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.tip}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Guidelines Bento Box */}
          <div className="mt-20 pt-16 border-t border-slate-200/80 dark:border-slate-800">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white mb-8">
              What makes an effective civic report?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-3 shadow-sm shadow-slate-950/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white">Clear Visual Evidence</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Capture both a close-up of the damaged element and a wider framing shot that shows
                  surrounding buildings or street landmarks.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-3 shadow-sm shadow-slate-950/5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white">Precise Geotags &amp; Landmarks</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  "Outside Gate 3" or "Opposite Block 12 Bakery" is vastly more actionable than
                  generic neighborhood names.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-3 shadow-sm shadow-slate-950/5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white">Objective Priority</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Reserve "Critical" for severe hazards like deep road sinkholes, exposed electrical
                  wires, or blocked emergency access ways.
                </p>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="mt-12 text-center pt-8">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-950/10"
              >
                Ready to submit a report?
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
