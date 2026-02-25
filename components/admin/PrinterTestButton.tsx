'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Printer, Search, Loader2, BookOpen, CheckCircle2, XCircle } from 'lucide-react';

export default function PrinterTestButton() {
  const [testing, setTesting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [printerStatus, setPrinterStatus] = useState<{
    enabled: boolean;
    connected: boolean;
    interface: string;
  } | null>(null);

  const checkPrinterStatus = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/printer/status');
      const data = await response.json();
      
      setPrinterStatus(data);
      
      if (data.connected) {
        toast.success('✅ Imprimante connectée !');
      } else if (!data.enabled) {
        toast.error('❌ Impression désactivée dans la configuration');
      } else {
        toast.error('❌ Impossible de se connecter à l\'imprimante');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error('Erreur lors de la vérification');
    } finally {
      setChecking(false);
    }
  };

  const printTest = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/printer/test', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('✅ Ticket de test envoyé à l\'imprimante !');
      } else {
        toast.error(`❌ ${data.error || 'Erreur lors de l\'impression'}`);
      }
    } catch (error) {
      console.error('Erreur lors du test d\'impression:', error);
      toast.error('Erreur lors du test d\'impression');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="inline-flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Test d&apos;imprimante
          </span>
        </h2>
        <p className="text-sm text-black mt-1">
          Testez votre imprimante thermique Epson WiFi
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Statut de l'imprimante */}
        {printerStatus && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Impression activée:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                printerStatus.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className="inline-flex items-center gap-1">
                  {printerStatus.enabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {printerStatus.enabled ? 'Oui' : 'Non'}
                </span>
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Imprimante connectée:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                printerStatus.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className="inline-flex items-center gap-1">
                  {printerStatus.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {printerStatus.connected ? 'Oui' : 'Non'}
                </span>
              </span>
            </div>
            
            {printerStatus.interface && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">Interface:</span>
                <span className="text-sm text-black font-mono">
                  {printerStatus.interface}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={checkPrinterStatus}
            disabled={checking}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {checking ? 'Vérification...' : 'Vérifier le statut'}
            </span>
          </button>

          <button
            onClick={printTest}
            disabled={testing}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              {testing ? 'Impression...' : 'Imprimer un test'}
            </span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Instructions
            </span>
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cliquez sur "Vérifier le statut" pour tester la connexion</li>
            <li>• Cliquez sur "Imprimer un test" pour imprimer un ticket de test</li>
            <li>• Assurez-vous que l'imprimante est allumée et connectée au WiFi</li>
            <li>• Consultez le guide complet dans <code className="bg-blue-100 px-1 rounded">docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
