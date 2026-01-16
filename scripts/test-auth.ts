import bcrypt from 'bcryptjs';

const testPassword = 'Admin@123';
const hash = bcrypt.hashSync(testPassword, 10);

console.log('Test Password:', testPassword);
console.log('Hash:', hash);
console.log('Compare Result:', bcrypt.compareSync(testPassword, hash));

// Test with seeded password
const seededHash = '$2a$10$rKvVxfP8vQqJZ0sWz3H4GOxz8vD2fP8vQqJZ0sWz3H4GOxz8vD2f.';
console.log('\nTest with potential seeded hash:');
console.log('Compare:', bcrypt.compareSync(testPassword, seededHash));
