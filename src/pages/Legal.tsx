import React from 'react';

type LegalType = 'terms' | 'privacy' | 'refund' | 'disclaimer';

export default function LegalPage({ type }: { type: LegalType }) {
  const content = {
    terms: {
      title: 'Terms & Conditions',
      effectiveDate: '1 February 2026',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: 'By using Dangmoon, you confirm acceptance of these Terms & Conditions.'
        },
        {
          title: 'Digital Products',
          content: 'Dangmoon offers digital products including AI tools, AI prompts, automation resources, developer tools, code templates, APIs, UI/UX assets, creative resources, educational materials, and documentation. All products are delivered digitally.'
        },
        {
          title: 'Usage Rights',
          content: 'Products are licensed for personal or internal business use only. Resale, redistribution, sublicensing, or sharing is strictly prohibited.'
        },
        {
          title: 'Account Responsibility',
          content: 'Users are responsible for maintaining account security and all activities performed under their account.'
        },
        {
          title: 'Payments and Access',
          content: 'Payments are processed via third-party gateways. Access to products is granted after successful payment.'
        },
        {
          title: 'Intellectual Property',
          content: 'All content and digital assets are owned by Dangmoon or its licensors and protected by intellectual property laws.'
        },
        {
          title: 'Limitation of Liability',
          content: 'Dangmoon is not liable for indirect, incidental, or consequential damages resulting from product use.'
        },
        {
          title: 'Termination',
          content: 'Dangmoon reserves the right to suspend or terminate access for violations of these terms.'
        },
        {
          title: 'Governing Law',
          content: 'These terms are governed by the laws of India.'
        },
        {
          title: 'Contact & Support Policy',
          content: (
            <div className="space-y-4">
              <p>Dangmoon provides customer support through email and online support channels only.</p>
              <div className="space-y-1">
                <p><span className="font-bold">Primary Email:</span> hello.dangmoon@gmail.com</p>
                <p><span className="font-bold">Support Email:</span> customercare.dangmoon@gmail.com</p>
                <p><span className="font-bold">Support Response Time:</span> 24 to 72 business hours.</p>
                <p><span className="font-bold">Business Hours:</span> Monday to Friday, 10:00 AM to 6:00 PM IST (Excluding public holidays)</p>
              </div>
              <p>Dangmoon does not provide phone-based support.</p>
            </div>
          )
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      effectiveDate: '1 February 2026',
      intro: 'Dangmoon ("we," "our," or "us") operates a digital products platform accessible via dangmoon.com. This Privacy Policy explains how we collect, use, store, and protect personal information when you access or use our services.',
      sections: [
        {
          title: 'Information We Collect',
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-bold">Personal Information:</span> Name, email address, and account details when you register or log in, including Google authentication.</li>
              <li><span className="font-bold">Payment Information:</span> Transaction details, payment status, and payment metadata provided by third-party payment processors. We do not store full card or banking details.</li>
              <li><span className="font-bold">Usage Data:</span> IP address, browser type, device information, pages visited, and interaction data.</li>
              <li><span className="font-bold">Communication Data:</span> Information you provide when contacting support.</li>
            </ul>
          )
        },
        {
          title: 'How We Use Information',
          content: 'We use collected data to provide and manage access to digital products, process payments, deliver purchased content, improve platform performance, communicate updates, and ensure platform security and legal compliance.'
        },
        {
          title: 'Cookies and Analytics',
          content: 'Dangmoon uses cookies and analytics tools to maintain login sessions, analyze user behavior, and improve services. Analytics services may be provided by Google and similar providers.'
        },
        {
          title: 'Third-Party Services',
          content: 'Dangmoon uses third-party services including Google, Firebase, and payment gateways. These services process data according to their own privacy policies.'
        },
        {
          title: 'Data Security',
          content: 'We implement reasonable technical and organizational measures to protect user data. However, no online platform can guarantee absolute security.'
        },
        {
          title: 'User Rights',
          content: 'Users may request access, correction, or deletion of personal data, subject to applicable laws.'
        },
        {
          title: 'Contact Information',
          content: (
            <div className="space-y-1">
              <p><span className="font-bold">Email:</span> <span className="text-brand-accent">customercare.dangmoon@gmail.com</span></p>
              <p><span className="font-bold">Alternate Email:</span> <span className="text-brand-accent">hello.dangmoon@gmail.com</span></p>
            </div>
          )
        }
      ]
    },
    refund: {
      title: 'Refund & Return Policy',
      effectiveDate: '1 February 2026',
      sections: [
        {
          title: 'Digital Products Policy',
          content: 'All digital products sold by Dangmoon are non-returnable and non-exchangeable. Due to the nature of digital products, we cannot accept returns once the product has been delivered or downloaded.'
        },
        {
          title: 'Eligible Refund Cases',
          content: (
            <div className="space-y-4">
              <p>Refunds may be considered only in the following cases:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Duplicate payment for the same product.</li>
                <li>Technical failure that prevents access to the purchased product.</li>
                <li>Product significantly different from description (at our discretion).</li>
              </ul>
            </div>
          )
        },
        {
          title: 'Refund Request Timeline',
          content: 'Refund requests must be submitted within 7 days of purchase. Requests made after this period will not be considered.'
        },
        {
          title: 'How to Request a Refund',
          content: (
            <div className="space-y-2">
              <p><span className="font-bold">Email:</span> <span className="text-brand-accent">customercare.dangmoon@gmail.com</span></p>
              <p><span className="font-bold">Alternate Email:</span> <span className="text-brand-accent">hello.dangmoon@gmail.com</span></p>
              <p>Please include your order ID, email address used for purchase, and reason for the refund request.</p>
            </div>
          )
        },
        {
          title: 'Refund Processing',
          content: 'Approved refunds will be processed to the original payment method within 7-14 business days. The exact timing depends on your payment provider.'
        },
        {
          title: 'Contact Us',
          content: (
            <p>If you have any questions about our refund policy, please contact us at <span className="text-brand-accent">hello.dangmoon@gmail.com</span></p>
          )
        }
      ]
    },
    disclaimer: {
      title: 'Disclaimer',
      effectiveDate: '1 February 2026',
      sections: [
        {
          title: 'General Information',
          content: 'All content, tools, and digital products provided by Dangmoon are for educational and informational purposes only. The information provided on this website is not intended to be a substitute for professional advice.'
        },
        {
          title: 'No Guarantees',
          content: 'Dangmoon makes no guarantees regarding income, performance, or results from using our products. Individual results may vary based on various factors including but not limited to effort, experience, and market conditions.'
        },
        {
          title: 'User Responsibility',
          content: 'Users are solely responsible for how they apply the information and tools provided. Dangmoon is not responsible for any outcomes, damages, or losses resulting from product use or misuse.'
        },
        {
          title: 'Third-Party Content',
          content: 'Our website may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of these external sites.'
        },
        {
          title: 'Product Accuracy',
          content: 'While we strive to provide accurate product descriptions and information, we do not warrant that product descriptions or other content on the site is accurate, complete, reliable, current, or error-free.'
        },
        {
          title: 'Limitation of Liability',
          content: 'To the fullest extent permitted by law, Dangmoon shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our products or services.'
        },
        {
          title: 'Changes to This Disclaimer',
          content: 'We reserve the right to update this disclaimer at any time. Changes will be posted on this page with an updated effective date.'
        },
        {
          title: 'Contact',
          content: (
            <p>If you have any questions about this disclaimer, please contact us at <span className="text-brand-accent">hello.dangmoon@gmail.com</span></p>
          )
        }
      ]
    }
  };

  const current = content[type];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-12">
          {current.title.split(' ')[0]} <span className="gradient-text">{current.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        
        <div className="glass-card p-8 md:p-12 rounded-3xl space-y-10 text-brand-muted leading-relaxed">
          <div className="space-y-6">
            <p className="text-sm font-medium">Effective Date: {current.effectiveDate}</p>
            {'intro' in current && (
              <p className="text-lg text-brand-text/90">
                {current.intro}
              </p>
            )}
          </div>

          {current.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-text">{section.title}</h2>
              <div className="text-brand-muted">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
