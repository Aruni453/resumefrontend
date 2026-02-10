import React from 'react'
import { Link } from 'react-router-dom'
import { landingPageStyles } from '../assets/dummystyle'

function LandingPage() {

  return (
    <div className={landingPageStyles.container}>
        {/* Header */}
        <header className={landingPageStyles.header}>
          <div className={landingPageStyles.headerContainer}>
            <div className={landingPageStyles.logoContainer}>
              <div className={landingPageStyles.logoIcon}>
                <span className={landingPageStyles.logoText}>R</span>
              </div>
              <span className={landingPageStyles.logoText}>Resumexport</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-bold">
                Sign In
              </Link>
              <Link to="/signup" className={landingPageStyles.primaryButton}>
                <span className={landingPageStyles.primaryButtonContent}>
                  Get Started
                  <svg className={landingPageStyles.primaryButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>
            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                <span>✨</span>
                <span>Create Professional Resumes in Minutes</span>
              </div>

              <h1 className={landingPageStyles.heading}>
                <span className={landingPageStyles.headingText}>Build Your</span>
                <span className={landingPageStyles.headingGradient}>Dream Career</span>
                <span className={landingPageStyles.headingText}>with</span>
                <span className={landingPageStyles.headingText}>Stunning Resumes</span>
              </h1>

              <p className={landingPageStyles.description}>
                Create professional, ATS-friendly resumes with our intuitive builder.
                Choose from multiple templates, customize your content, and download
                high-quality PDFs that get you noticed by employers.
              </p>

              <div className={landingPageStyles.ctaButtons}>
                <Link to="/signup" className={landingPageStyles.primaryButton}>
                  <span className={landingPageStyles.primaryButtonContent}>
                    Start Building Free
                    <svg className={landingPageStyles.primaryButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <button className={landingPageStyles.secondaryButton}>
                  Watch Demo
                </button>
              </div>


            </div>

            <div className={landingPageStyles.heroIllustration}>
              <div className={landingPageStyles.heroIllustrationBg}></div>
              <div className={landingPageStyles.heroIllustrationContainer}>
                <svg className={landingPageStyles.svgContainer} viewBox="0 0 400 500">
                  <defs>
                    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f3f4f6" />
                      <stop offset="100%" stopColor="#e5e7eb" />
                    </linearGradient>
                  </defs>

                  {/* Resume Card */}
                  <rect x="50" y="100" width="300" height="350" rx="20" className={landingPageStyles.svgRect} />

                  {/* Header */}
                  <rect x="70" y="130" width="80" height="80" rx="40" fill="#8b5cf6" />
                  <rect x="170" y="140" width="120" height="12" rx="6" fill="#e2e8f0" />
                  <rect x="170" y="160" width="80" height="8" rx="4" fill="#e2e8f0" />

                  {/* Content */}
                  <rect x="70" y="240" width="200" height="8" rx="4" fill="#e2e8f0" />
                  <rect x="70" y="260" width="150" height="8" rx="4" fill="#e2e8f0" />
                  <rect x="70" y="280" width="180" height="8" rx="4" fill="#e2e8f0" />

                  {/* Skills */}
                  <rect x="70" y="320" width="60" height="20" rx="10" fill="#ddd6fe" />
                  <rect x="140" y="320" width="50" height="20" rx="10" fill="#ddd6fe" />
                  <rect x="200" y="320" width="70" height="20" rx="10" fill="#ddd6fe" />

                  {/* Animated elements */}
                  <circle cx="100" cy="170" r="8" className={landingPageStyles.svgAnimatedCircle} />
                  <rect x="280" y="350" width="40" height="6" rx="3" className={landingPageStyles.svgAnimatedRect} />
                  <polygon points="320,380 330,370 340,380" className={landingPageStyles.svgAnimatedPolygon} />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                <span className={landingPageStyles.featuresTitleGradient}>Everything you need</span>
                <span>to create amazing resumes</span>
              </h2>
              <p className={landingPageStyles.featuresDescription}>
                Our comprehensive resume builder includes all the tools and features you need
                to create professional resumes that stand out from the competition.
              </p>
            </div>

            <div className={landingPageStyles.featuresGrid}>
              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div className={landingPageStyles.featureCardContent}>
                  <div className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconViolet}`}>
                    <svg className={landingPageStyles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>ATS-Friendly Templates</h3>
                  <p className={landingPageStyles.featureDescription}>
                    Our templates are designed to pass Applicant Tracking Systems,
                    ensuring your resume gets seen by hiring managers.
                  </p>
                </div>
              </div>

              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div className={landingPageStyles.featureCardContent}>
                  <div className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconFuchsia}`}>
                    <svg className={landingPageStyles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>Lightning Fast</h3>
                  <p className={landingPageStyles.featureDescription}>
                    Create professional resumes in minutes with our intuitive
                    drag-and-drop interface and smart suggestions.
                  </p>
                </div>
              </div>

              <div className={landingPageStyles.featureCard}>
                <div className={landingPageStyles.featureCardHover}></div>
                <div className={landingPageStyles.featureCardContent}>
                  <div className={`${landingPageStyles.featureIconContainer} ${landingPageStyles.featureIconOrange}`}>
                    <svg className={landingPageStyles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={landingPageStyles.featureTitle}>Professional Templates</h3>
                  <p className={landingPageStyles.featureDescription}>
                    Choose from dozens of professionally designed templates
                    for every industry and career level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={landingPageStyles.ctaSection}>
          <div className={landingPageStyles.ctaContainer}>
            <div className={landingPageStyles.ctaCard}>
              <div className={landingPageStyles.ctaCardBg}></div>
              <div className={landingPageStyles.ctaCardContent}>
                <h2 className={landingPageStyles.ctaTitle}>
                  <span className={landingPageStyles.ctaTitleGradient}>Ready to build</span>
                  <span>your dream resume?</span>
                </h2>
                <p className={landingPageStyles.ctaDescription}>
                  Join thousands of professionals who have landed their dream jobs
                  with resumes created on Resumexport.
                </p>
                <Link to="/signup" className={landingPageStyles.ctaButton}>
                  <span className={landingPageStyles.ctaButtonText}>Get Started Now</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={landingPageStyles.footer}>
          <div className={landingPageStyles.footerContainer}>
            <div className="flex items-center justify-center gap-4">
              <div className={landingPageStyles.logoIcon}>
                <span className={landingPageStyles.logoText}>R</span>
              </div>
              <span className={landingPageStyles.logoText}>Resumexport</span>
            </div>
            <p className={landingPageStyles.footerText}>
              © 2026 Resumexport. Made with <span className={landingPageStyles.footerHeart}>❤️</span> for job seekers.
            </p>
          </div>
        </footer>
    </div>
  )
}

export default LandingPage
