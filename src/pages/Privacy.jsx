import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  Globe,
  Mail,
  Calendar,
} from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Information We Collect",
    content:
      "We collect only the information necessary to provide and improve the platform. This may include account information, API configuration, usage statistics, and technical data required for reliable performance.",
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content:
      "Security is a priority. Sensitive information is encrypted where appropriate, access is restricted, and industry-standard security practices are followed to help protect your information.",
  },
  {
    icon: Database,
    title: "Data Storage",
    content:
      "Your information is stored securely and retained only for as long as necessary to operate the service, comply with legal obligations, or improve platform functionality.",
  },
  {
    icon: Eye,
    title: "Privacy & Transparency",
    content:
      "We do not sell your personal information. Any analytics collected are used solely to improve user experience and platform performance.",
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    content:
      "The platform may integrate with external AI providers or third-party APIs. Their respective privacy policies govern how they process any information you choose to share with them.",
  },
  {
    icon: Mail,
    title: "Contact",
    content:
      "If you have questions regarding this Privacy Policy or your data, please contact our team through the official project repository or support channels.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#06070A] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-400/20 mb-6">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-slate-300">
              Privacy & Data Protection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold">
            Privacy <span className="text-cyan-400">Policy</span>
          </h1>

          <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-400 leading-8">
            Your privacy matters. This page explains what information is
            collected, how it is used, and the measures taken to protect your
            data while using our AI Agents platform.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-10 text-slate-400"
        >
          <Calendar size={18} />
          <span>Last Updated: June 2026</span>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                }}
                className="group rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 backdrop-blur-xl p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Icon className="text-cyan-400" size={28} />
                </div>

                <h2 className="text-2xl font-semibold mb-4">
                  {section.title}
                </h2>

                <p className="text-slate-400 leading-8">
                  {section.content}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-10 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Your Trust Comes First
          </h2>

          <p className="text-slate-400 max-w-3xl mx-auto leading-8">
            We are committed to building an open-source AI ecosystem that values
            transparency, security, and user control. As the platform evolves,
            this Privacy Policy may be updated to reflect new features or legal
            requirements.
          </p>
        </motion.div>
      </div>
    </div>
  );
}