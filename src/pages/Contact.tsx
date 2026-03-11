import React from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { cn } from '../types';

export default function Contact() {
  const faqs = [
    {
      question: "How do I download products?",
      answer: "After purchasing (or for free products), you can download directly from your dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We're integrating payment solutions. Currently, all products are available for free."
    },
    {
      question: "Can I request a refund?",
      answer: "Digital products are non-refundable, but contact us at hello.dangmoon@gmail.com for any issues."
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Get in <span className="text-brand-accent">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-muted max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, feedback, or partnership inquiry? We'd love to hear from you. Our team is ready to help.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-3xl space-y-8 border-brand-accent/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Send us a Message</h2>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Name</label>
                  <input 
                    type="text" 
                    placeholder="Your name"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Email</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    className="w-full bg-brand-bg border border-brand-accent/50 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-muted">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors resize-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Mail, title: 'Email', value: 'hello.dangmoon@gmail.com' },
              { icon: MapPin, title: 'Location', value: 'Pan India (Remote-first)' },
              { icon: Clock, title: 'Response Time', value: '24-72 business hours' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-6 rounded-2xl flex items-center gap-5 border-white/5"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent flex-shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-brand-muted">{item.title}</h3>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 rounded-3xl space-y-8 border-white/5"
          >
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="font-bold text-lg">{faq.question}</h3>
                  <p className="text-brand-muted leading-relaxed">
                    {faq.answer.includes('hello.dangmoon@gmail.com') ? (
                      <>
                        Digital products are non-refundable, but contact us at <span className="text-brand-accent">hello.dangmoon@gmail.com</span> for any issues.
                      </>
                    ) : faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
