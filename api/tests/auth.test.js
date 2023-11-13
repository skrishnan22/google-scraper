import { expect } from 'chai';
import prisma from '../utils/prismaClient.js';
import sinon from 'sinon';
import verifyToken from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', function () {
  let testUser, token, mockReq, mockRes, nextSpy;

  before(async function () {
    testUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@test.com',
        password: (Math.random() + 1).toString(36).substring(7)
      }
    });
  });

  beforeEach(function () {
    mockReq = {
      headers: {},
      path: ''
    };

    mockRes = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };

    nextSpy = sinon.spy();
  });

  after(async function () {
    await prisma.user.delete({ where: { id: testUser.id } });
  });

  it('should call next for valid token', async function () {
    const validToken = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET);

    mockReq.headers['authorization'] = validToken;
    mockReq.path = '/file/upload';

    await verifyToken(mockReq, mockRes, nextSpy);

    expect(nextSpy.called).to.be.true;
  });

  it('should reject a request with an malformed jwt token', async function () {
    const inValidToken = (Math.random() + 1).toString(36).substring(7);

    mockReq.headers['authorization'] = inValidToken;
    mockReq.path = '/file/upload';

    await verifyToken(mockReq, mockRes, nextSpy);

    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.send.calledWith('Invalid Token')).to.be.true;
  });

  it('should reject a request with a valid token but invalid user', async function () {
    const inValidToken = jwt.sign({ userId: -1 }, process.env.JWT_SECRET);

    mockReq.headers['authorization'] = inValidToken;
    mockReq.path = '/file/upload';

    await verifyToken(mockReq, mockRes, nextSpy);

    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.send.calledWith('Invalid Token')).to.be.true;
  });

  it('should reject a request with no token', async function () {
    mockReq.path = '/file/upload';

    await verifyToken(mockReq, mockRes, nextSpy);

    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.send.calledWith('A token is required for authentication')).to.be.true;
  });

  it('should call next for bypass route without token', async function () {
    mockReq.path = '/health';

    await verifyToken(mockReq, mockRes, nextSpy);

    expect(nextSpy.called).to.be.true;
  });
});
