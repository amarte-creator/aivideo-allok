export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Allok.fun",
    url: "https://allok.fun",
    logo: "https://allok.fun/logo.png",
    description:
      "Allok.fun is an AI-powered creative studio generating high-impact image and video art for brands worldwide.",
    sameAs: ["https://www.instagram.com/allok.fun", "https://www.linkedin.com/company/allok"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-555-555-5555",
        email: "hi@allok.fun",
        contactType: "customer service",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Miami" },
      { "@type": "Place", name: "Los Angeles" },
      { "@type": "Place", name: "New York" },
      { "@type": "Place", name: "Canada" },
      { "@type": "Place", name: "United Kingdom" },
    ],
  }

  return (
    <>
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6 md:px-12 lg:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Allok.fun</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
          Pioneering the future of AI-powered brand content for global brands.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-neutral-900 text-white px-6 md:px-12 lg:px-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "AI Image & Video Art",
              desc: "High-impact visuals generated with cutting-edge AI for social media, ads, and campaigns.",
            },
            {
              title: "Global Reach",
              desc: "Serving Miami, LA, New York, Canada, and the UK with world-class AI-generated content.",
            },
            {
              title: "Cutting-edge AI Technology",
              desc: "Using the latest generative AI models and creative tools.",
            },
            {
              title: "Brand Storytelling",
              desc: "Helping brands communicate their vision through stunning AI-generated visuals.",
            },
            {
              title: "Fast & Scalable",
              desc: "Create unlimited variations and iterations at speed and scale.",
            },
            {
              title: "SEO & Marketing Focus",
              desc: "Optimized content to enhance your visibility on search engines.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="opacity-80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-center text-white px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Brand?</h2>
        <p className="text-lg opacity-80 mb-8">Let Allok.fun bring your brand to life with AI-powered visuals.</p>
        <a
          href="/contact"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-200 transition-all"
        >
          Get in Touch
        </a>
      </section>
    </>
  )
}
