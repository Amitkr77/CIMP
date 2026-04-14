/**
 * Seed script — creates demo accounts
 * Run: node scripts/seed.js
 * (after setting MONGODB_URI in .env.local)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['incubatee', 'manager', 'ceo'] },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = [
    { name: 'Demo Incubatee', email: 'incubatee@demo.com', role: 'incubatee' },
    { name: 'Demo Manager', email: 'manager@demo.com', role: 'manager' },
    { name: 'Demo CEO', email: 'ceo@demo.com', role: 'ceo' },
  ];

  const password = await bcrypt.hash('demo123', 12);

  for (const u of users) {
    await User.findOneAndUpdate(
      { email: u.email },
      { ...u, password },
      { upsert: true, new: true }
    );
    console.log(`✅ ${u.role}: ${u.email} / demo123`);
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
