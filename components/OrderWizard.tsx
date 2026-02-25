'use client';

import React, { useState, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { getCartSubtotal, getCartItemUnitPrice } from '@/lib/pricing';
import MenuSelection from './order/MenuSelection';
import OrderSummary from './order/OrderSummary';
import CustomerInfoForm from './order/CustomerInfoForm';
import OrderConfirmation from './order/OrderConfirmation';
import OtpVerification from './order/OtpVerification';

interface OrderWizardProps {
  mode: 'click-and-collect' | 'delivery';
}

export default function OrderWizard({ mode }: OrderWizardProps) {
  const { state, dispatch } = useOrder();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  // État OTP
  const [otpStep, setOtpStep] = useState(false); // true = afficher l'écran de saisie OTP
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPrenom, setOtpPrenom] = useState('');
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);
  const [otpSendLoading, setOtpSendLoading] = useState(false);

  // Définir le mode de commande au montage du composant
  useEffect(() => {
    dispatch({ type: 'SET_ORDER_MODE', payload: mode });
  }, [mode, dispatch]);

  // Fonction pour passer à l'étape suivante
  const handleNext = () => {
    if (state.currentStep < 3) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrev = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  // Fonction pour confirmer la commande
  const handleConfirmOrder = async (orderData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        dispatch({ type: 'SET_ORDER_NUMBER', payload: result.orderNumber });
        setIsOrderComplete(true);
      } else {
        // Si on a un orderNumber malgré l'erreur, la commande a été enregistrée
        if (result.orderNumber) {
          dispatch({ type: 'SET_ORDER_NUMBER', payload: result.orderNumber });
          setIsOrderComplete(true);
        } else {
          throw new Error(result.error || 'Erreur lors de la création de la commande');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de la commande:', error);
      alert('Erreur lors de la confirmation de la commande. Veuillez réessayer.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Envoi du code OTP
  const handleSendOtp = async (email: string, prenom: string, orderData: any) => {
    setOtpSendLoading(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, prenom, orderData }),
      });
      const result = await response.json();
      if (result.success) {
        setOtpEmail(email);
        setOtpPrenom(prenom);
        setPendingOrderData(orderData);
        setOtpStep(true);
      } else {
        alert(result.error || "Impossible d'envoyer le code. Vérifiez votre email.");
      }
    } catch {
      alert("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setOtpSendLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Après vérification OTP réussie → confirmer la commande
  const handleOtpVerified = async (orderData: any) => {
    await handleConfirmOrder(orderData);
  };

  // Renvoi du code OTP
  const handleResendOtp = async () => {
    await handleSendOtp(otpEmail, otpPrenom, pendingOrderData);
  };

  // Retour depuis l'écran OTP → retour au formulaire
  const handleOtpBack = () => {
    setOtpStep(false);
    setPendingOrderData(null);
  };

  // Fonction pour recommencer une nouvelle commande
  const handleNewOrder = () => {
    dispatch({ type: 'RESET_ORDER' });
    setIsOrderComplete(false);
    setOtpStep(false);
    setPendingOrderData(null);
  };

  // Si la commande est complète, afficher la confirmation
  if (isOrderComplete && state.orderNumber) {
    return (
      <OrderConfirmation 
        orderNumber={state.orderNumber}
        onNewOrder={handleNewOrder}
        mode={mode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec étapes */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black">
                {mode === 'click-and-collect' ? 'Click & Collect' : 'Livraison'}
              </h1>
              <span className="text-sm text-black">
                {otpStep ? 'Vérification email' : `Étape ${state.currentStep} sur 3`}
              </span>
            </div>
            
            {/* Indicateur d'étapes */}
            <div className="hidden sm:flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    step < state.currentStep
                      ? 'text-green-600'
                      : step === state.currentStep
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                      step < state.currentStep
                        ? 'bg-green-100 border-green-600'
                        : step === state.currentStep
                        ? 'bg-red-100 border-red-600'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    {step < state.currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 ${
                        step < state.currentStep ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Étapes en mobile */}
          <div className="sm:hidden mt-4">
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step <= state.currentStep
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  {step < state.currentStep ? '✓' : step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {state.currentStep === 1 && (
              <MenuSelection onNext={handleNext} mode={mode} />
            )}
            
            {state.currentStep === 2 && (
              <OrderSummary 
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            
            {state.currentStep === 3 && !otpStep && (
              <CustomerInfoForm 
                onConfirm={handleConfirmOrder}
                onSendOtp={handleSendOtp}
                onPrev={handlePrev}
                mode={mode}
                isLoading={state.isLoading || otpSendLoading}
              />
            )}

            {state.currentStep === 3 && otpStep && (
              <OtpVerification
                email={otpEmail}
                prenom={otpPrenom}
                onVerified={handleOtpVerified}
                onResend={handleResendOtp}
                onBack={handleOtpBack}
                isLoading={state.isLoading}
              />
            )}
          </div>

          {/* Sidebar avec le panier */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-black mb-4">
                Votre commande
              </h3>
              
              {state.cart.length === 0 ? (
                <p className="text-black text-center py-8">
                  Votre panier est vide
                </p>
              ) : (
                <>
                  {/* Liste des articles */}
                  <div className="space-y-3 mb-4">
                    {state.cart.map((cartItem) => (
                      <div key={cartItem.cartItemId} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black">
                            {cartItem.item.title}
                          </p>
                          <p className="text-xs text-black">
                            {cartItem.quantity} × {getCartItemUnitPrice(cartItem).toFixed(2)}€
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                dispatch({ 
                                  type: 'UPDATE_QUANTITY', 
                                  payload: { 
                                    cartItemId: cartItem.cartItemId, 
                                    quantity: cartItem.quantity - 1 
                                  } 
                                });
                              } else {
                                dispatch({ 
                                  type: 'REMOVE_FROM_CART', 
                                  payload: cartItem.cartItemId
                                });
                              }
                            }}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm hover:bg-red-200"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => {
                              dispatch({ 
                                type: 'UPDATE_QUANTITY', 
                                payload: { 
                                  cartItemId: cartItem.cartItemId, 
                                  quantity: cartItem.quantity + 1 
                                } 
                              });
                            }}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm hover:bg-red-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    {(() => {
                      const subtotal = getCartSubtotal(state.cart);
                      const deliveryFee = mode === 'delivery' ? 2.5 : 0;
                      const total = subtotal + deliveryFee;

                      return (
                        <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-black">Sous-total :</span>
                      <span className="text-sm font-medium text-black">
                        {subtotal.toFixed(2)}€
                      </span>
                    </div>
                    
                    {mode === 'delivery' && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-black">Frais de livraison :</span>
                        <span className="text-sm font-medium text-black">{deliveryFee.toFixed(2)}€</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total :</span>
                      <span className="text-red-600">
                        {total.toFixed(2)}€
                      </span>
                    </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Bouton pour passer à l'étape suivante */}
                  {state.currentStep === 1 && state.cart.length > 0 && (
                    <button
                      onClick={handleNext}
                      className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Continuer ({state.cart.reduce((count, item) => count + item.quantity, 0)} articles)
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 