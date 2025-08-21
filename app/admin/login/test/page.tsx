export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          🧪 Test Page - Login Admin
        </h1>
        <p className="text-gray-600 mb-4">
          Si vous voyez cette page, le problème vient de NextAuth ou des variables d'environnement.
        </p>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-gray-800 mb-2">Variables d'environnement :</h3>
          <div className="text-sm space-y-1">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || '❌ Non défini'}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? '✅ Défini' : '❌ Non défini'}</p>
            <p><strong>ADMIN_EMAIL:</strong> {process.env.ADMIN_EMAIL || '❌ Non défini'}</p>
            <p><strong>ADMIN_PASSWORD:</strong> {process.env.ADMIN_PASSWORD ? '✅ Défini' : '❌ Non défini'}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-bold text-blue-800 mb-2">Solution :</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Créez un fichier <code>.env.local</code> à la racine</li>
            <li>2. Ajoutez les variables NextAuth</li>
            <li>3. Redémarrez le serveur</li>
            <li>4. Testez <code>/admin/login</code></li>
          </ol>
        </div>

        <div className="mt-4">
          <a 
            href="/admin/login" 
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retour au Login
          </a>
        </div>
      </div>
    </div>
  );
} 