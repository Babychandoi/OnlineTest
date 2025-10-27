import { BookOpen, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function FooterDemo() {
  const handleNavigation = (path: string) => {
    console.log(`Navigate to: ${path}`);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Footer - Fixed at bottom */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Logo Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>   
                  <h1 className="text-lg font-bold">OT</h1>
                  <p className="text-xs text-gray-400">ONLINE TEST</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Nền tảng học tập thông minh, nơi mọi người luyện tập ôn luyện cho các kì thi quan trọng.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.396 3.635 1.363c-.967.967-1.232 2.14-1.291 3.417C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.277.324 2.45 1.291 3.417.967.967 2.14 1.232 3.417 1.291C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.059 2.45-.324 3.417-1.291.967-.967 1.232-2.14 1.291-3.417.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.059-1.277-.324-2.45-1.291-3.417-.967-.967-2.14-1.232-3.417-1.291C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">lienhe@onlinetest.com</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">0868.490.940</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">Tả thanh Oai, Thanh Trì, Hà Nội, Việt Nam</span>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Đăng ký nhận tin</h4>
                <div className="flex">
                  <input
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-sm"
                    type="email"
                  />
                  <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">© 2025 TECHBYTE. Tất cả quyền được bảo lưu.</div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button onClick={() => handleNavigation('/terms')} className="text-gray-400 hover:text-white text-sm transition-colors">Điều khoản sử dụng</button>
                <button onClick={() => handleNavigation('/privacy')} className="text-gray-400 hover:text-white text-sm transition-colors">Chính sách bảo mật</button>
                <button onClick={() => handleNavigation('/support')} className="text-gray-400 hover:text-white text-sm transition-colors">Hỗ trợ</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}