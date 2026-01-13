
import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ExternalLink, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService.ts';

export const ContactUs: React.FC = () => {
  const [locationInfo, setLocationInfo] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      let lat, lng;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (e) {
        console.log("Geolocation not available or denied");
      }
      
      const info = await geminiService.getLocationInfo(lat, lng);
      setLocationInfo(info);
      setLoading(false);
    };

    fetchLocation();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="display-font text-5xl text-stone-900 mb-4">Contact Us</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Whether you're looking for design advice or have a question about your order, our team is here to help you create your perfect space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Visit Us</h4>
                <address className="text-sm text-stone-500 leading-relaxed not-italic">
                  123 Design Way<br />
                  San Francisco, CA 94103
                </address>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Call Us</h4>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Main: (555) 123-4567<br />
                  Support: (555) 987-6543
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Email Us</h4>
                <p className="text-sm text-stone-500 leading-relaxed">
                  hello@lumina.home<br />
                  design@lumina.home
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Store Hours</h4>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Mon-Sat: 10am - 8pm<br />
                  Sun: 11am - 6pm
                </p>
              </div>
            </div>
          </div>

          <form className="bg-white p-8 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Send us a message</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
                <input type="text" required className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email Address</label>
                <input type="email" required className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-900/10" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Subject</label>
              <select className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-900/10">
                <option>General Inquiry</option>
                <option>Order Status</option>
                <option>Design Assistance</option>
                <option>Wholesale</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Message</label>
              <textarea rows={4} required className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-stone-900/10 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        <div className="flex flex-col h-full">
          <div className="bg-stone-100 rounded-3xl overflow-hidden relative grow min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-stone-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Loading our location...</p>
              </div>
            ) : (
              <div className="w-full h-full p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6 bg-white self-start px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-widest">Flagship Showroom</span>
                </div>
                <div className="grow">
                  <iframe 
                    title="Lumina Showroom Map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    style={{ border: 0, borderRadius: '1rem' }} 
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.API_KEY}&q=Design+District,San+Francisco,CA`} 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-8 space-y-4">
                  <p className="text-sm text-stone-600 leading-relaxed italic">
                    "{locationInfo?.text}"
                  </p>
                  
                  {locationInfo?.links && locationInfo.links.length > 0 && (
                    <div className="pt-4 border-t border-stone-200">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Grounding Sources</p>
                      <div className="flex flex-wrap gap-3">
                        {locationInfo.links.map((chunk: any, i: number) => (
                          chunk.maps && (
                            <a 
                              key={i} 
                              href={chunk.maps.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {chunk.maps.title || 'View on Maps'}
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
