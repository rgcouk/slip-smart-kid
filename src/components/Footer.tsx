
import React from 'react';
import { FileText, Mail, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-200">
      <div className="container mx-auto section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-xl">Formaslips</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              The easiest way to create professional payslips. Trusted by thousands of businesses and individuals worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors formaslips-button touch-target-48">
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors formaslips-button touch-target-48">
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors formaslips-button touch-target-48">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="#" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors formaslips-button touch-target-48">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Pricing</a></li>
              <li><a href="/features" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Features</a></li>
              <li><a href="/templates" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Templates</a></li>
              <li><a href="/integrations" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Help Center</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Contact Us</a></li>
              <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm formaslips-button">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; 2025 Formaslips. All rights reserved.</p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">Made with ❤️ for modern businesses</p>
        </div>
      </div>
    </footer>
  );
};
