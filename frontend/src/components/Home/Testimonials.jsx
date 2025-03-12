import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, Quote } from 'lucide-react';
import michaelImage from '../../assets/testo1.jpg';
import sarahImage from '../../assets/testo2.jpg';
import davidImage from '../../assets/testo3.jpg';

const Testimonials = () => {
  const { darkMode } = useTheme();

  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      role: "Professional Runner",
      image: michaelImage, 
      quote: "The quality of running shoes I found here is unmatched. My performance has improved significantly since switching to gear from SportVilla.",
      rating: 5,
      medal: "🏅 Olympic Gold Medalist"
    },
    {
      id: 2,
      name: "Sarah Thompson",
      role: "Basketball Coach",
      image: sarahImage, 
      quote: "As a coach, I always recommend SportVilla to my players. The range of basketball equipment and their durability is exceptional.",
      rating: 5,
      medal: "🏆 National Champion"
    },
    {
      id: 3,
      name: "David Martinez",
      role: "Tennis Professional",
      image: davidImage,
      quote: "The tennis rackets and accessories from SportVilla have been crucial in my journey to becoming a better player. Excellent service!",
      rating: 5,
      medal: "🎾 ATP Tour Player"
    }
  ];

  return (
    <section className={`py-16 ${darkMode ? 'bg-gradient-to-br from-slate-950 to-emerald-950 text-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Champions Trust Us
          </h2>
          <p className={`text-lg ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hear from professional athletes who've elevated their game with our gear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`relative p-8 rounded-2xl transition-transform duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 shadow-blue-900/20' 
                  : 'bg-white shadow-lg'
              }`}
            >
              <div className="absolute -top-4 -left-4">
                <Quote className={`w-8 h-8 ${
                  darkMode ? 'text-blue-400' : 'text-blue-500'
                }`} />
              </div>
              <div className={`absolute -top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
                darkMode 
                  ? 'bg-blue-900/50 text-blue-200' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {testimonial.medal}
              </div>

              <div className="flex flex-col items-center text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-500"
                />
                
                <p className={`mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "{testimonial.quote}"
                </p>

                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>

                <h3 className={`font-bold text-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {testimonial.name}
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}>
            Join the Champions
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
