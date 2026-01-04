
import React, { useState } from 'react';
import { SiteSettings } from '../types';

interface ContactProps {
  settings: SiteSettings;
}

const Contact: React.FC<ContactProps> = ({ settings }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you. Your message has been sent to the director.');
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact-section" className="min-h-screen bg-[#000] text-white flex items-center justify-center px-6 md:px-20 py-32">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        
        {/* Left Column: Information */}
        <div className="flex flex-col justify-between">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-serif-cinematic leading-[1.1] font-bold tracking-tight">
                Let's create <br />
                <span className="text-[#c5a059] italic">something visual.</span>
              </h2>
              <div className="pt-6 space-y-1">
                <p className="text-neutral-400 text-sm md:text-base font-light">프로젝트, 협업, 연출 제안 언제든 환영합니다.</p>
                <p className="text-neutral-500 text-sm md:text-base font-light">Open for film productions and creative collaborations.</p>
              </div>
            </div>

            <div className="space-y-6 pt-10">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-[#c5a059] transition-colors duration-500">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${settings.email}`} className="text-sm md:text-base tracking-[0.2em] font-medium uppercase hover:text-[#c5a059] transition-colors">
                  {settings.email.toUpperCase()}
                </a>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-[#c5a059] transition-colors duration-500">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm md:text-base tracking-[0.2em] font-medium">010-8284-6424</span>
              </div>
            </div>
          </div>

          <div className="pt-20 lg:pt-0">
            <div className="w-full h-px bg-neutral-900 mb-12"></div>
            <div className="space-y-6">
              <h4 className="text-[10px] tracking-[0.4em] text-neutral-600 uppercase font-bold">Representation</h4>
              <div className="space-y-2">
                <p className="text-sm text-neutral-400 font-light">경기도 의왕시 내손중앙7길 36 402호</p>
                <p className="text-sm text-neutral-500 font-light lowercase">{settings.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase font-bold">Name</label>
              <input 
                type="text" 
                required
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                className="w-full bg-[#0a0a0a] border-none focus:ring-0 p-5 text-sm font-light text-neutral-300 placeholder-neutral-800"
                placeholder="YOUR NAME"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase font-bold">Email</label>
              <input 
                type="email" 
                required
                value={formState.email}
                onChange={e => setFormState({...formState, email: e.target.value})}
                className="w-full bg-[#0a0a0a] border-none focus:ring-0 p-5 text-sm font-light text-neutral-300 placeholder-neutral-800"
                placeholder="YOUR EMAIL"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase font-bold">Message</label>
              <textarea 
                required
                rows={6}
                value={formState.message}
                onChange={e => setFormState({...formState, message: e.target.value})}
                className="w-full bg-[#0a0a0a] border-none focus:ring-0 p-5 text-sm font-light text-neutral-300 placeholder-neutral-800 resize-none"
                placeholder="HOW CAN I HELP YOU?"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-6 flex items-center justify-center gap-4 hover:bg-[#c5a059] transition-all duration-500 group"
            >
              <span className="text-[11px] tracking-[0.5em] font-bold uppercase">Send Message</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
