'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OtpVerificationProps {
  email: string;
  prenom: string;
  onVerified: (orderData: any) => void;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export default function OtpVerification({ email, prenom, onVerified, onResend, onBack, isLoading }: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Compte à rebours pour le renvoi
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus sur le premier champ au montage
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Accepter uniquement les chiffres
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);

    // Avancer automatiquement au champ suivant
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si tous les champs sont remplis, soumettre automatiquement
    if (digit && index === 5) {
      const fullCode = [...newDigits.slice(0, 5), digit].join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Permettre la navigation avec les flèches
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeOverride?: string) => {
    const code = codeOverride || digits.join('');
    if (code.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code.');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code }),
      });
      const result = await response.json();

      if (result.success) {
        onVerified(result.orderData);
      } else {
        setError(result.error || 'Code incorrect.');
        // Vider les champs en cas d'erreur
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError(null);
    try {
      await onResend();
      setResendCooldown(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Impossible de renvoyer le code. Veuillez réessayer.");
    } finally {
      setResendLoading(false);
    }
  };

  const isComplete = digits.every(d => d !== '');

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black">Vérification de votre email</h2>
        </div>
        <p className="text-black">
          Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
        </p>
      </div>

      <div className="p-6">
        {/* Illustration */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">📧</div>
          <p className="text-black text-sm">
            Bonjour <strong>{prenom}</strong>, vérifiez votre boîte mail<br />
            et entrez le code reçu ci-dessous.
          </p>
        </div>

        {/* Champs OTP */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                error
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : digit
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-black focus:border-red-500'
              }`}
              disabled={verifying || isLoading}
            />
          ))}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info expiration */}
        <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <p className="text-sm text-orange-700">
            ⏱️ Ce code est valable <strong>10 minutes</strong>
          </p>
        </div>

        {/* Bouton vérifier */}
        <button
          onClick={() => handleVerify()}
          disabled={!isComplete || verifying || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
            isComplete && !verifying && !isLoading
              ? 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {verifying || isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Vérification en cours...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Confirmer ma commande</span>
            </>
          )}
        </button>

        {/* Renvoi du code + retour */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="text-sm text-black hover:text-red-600 transition-colors flex items-center space-x-1"
            disabled={verifying || isLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Modifier mes informations</span>
          </button>

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendLoading || verifying}
            className={`text-sm transition-colors ${
              resendCooldown > 0 || resendLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:text-red-800 font-medium'
            }`}
          >
            {resendLoading ? (
              'Envoi...'
            ) : resendCooldown > 0 ? (
              `Renvoyer le code (${resendCooldown}s)`
            ) : (
              'Renvoyer le code'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
