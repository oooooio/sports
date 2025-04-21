import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import HomeCarousel from "@/components/home-carousel"
import PlayerRadarChart from "@/components/player-radar-chart"

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation Bar */}
      <header className="bg-black border-b border-gray-800 fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="font-['Pacifico',_cursive] text-2xl">KEKE LEO</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="#" className="hover:text-gray-300 transition">
              About Us
            </Link>
            <Link href="#" className="hover:text-gray-300 transition">
              News
            </Link>
            <Link href="#" className="hover:text-gray-300 transition">
              Matches
            </Link>
            <Link href="#" className="hover:text-gray-300 transition">
              Players
            </Link>
            <Link href="#" className="hover:text-gray-300 transition">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="rounded-[4px] hover:bg-white hover:text-black">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black rounded-[4px] hover:bg-gray-200">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Carousel */}
      <section className="relative pt-16">
        <HomeCarousel />
      </section>

      {/* Club Overview */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-bold mb-6">Club Overview</h2>
              <p className="text-gray-300 mb-6">
                The Scottish Rugby Club is a rugby club based in Scotland with teams competing at all levels. Currently
                supported by the SRU with age grades. These include teams competing at youth level and senior grades.
              </p>
              <p className="text-gray-300 mb-6">
                Each team is managed by a group of coaches, who are often parents. The club has numerous members
                including non-players and senior players. Members and junior players. All players must register with the
                SRU to ensure they are fully covered by SRU insurance.
              </p>
              <p className="text-gray-300 mb-8">
                Junior members must also sign a consent form each season. Coaches or parents for each age group maintain
                records of all players in that age group, including details of doctors and next of kin/guardians.
              </p>
              <Button variant="outline" className="rounded-[4px] hover:bg-white hover:text-black">
                Learn More
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="h-96 rounded-lg overflow-hidden relative">
                <Image src="/images/club-photo.jpg" alt="Club Photo" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Player Information */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Star Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Player 1 */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                <PlayerRadarChart id="player1-radar" data={[92, 75, 95, 88, 80, 97]} color="rgb(0, 150, 255)" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">James Wilson</h3>
                    <p className="text-gray-400">No.10 · Fly-half</p>
                  </div>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Captain</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Matches</p>
                    <p className="font-semibold">86</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Points</p>
                    <p className="font-semibold">312</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Assists</p>
                    <p className="font-semibold">74</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Interceptions</p>
                    <p className="font-semibold">58</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Player 2 */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                <PlayerRadarChart id="player2-radar" data={[85, 98, 82, 90, 95, 78]} color="rgb(255, 100, 0)" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Liam MacDonald</h3>
                    <p className="text-gray-400">No.8 · Number Eight</p>
                  </div>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Vice Captain</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Matches</p>
                    <p className="font-semibold">92</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Points</p>
                    <p className="font-semibold">156</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Tackles</p>
                    <p className="font-semibold">203</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Carries</p>
                    <p className="font-semibold">187</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Player 3 */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition">
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                <PlayerRadarChart id="player3-radar" data={[97, 68, 85, 92, 88, 82]} color="rgb(100, 255, 0)" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Emma Campbell</h3>
                    <p className="text-gray-400">No.15 · Full-back</p>
                  </div>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">Rookie</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Matches</p>
                    <p className="font-semibold">24</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Points</p>
                    <p className="font-semibold">78</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Clearances</p>
                    <p className="font-semibold">42</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Distance</p>
                    <p className="font-semibold">8.7km/match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="rounded-[4px] px-8 py-3 hover:bg-white hover:text-black">
              View All Players
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition">
              <div className="h-40 mx-auto mb-6 rounded-lg relative overflow-hidden">
                <Image src="/images/training-icon.jpg" alt="Youth Training Program" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Youth Training Program</h3>
              <p className="text-gray-400 mb-6 text-center">
                We provide professional rugby training courses for young people aged 6-18, guided by an experienced
                coaching team to help young players develop comprehensively.
              </p>
              <div className="text-center">
                <Button variant="outline" className="rounded-[4px] hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="bg-black rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition">
              <div className="h-40 mx-auto mb-6 rounded-lg relative overflow-hidden">
                <Image src="/images/coach-icon.jpg" alt="Professional Coaching Team" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Professional Coaching Team</h3>
              <p className="text-gray-400 mb-6 text-center">
                Our coaching team consists of former professional players and experienced coaches, holding SRU
                certification, using scientific training methods to provide personalized guidance for players.
              </p>
              <div className="text-center">
                <Button variant="outline" className="rounded-[4px] hover:bg-white hover:text-black">
                  Meet the Coaches
                </Button>
              </div>
            </div>

            <div className="bg-black rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition">
              <div className="h-40 mx-auto mb-6 rounded-lg relative overflow-hidden">
                <Image src="/images/event-icon.jpg" alt="Match Events Information" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Match Events Information</h3>
              <p className="text-gray-400 mb-6 text-center">
                We organize various competitions and events throughout the year, including friendly matches,
                championships, and community events, providing players with rich practical experience.
              </p>
              <div className="text-center">
                <Button variant="outline" className="rounded-[4px] hover:bg-white hover:text-black">
                  View Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Guide */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="bg-[#1a1a1a] rounded-xl p-12 text-center border border-gray-800">
            <h2 className="text-4xl font-bold mb-6">Join Scottish Rugby Club</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Become a member of our family, experience professional training, participate in exciting matches, and
              pursue the passion of rugby with like-minded partners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/register">
                <Button className="bg-white text-black rounded-[4px] px-8 py-4 text-lg font-semibold hover:bg-gray-200">
                  Register Now
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-[4px] px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-['Pacifico',_cursive] text-2xl mb-4">Scottish Rugby Club</h3>
              <p className="text-gray-400 mb-4">Scottish Rugby Club - Passion, Team, Glory</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Players
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Match Schedule
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    Sponsorship
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <span className="w-5 h-5 mt-1 mr-2 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </span>
                  <span>123 Rugby Road, Edinburgh, Scotland</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mt-1 mr-2 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </span>
                  <span>+44 123 456 7890</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 mt-1 mr-2 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <span>info@scottishrugbyclub.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2023 Scottish Rugby Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
