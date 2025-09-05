import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-government-blue dark:bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">UrbanReport</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Building smarter cities through citizen engagement. Report issues, earn rewards, 
              and help make your community better.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="bg-gray-800 hover:bg-gray-700">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="/report" className="text-gray-400 hover:text-white transition-colors duration-200">Report Issue</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">Dashboard</a></li>
              <li><a href="/rewards" className="text-gray-400 hover:text-white transition-colors duration-200">Rewards</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">contact@urbanreport.gov</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 UrbanReport Platform. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}