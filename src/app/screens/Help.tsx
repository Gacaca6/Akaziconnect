import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I apply for a job?',
    a: 'Swipe right on any job card in the feed to apply. Our AI will write a personalised application based on your profile, which you can edit before sending.',
  },
  {
    q: 'Do I need a CV to use Akazi Connect?',
    a: 'No! Your profile replaces the traditional CV. Just fill in your name, location, skills, and availability during setup — that is all employers need.',
  },
  {
    q: 'How does the AI match score work?',
    a: 'Our AI compares your skills, location, and availability with job requirements. A higher match score means you are a better fit. Scores above 80% are excellent.',
  },
  {
    q: 'Can I use the app without internet?',
    a: 'Yes! Job cards you have already viewed are cached on your device. You can browse them offline, but you will need internet to apply or send messages.',
  },
  {
    q: 'How do I contact an employer?',
    a: 'After your application is accepted, a message thread opens automatically. You can find all conversations in the Messages tab at the bottom of the screen.',
  },
];

export default function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1
          className="text-white"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          Help & Support
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 py-6 pb-12 space-y-3">
          <h2
            className="mb-2"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              color: AppColors.textDark,
            }}
          >
            Frequently Asked Questions
          </h2>

          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span
                  className="pr-3"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: AppColors.textDark,
                  }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0 transition-transform"
                  style={{
                    color: AppColors.textMuted,
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
              {openIndex === i && (
                <div
                  className="px-5 pb-4"
                  style={{
                    borderTop: `1px solid ${AppColors.border}`,
                    paddingTop: '12px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: AppColors.textMuted,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Contact Support Button */}
          <button
            onClick={() => navigate('/contact')}
            className="w-full py-4 rounded-2xl mt-4"
            style={{
              backgroundColor: AppColors.greenLight,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: AppColors.surfaceWhite,
              boxShadow: '0 4px 12px rgba(26, 122, 74, 0.2)',
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
