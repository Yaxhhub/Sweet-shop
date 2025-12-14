const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

describe('Sweets Routes', () => {
  let userToken, adminToken, userId, adminId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/sweetshop_test');
    
    // Create test users
    const user = new User({ email: 'user@test.com', password: 'password123' });
    const admin = new User({ email: 'admin@test.com', password: 'password123', role: 'ADMIN' });
    
    await user.save();
    await admin.save();
    
    userId = user._id;
    adminId = admin._id;
    
    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET);
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      const sweet = new Sweet({
        name: 'Chocolate',
        category: 'Candy',
        price: 2.50,
        quantity: 10
      });
      await sweet.save();

      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Chocolate');
    });
  });

  describe('POST /api/sweets', () => {
    it('should create sweet as admin', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'Gummy',
        price: 3.00,
        quantity: 20
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
    });

    it('should not create sweet as regular user', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'Gummy',
        price: 3.00,
        quantity: 20
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = new Sweet({
        name: 'Chocolate',
        category: 'Candy',
        price: 2.50,
        quantity: 5
      });
      await sweet.save();
      sweetId = sweet._id;
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(3);
    });

    it('should fail purchase if insufficient quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(400);

      expect(response.body.message).toBe('Insufficient quantity');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = new Sweet({
        name: 'Chocolate',
        category: 'Candy',
        price: 2.50,
        quantity: 5
      });
      await sweet.save();
      sweetId = sweet._id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(15);
    });

    it('should not restock with negative quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.message).toBe('Restock amount must be positive');
    });
  });
});