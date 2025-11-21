// TEST FLOATING BUTTONS CLEAN
console.log('🧹 TEST FLOATING BUTTONS CLEAN...');

// 1. Cek container
const container = document.querySelector('#floating-actions');
if (container) {
  console.log('✅ Floating actions container found');
} else {
  console.log('❌ Floating actions container not found');
}

// 2. Cek scroll buttons
const scrollUp = document.querySelector('.scroll-button-up');
const scrollDown = document.querySelector('.scroll-button-down');
const whatsapp = document.querySelector('.whatsapp-button');

console.log(`✅ Scroll Up button: ${scrollUp ? 'Found' : 'Not found'}`);
console.log(`✅ Scroll Down button: ${scrollDown ? 'Found' : 'Not found'}`);
console.log(`✅ WhatsApp button: ${whatsapp ? 'Found' : 'Not found'}`);

// 3. Cek styling
if (scrollUp) {
  const styles = window.getComputedStyle(scrollUp);
  console.log('📊 Scroll Up Button Styles:');
  console.log(`   - Width: ${styles.width}`);
  console.log(`   - Height: ${styles.height}`);
  console.log(`   - Background: ${styles.background}`);
  console.log(`   - Border radius: ${styles.borderRadius}`);
}

if (scrollDown) {
  const styles = window.getComputedStyle(scrollDown);
  console.log('📊 Scroll Down Button Styles:');
  console.log(`   - Width: ${styles.width}`);
  console.log(`   - Height: ${styles.height}`);
  console.log(`   - Background: ${styles.background}`);
  console.log(`   - Border radius: ${styles.borderRadius}`);
}

if (whatsapp) {
  const styles = window.getComputedStyle(whatsapp);
  console.log('📊 WhatsApp Button Styles:');
  console.log(`   - Width: ${styles.width}`);
  console.log(`   - Height: ${styles.height}`);
  console.log(`   - Background: ${styles.background}`);
  console.log(`   - Border radius: ${styles.borderRadius}`);
}

// 4. Cek icons
if (scrollUp) {
  const beforeContent = window.getComputedStyle(scrollUp, '::before').content;
  console.log(`🎯 Scroll Up Icon: ${beforeContent}`);
}

if (scrollDown) {
  const beforeContent = window.getComputedStyle(scrollDown, '::before').content;
  console.log(`🎯 Scroll Down Icon: ${beforeContent}`);
}

if (whatsapp) {
  const beforeContent = window.getComputedStyle(whatsapp, '::before').content;
  console.log(`🎯 WhatsApp Icon: ${beforeContent}`);
}

console.log('🧹 TEST FLOATING BUTTONS CLEAN COMPLETE!');
console.log('📝 Notes:');
console.log('   - CSS file: floating-buttons-clean.css');
console.log('   - Easy to edit and modify');
console.log('   - No complex overrides or high specificity');
console.log('   - Clean and simple structure');


