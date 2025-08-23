'use client';

import Navbar from '@/components/navbar';
import { Calendar, CheckCircle, Sparkles, Zap, Users, Database, BarChart3, FileText, Clock } from 'lucide-react';

interface ReleaseNote {
  version: string;
  date: string; // e.g., "August 2025" or "Aug 16, 2025"
  title: string;
  description: string;
  features: string[];
  improvements?: string[];
  bugFixes?: string[];
  type: 'major' | 'minor' | 'patch';
}

const releases: ReleaseNote[] = [
  {
    version: '1.0.0',
    date: 'August 2025',
    title: 'Initial Release',
    description: 'Welcome to TMU Pulse! The ultimate academic planning tool built for TMU students.',
    type: 'major',
    features: [
      'Comprehensive Course Catalogue with advanced filtering',
      'Interactive Degree Planner with drag-and-drop course placement',
      'Transcript Analyzer with automated PDF parsing all done locally',
      'GPA Calculator with term-by-term breakdown',
      'Dashboard with customizable profile',
      'User Login including Google and Email',
      'Dark/Light theme support',
      'Mobile-responsive design',
    ],
    improvements: []
  },
  {
  version: '2.0.0',
  date: 'August 2025',
  title: 'Rate My Prof and Class Times Integration',
  description: 'Professor insights, ratings, and class times are now built directly into TMU Pulse!',
  type: 'major',
  features: [
    'New Professors section added to the Catalogue',
    'Seamless Rate My Prof integration with ratings and written reviews',
    'Courses now display the professors who have taught them',
    'Detailed professor profiles with average rating, difficulty, would-take-again %, and full course history',
    'Class times are now displayed directly in course popups',
  ],
  improvements: [
    'Faster performance when loading course and professor data',
    'Option to securely share data with TMU Pulse to save your degree plan',
    'Added Delete Account option for full account control',
  ]
},
{
  version: '3.0.0',
  date: 'August 2025',
  title: 'Schedule Builder is Here!',
  description: 'Build your perfect schedule with our new Schedule Builder feature!',
  type: 'major',
  features: [
    "Intuitive schedule builder with a clean, streamlined interface",
    "Real-time conflict detection to ensure no overlapping classes",
    "Integrated course catalogue into Schedule Builder for fast, accurate course search and details"
  ],
}
]  

function parseLooseDate(input: string) {
  const needsDay = /^\w+\s+\d{4}$/.test(input);
  return new Date(needsDay ? `${input} 1` : input);
}

function compareVersionsDesc(a: string, b: string) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const ai = pa[i] ?? 0;
    const bi = pb[i] ?? 0;
    if (ai !== bi) return bi - ai; // DESC
  }
  return 0;
}

function compareReleaseDesc(a: ReleaseNote, b: ReleaseNote) {
  const da = parseLooseDate(a.date).getTime();
  const db = parseLooseDate(b.date).getTime();
  if (db !== da) return db - da; // newer date first
  return compareVersionsDesc(a.version, b.version); // tie-break by version
}

const FeatureIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Degree Planner':
      return <Zap className="h-5 w-5 text-blue-500" />;
    case 'Course Catalogue':
      return <Database className="h-5 w-5 text-green-500" />;
    case 'Analytics':
      return <BarChart3 className="h-5 w-5 text-purple-500" />;
    case 'Transcript':
      return <FileText className="h-5 w-5 text-orange-500" />;
    default:
      return <CheckCircle className="h-5 w-5 text-primary" />;
  }
};

const getFeatureIcon = (feature: string) => {
  const f = feature.toLowerCase();
  if (f.includes('planner')) return 'Degree Planner';
  if (f.includes('catalogue') || f.includes('catalog')) return 'Course Catalogue';
  if (f.includes('analytics') || f.includes('gpa')) return 'Analytics';
  if (f.includes('transcript')) return 'Transcript';
  return 'default';
};

export default function ReleasesPage() {
  const sorted = [...releases].sort(compareReleaseDesc);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6 mt-20">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black text-foreground">Release Notes</h1>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted font-medium max-w-2xl mx-auto">
            Stay updated with the latest features, improvements, and bug fixes in TMU Pulse.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

          <div className="space-y-8">
            {sorted.map((release, index) => {
              const isFirst = index === 0;
              const showTail = index !== sorted.length - 1;

              return (
                <div key={release.version} className="relative pl-12">
                  {/* dot */}
                  <div className="absolute left-5 -translate-x-1/2 top-6">
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />
                      {showTail && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-3 h-[calc(100%+2rem)] w-px bg-primary/20 " />
                      )}
                    </div>
                  </div>

                  {/* card */}
                  <div className="bg-card-bg border-2 border-input-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-input-border p-6 relative">
                      {/* latest badge */}
                      {isFirst && (
                        <div className="absolute right-4 top-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow">
                            <Clock className="h-3.5 w-3.5" />
                            Latest
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                          <span className="text-2xl font-black text-white">
                            {release.version.split('.')[0]}.{release.version.split('.')[1]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-2xl font-black text-foreground">
                              {release.title}
                            </h2>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                release.type === 'major'
                                  ? 'bg-primary/20 text-primary border border-primary/30'
                                  : release.type === 'minor'
                                  ? 'bg-accent/20 text-accent border border-accent/30'
                                  : 'bg-success/20 text-success border border-success/30'
                              }`}
                            >
                              {release.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{release.date}</span>
                            <span className="font-mono text-sm">v{release.version}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground font-medium leading-relaxed">
                        {release.description}
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {!!release.features?.length && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-bold text-foreground">New Features</h3>
                          </div>
                          <div className="grid gap-3">
                            {release.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors duration-200"
                              >
                                <FeatureIcon type={getFeatureIcon(feature)} />
                                <span className="text-foreground font-medium leading-relaxed">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!!release.improvements?.length && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Zap className="h-5 w-5 text-accent" />
                            <h3 className="text-xl font-bold text-foreground">Improvements</h3>
                          </div>
                          <div className="grid gap-3">
                            {release.improvements.map((improvement, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors duration-200"
                              >
                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                <span className="text-foreground font-medium leading-relaxed">
                                  {improvement}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!!release.bugFixes?.length && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <h3 className="text-xl font-bold text-foreground">Bug Fixes</h3>
                          </div>
                          <div className="grid gap-3">
                            {release.bugFixes.map((fix, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors duration-200"
                              >
                                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                <span className="text-foreground font-medium leading-relaxed">
                                  {fix}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Stay Connected</h3>
            </div>
            <p className="text-muted font-medium mb-6 max-w-2xl mx-auto">
              Have suggestions for new features or found a bug? We&apos;d love to hear from you!
              TMU Pulse is continuously evolving based on student feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/feedback"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Share Feedback
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
