import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft, Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
  };

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
          className="p-2.5 rounded-xl"
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
          {t('contact.title')}
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
        <div className="max-w-md mx-auto px-5 py-6 pb-12 space-y-5">
          {/* Contact Info Cards */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <Mail className="w-6 h-6" style={{ color: AppColors.forestGreen }} />
            </div>
            <div>
              <p
                className="text-[13px] mb-0.5"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textMuted,
                }}
              >
                Email
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: AppColors.textDark,
                }}
              >
                support@akaziconnect.rw
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <Phone className="w-6 h-6" style={{ color: AppColors.forestGreen }} />
            </div>
            <div>
              <p
                className="text-[13px] mb-0.5"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textMuted,
                }}
              >
                Phone
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: AppColors.textDark,
                }}
              >
                +250 788 000 000
              </p>
            </div>
          </div>

          {/* Message Form */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <h3
              className="mb-3"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: AppColors.textDark,
              }}
            >
              Send us a message
            </h3>

            {sent ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    color: AppColors.textDark,
                    marginBottom: '4px',
                  }}
                >
                  Message sent!
                </p>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: AppColors.textMuted,
                  }}
                >
                  We will get back to you soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-5 py-2 rounded-xl"
                  style={{
                    backgroundColor: AppColors.greenBackground,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: AppColors.forestGreen,
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('contact.placeholder')}
                  rows={5}
                  className="w-full p-4 rounded-xl resize-none focus:outline-none mb-4"
                  style={{
                    backgroundColor: AppColors.surfaceLight,
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: AppColors.textDark,
                    border: `1px solid ${AppColors.border}`,
                  }}
                />

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: message.trim()
                      ? AppColors.greenLight
                      : AppColors.textMuted,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    color: AppColors.surfaceWhite,
                    opacity: message.trim() ? 1 : 0.5,
                  }}
                >
                  <Send className="w-4 h-4" />
                  {t('contact.send')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
