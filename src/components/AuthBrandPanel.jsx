import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export function AuthBrandPanel({ heading, subheading }) {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-between bg-auth-gradient p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="OneVishwam Logo" className="h-10 w-auto object-contain filter brightness-0 invert transition-transform group-hover:scale-105" />
        </Link>
      </div>

      <div className="relative z-10 max-w-md">
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
          {heading}
        </h1>
        <p className="text-lg text-white/80 animate-fade-in-up delay-100">
          {subheading}
        </p>
      </div>

      <div className="relative z-10 flex gap-4 text-sm text-white/60 font-medium">
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Help
        </a>
      </div>
    </div>
  );
}