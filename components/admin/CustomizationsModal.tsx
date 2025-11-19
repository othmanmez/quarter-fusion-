'use client';

import { useState, useEffect } from 'react';

interface CustomizationOption {
  name: string;
  priceExtra: number;
}

interface Customization {
  id?: string;
  name: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TOGGLE';
  required: boolean;
  options: CustomizationOption[];
}

interface CustomizationsModalProps {
  menuId: string;
  menuTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CustomizationsModal({
  menuId,
  menuTitle,
  isOpen,
  onClose,
  onSave
}: CustomizationsModalProps) {
  const [customizations, setCustomizations] = useState<Customization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Customization>({
    name: '',
    type: 'SINGLE_CHOICE',
    required: false,
    options: [{ name: '', priceExtra: 0 }]
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCustomizations();
    }
  }, [isOpen, menuId]);

  const fetchCustomizations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/${menuId}/customizations`);
      const data = await response.json();

      if (data.success) {
        setCustomizations(data.customizations || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: '', priceExtra: 0 }]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, field: keyof CustomizationOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }

    if (formData.options.length === 0 || formData.options.some(opt => !opt.name.trim())) {
      alert('Toutes les options doivent avoir un nom');
      return;
    }

    try {
      const url = editingId
        ? `/api/customizations/${editingId}`
        : `/api/menu/${menuId}/customizations`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        fetchCustomizations();
        resetForm();
        setShowAddForm(false);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (custom: Customization) => {
    setEditingId(custom.id || null);
    setFormData({
      name: custom.name,
      type: custom.type,
      required: custom.required,
      options: [...custom.options]
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;

    try {
      const response = await fetch(`/api/customizations/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchCustomizations();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'SINGLE_CHOICE',
      required: false,
      options: [{ name: '', priceExtra: 0 }]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Personnalisations : {menuTitle}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Configurez les options et suppléments disponibles pour ce plat
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-xs">
              <p className="text-blue-900 font-medium mb-1">💡 Exemples de personnalisations :</p>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Choix unique</strong> : Sauce (Ketchup, Mayo, BBQ), Taille (Petite, Moyenne, Grande)</li>
                <li>• <strong>Choix multiples</strong> : Suppléments (Fromage +1€, Bacon +1.50€, Oignons gratuit)</li>
                <li>• <strong>Oui/Non</strong> : Sans oignons, Sans salade, Extra sauce</li>
              </ul>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Liste des personnalisations existantes */}
            {customizations.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-medium text-gray-900">Personnalisations configurées</h4>
                </div>
                <div className="divide-y">
                  {customizations.map((custom) => (
                    <div key={custom.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium text-gray-900">{custom.name}</h5>
                            {custom.required && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                Obligatoire
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                              {custom.type === 'SINGLE_CHOICE' && 'Choix unique'}
                              {custom.type === 'MULTIPLE_CHOICE' && 'Choix multiples'}
                              {custom.type === 'TOGGLE' && 'Oui/Non'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {custom.options.map((opt, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                • {opt.name}
                                {opt.priceExtra > 0 && (
                                  <span className="text-green-600 font-medium ml-2">
                                    +{opt.priceExtra.toFixed(2)}€
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(custom)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => custom.id && handleDelete(custom.id, custom.name)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modèles rapides */}
            {!showAddForm && customizations.length === 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">🚀 Modèles rapides</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setFormData({
                        name: 'Sauce',
                        type: 'SINGLE_CHOICE',
                        required: false,
                        options: [
                          { name: 'Ketchup', priceExtra: 0 },
                          { name: 'Mayonnaise', priceExtra: 0 },
                          { name: 'BBQ', priceExtra: 0 },
                          { name: 'Sauce blanche', priceExtra: 0 }
                        ]
                      });
                      setShowAddForm(true);
                    }}
                    className="p-3 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-left transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">🍯 Choix de sauce</div>
                    <div className="text-xs text-gray-600">Sauces classiques gratuites</div>
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        name: 'Suppléments',
                        type: 'MULTIPLE_CHOICE',
                        required: false,
                        options: [
                          { name: 'Fromage', priceExtra: 1 },
                          { name: 'Bacon', priceExtra: 1.5 },
                          { name: 'Œuf', priceExtra: 1 },
                          { name: 'Oignons', priceExtra: 0 }
                        ]
                      });
                      setShowAddForm(true);
                    }}
                    className="p-3 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-left transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">➕ Suppléments</div>
                    <div className="text-xs text-gray-600">Ingrédients additionnels</div>
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        name: 'Sans ingrédient',
                        type: 'MULTIPLE_CHOICE',
                        required: false,
                        options: [
                          { name: 'Sans oignons', priceExtra: 0 },
                          { name: 'Sans salade', priceExtra: 0 },
                          { name: 'Sans tomates', priceExtra: 0 }
                        ]
                      });
                      setShowAddForm(true);
                    }}
                    className="p-3 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-left transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">🚫 Retirer ingrédient</div>
                    <div className="text-xs text-gray-600">Options de suppression</div>
                  </button>
                </div>
              </div>
            )}

            {/* Bouton ajouter */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
              >
                + Ajouter une personnalisation personnalisée
              </button>
            )}

            {/* Formulaire d'ajout/modification */}
            {showAddForm && (
              <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">
                    {editingId ? 'Modifier' : 'Nouvelle personnalisation'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Annuler
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la personnalisation *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                      placeholder="Ex: Sauce, Taille, Supplément..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="SINGLE_CHOICE">Choix unique (radio)</option>
                      <option value="MULTIPLE_CHOICE">Choix multiples (checkbox)</option>
                      <option value="TOGGLE">Oui/Non (toggle)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={formData.required}
                    onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                    Obligatoire (le client doit choisir)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options disponibles
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Nom de l'option"
                          required
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={option.priceExtra}
                          onChange={(e) => handleOptionChange(index, 'priceExtra', parseFloat(e.target.value) || 0)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Prix +"
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    + Ajouter une option
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                  >
                    {editingId ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t mt-6">
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

