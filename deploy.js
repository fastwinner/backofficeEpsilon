const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement de Epsilon Admin...');

try {
  // Build l'application
  console.log('📦 Build en cours...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Créer CNAME pour domaine personnalisé (optionnel)
  const buildPath = path.join(__dirname, 'build');
  
  // Ajouter un fichier pour éviter les erreurs 404 sur les routes React
  const indexHtml = fs.readFileSync(path.join(buildPath, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(buildPath, '404.html'), indexHtml);
  
  console.log('✅ Build terminé avec succès!');
  console.log('📁 Fichiers prêts dans le dossier build/');
  console.log('');
  console.log('🌐 Options de déploiement:');
  console.log('1. Netlify Drop: https://netlify.com/drop');
  console.log('2. Vercel: npx vercel --prod');
  console.log('3. Surge: npx surge build/');
  console.log('');
  console.log('📋 Votre application contient:');
  console.log('- Page de connexion sécurisée');
  console.log('- Dashboard avec métriques');
  console.log('- Navigation responsive');
  console.log('- Design Epsilon moderne');
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
  process.exit(1);
}
