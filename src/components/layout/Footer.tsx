import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 md:py-16 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-fg" />
              <span className="font-heading font-bold text-lg tracking-tight">CODEYE</span>
            </div>
            <p className="text-muted-fg text-sm mb-6">
              Your Code. Reviewed by Intelligence. The ultimate AI-powered code review platform.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-fg footer-link">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-fg footer-link">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-fg footer-link">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-fg flex flex-col items-start">
              <li><a href="#" className="footer-link">Features</a></li>
              <li><a href="#" className="footer-link">Pricing</a></li>
              <li><a href="#" className="footer-link">Integrations</a></li>
              <li><a href="#" className="footer-link">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-fg flex flex-col items-start">
              <li><a href="#" className="footer-link">Documentation</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Community</a></li>
              <li><a href="#" className="footer-link">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Subscribe</h4>
            <p className="text-sm text-muted-fg mb-4">Get the latest updates and coding tips.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-bg border border-border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-fg"
              />
              <button type="submit" className="bg-fg text-bg px-4 py-2 rounded-md text-sm font-medium hover-invert border border-fg">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-fg">
          <p>&copy; {new Date().getFullYear()} CODEYE Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
