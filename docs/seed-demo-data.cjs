const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/demo.db');

// Simple UUID generator
const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

// Get dates for demo appointments (today and next 7 days)
const today = new Date();
const dates = [];
for (let i = 0; i < 8; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  dates.push(date.toISOString().split('T')[0]);
}

// Demo users
const users = [
  { name: 'John', middle: 'A', surname: 'Smith', email: 'john.smith@example.com', phone: '+1-555-0101', ipAddress: '192.168.1.10', userToken: uuidv4() },
  { name: 'Sarah', middle: 'M', surname: 'Johnson', email: 'sarah.johnson@example.com', phone: '+1-555-0102', ipAddress: '192.168.1.11', userToken: uuidv4() },
  { name: 'Michael', middle: '', surname: 'Williams', email: 'michael.williams@example.com', phone: '+1-555-0103', ipAddress: '192.168.1.12', userToken: uuidv4() },
  { name: 'Emily', middle: 'R', surname: 'Brown', email: 'emily.brown@example.com', phone: '+1-555-0104', ipAddress: '192.168.1.13', userToken: uuidv4() },
  { name: 'David', middle: 'L', surname: 'Davis', email: 'david.davis@example.com', phone: '+1-555-0105', ipAddress: '192.168.1.14', userToken: uuidv4() }
];

// Demo appointments (mix of confirmed, pending, cancelled)
const appointments = [
  { date: dates[0], timeStart: '10:00', timeEnd: '11:00', userId: 1, confirmed: 1, cancelled: 0, status: 'confirmed', appTag: 'individual' },
  { date: dates[0], timeStart: '14:00', timeEnd: '15:00', userId: 2, confirmed: 1, cancelled: 0, status: 'confirmed', appTag: 'couples' },
  { date: dates[1], timeStart: '09:00', timeEnd: '10:00', userId: 3, confirmed: 0, cancelled: 0, status: 'pending', appTag: 'individual' },
  { date: dates[1], timeStart: '15:00', timeEnd: '16:00', userId: 4, confirmed: 1, cancelled: 0, status: 'confirmed', appTag: 'group' },
  { date: dates[2], timeStart: '11:00', timeEnd: '12:00', userId: 5, confirmed: 0, cancelled: 1, status: 'cancelled', appTag: 'individual' },
  { date: dates[3], timeStart: '13:00', timeEnd: '14:00', userId: 1, confirmed: 1, cancelled: 0, status: 'confirmed', appTag: 'couples' },
  { date: dates[4], timeStart: '10:00', timeEnd: '11:00', userId: 2, confirmed: 0, cancelled: 0, status: 'pending', appTag: 'individual' },
  { date: dates[5], timeStart: '14:00', timeEnd: '15:00', userId: 3, confirmed: 1, cancelled: 0, status: 'confirmed', appTag: 'individual' }
];

console.log('Seeding demo data...\n');

// Insert users
db.serialize(() => {
  const userStmt = db.prepare('INSERT INTO users (name, middle, surname, email, phone, ipAddress, userToken) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  users.forEach(user => {
    userStmt.run(user.name, user.middle, user.surname, user.email, user.phone, user.ipAddress, user.userToken);
  });
  
  userStmt.finalize(() => {
    console.log(`✓ Inserted ${users.length} demo users`);
    
    // Insert appointments
    const aptStmt = db.prepare('INSERT INTO appointments (udi, count, date, timeStart, timeEnd, repeat, confirmed, cancelled, status, userId, appTag) VALUES (?, 1, ?, ?, ?, "none", ?, ?, ?, ?, ?)');
    
    appointments.forEach(apt => {
      aptStmt.run(uuidv4(), apt.date, apt.timeStart, apt.timeEnd, apt.confirmed, apt.cancelled, apt.status, apt.userId, apt.appTag);
    });
    
    aptStmt.finalize(() => {
      console.log(`✓ Inserted ${appointments.length} demo appointments`);
      
      // Verify
      db.get('SELECT COUNT(*) as count FROM users', (err, r1) => {
        db.get('SELECT COUNT(*) as count FROM appointments', (err, r2) => {
          console.log(`\nTotal users: ${r1.count}`);
          console.log(`Total appointments: ${r2.count}`);
          console.log('\n✓ Demo data seeded successfully!');
          db.close();
        });
      });
    });
  });
});
