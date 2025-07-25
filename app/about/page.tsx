import Layout from "@/components/Layout"
import Link from "next/link"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-6 text-gray-600">
              <p>
                Welcome to Architecture Simple. Established in 2023, we are
a premier architectural services and media-based company
committed to design excellence and innovative practice. Our
team offers extensive experience in both the residential and
commercial sectors, delivering results that embody our
guiding philosophy.

              </p>
              <p>
               At Architecture Simple, we believe architecture is not simply
the act of building but the art of shaping the identity of cities,
towns, and villages. Every structure is an expression of its
climate, culture, and community and our mission is to create
spaces that fulfill our clients’ functional needs while honoring
the distinctive character of the land they occupy. We approach
each commission with meticulous care and a deep respect for
context, history, and sustainability.
              </p>
              <p>
               We are dedicated to producing architectural solutions of
enduring quality; works that transcend fleeting trends and
provide lasting value to the communities they serve. From
revitalizing historic districts to designing contemporary urban
environments or intimate residences, we aim to harmonize
creativity, practicality, and beauty.
              </p>
              <p>
                Discover the difference of working with Architecture Simple.
Let us help realize your architectural vision with our expertise,
passion, and unwavering commitment to quality. Contact us
today to embark on a journey of thoughtful design and
meaningful transformation.

              </p>
              <p className="italic">-CEO Eric Rivera
</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-light mb-8">LICENSED TO PRACTICE IN THE FOLLOWING STATES</h2>
              <div className="space-y-12">
                <div>
                  <h3 className="font-medium mb-2">CALIFORNIA</h3>
                  <p className="text-gray-600">#12938444</p>
                  {/* <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link> */}
                </div>

                <div>
                  <h3 className="font-medium mb-2">FLORIDA</h3>
                  <p className="text-gray-600">#12938444</p>
                  {/* <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link> */}
                </div>

                <div>
                  <h3 className="font-medium mb-2">TEXAS</h3>
                  <p className="text-gray-600">#12938444</p>
                  {/* <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link> */}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Link href="/contact" className="block">
                <button className="w-full py-4 px-8 text-black text-lg font-light tracking-wider uppercase transition-all duration-300 ease-in-out hover:bg-black hover:text-white rounded-md border-2 border-black relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute inset-2 border border-black rounded-md pointer-events-none"></span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="space-y-8 text-center mt-auto">
          <div className="space-y-4">
            <h2 className="text-sm">LICENSED TO PRACTICE IN THE FOLLOWING STATES</h2>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span>CALIFORNIA</span>
              <span className="text-gray-300">.</span>
              <span>FLORIDA</span>
              <span className="text-gray-300">.</span>
              <span>TEXAS</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-sm text-gray-500">Keep it Simple.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
