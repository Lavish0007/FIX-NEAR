import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import {
  AuthUser,
  AuthUserRepository,
  createAuthController,
} from './authController';
import { AuthRequest } from '../middleware/authMiddleware';
import { validateRegistration } from '../../src/utils/registration';

const TEST_JWT_SECRET = 'unit-test-secret-with-at-least-32-characters';

class TestUserRepository implements AuthUserRepository {
  readonly users = new Map<string, AuthUser>();
  private nextId = 1;

  async findByEmail(email: string): Promise<AuthUser | null> {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  async create(user: Omit<AuthUser, '_id'>): Promise<AuthUser> {
    if (await this.findByEmail(user.email)) {
      throw Object.assign(new Error('duplicate key'), { code: 11000 });
    }

    const created = { ...user, _id: `user-${this.nextId++}` };
    this.users.set(created._id, created);
    return created;
  }

  async findById(id: string): Promise<AuthUser | null> {
    return this.users.get(id) ?? null;
  }
}

interface TestResponse extends Response {
  statusCode: number;
  body?: unknown;
}

const createResponse = (): TestResponse => {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  return response as unknown as TestResponse;
};

const createController = (
  users: AuthUserRepository,
  databaseConnected = true,
  jwtSecret: string | undefined = TEST_JWT_SECRET
) =>
  createAuthController({
    users,
    isDatabaseConnected: () => databaseConnected,
    getJwtSecret: () => jwtSecret,
  });

const asRequest = (body: unknown): Request =>
  ({ body }) as Request;

const payload = <T>(response: TestResponse): T => response.body as T;

const validSignup = {
  name: 'New Citizen',
  email: 'citizen@example.com',
  password: 'safe-password-123',
  confirmPassword: 'safe-password-123',
  city: 'Central District',
};

test('registration validates required fields, email, password length, and confirmation', () => {
  assert.equal(validateRegistration({ ...validSignup, name: ' ' }), 'Please enter your full name.');
  assert.equal(
    validateRegistration({ ...validSignup, email: 'not-an-email' }),
    'Please enter a valid email address.'
  );
  assert.equal(
    validateRegistration({ ...validSignup, password: 'short' }),
    'Password must be between 6 and 128 characters long.'
  );
  assert.equal(
    validateRegistration({ ...validSignup, password: 'a'.repeat(129), confirmPassword: 'a'.repeat(129) }),
    'Password must be between 6 and 128 characters long.'
  );
  assert.equal(
    validateRegistration({ ...validSignup, confirmPassword: 'different-password' }),
    'Passwords do not match.'
  );
  assert.equal(validateRegistration(validSignup), null);
});

test('registration persists a normalized user with a bcrypt hash and returns a session', async () => {
  const users = new TestUserRepository();
  const controller = createController(users);
  const response = createResponse();

  await controller.signup(
    asRequest({ ...validSignup, email: '  CITIZEN@Example.com  ' }),
    response
  );

  assert.equal(response.statusCode, 201);
  const result = payload<{
    success: boolean;
    token: string;
    user: { id: string; email: string };
  }>(response);
  assert.equal(result.success, true);
  assert.equal(result.user.email, 'citizen@example.com');
  assert.ok(result.token);

  const storedUser = await users.findByEmail('citizen@example.com');
  assert.ok(storedUser);
  assert.notEqual(storedUser.password, validSignup.password);
  assert.equal(await bcrypt.compare(validSignup.password, storedUser.password), true);
  assert.equal('password' in result.user, false);
});

test('registration rejects malformed fields and does not call storage', async () => {
  const users = new TestUserRepository();
  const controller = createController(users);
  const cases: unknown[] = [
    { ...validSignup, name: {} },
    { ...validSignup, email: 'bad-address' },
    { ...validSignup, password: 'short' },
    { ...validSignup, city: 123 },
  ];

  for (const body of cases) {
    const response = createResponse();
    await controller.signup(asRequest(body), response);
    assert.equal(response.statusCode, 400);
  }
  assert.equal(users.users.size, 0);
});

test('registration reports duplicate addresses, including a unique-index race', async () => {
  const users = new TestUserRepository();
  const controller = createController(users);
  const firstResponse = createResponse();
  await controller.signup(asRequest(validSignup), firstResponse);

  const duplicateResponse = createResponse();
  await controller.signup(asRequest(validSignup), duplicateResponse);
  assert.equal(duplicateResponse.statusCode, 409);

  const raceRepository: AuthUserRepository = {
    findByEmail: async () => null,
    create: async () => {
      throw Object.assign(new Error('duplicate key'), { code: 11000 });
    },
    findById: async () => null,
  };
  const raceResponse = createResponse();
  await createController(raceRepository).signup(asRequest(validSignup), raceResponse);
  assert.equal(raceResponse.statusCode, 409);
});

test('registration does not report success when database storage is unavailable', async () => {
  const users = new TestUserRepository();
  const response = createResponse();

  await createController(users, false).signup(asRequest(validSignup), response);

  assert.equal(response.statusCode, 503);
  assert.equal(users.users.size, 0);
  assert.match(
    (payload<{ message: string }>(response)).message,
    /persistent storage is not connected/i
  );
});

test('registration returns a safe error when persistence fails', async () => {
  const failingRepository: AuthUserRepository = {
    findByEmail: async () => {
      throw new Error('mongodb://private-user:private-password@host');
    },
    create: async () => {
      throw new Error('unreachable');
    },
    findById: async () => null,
  };
  const response = createResponse();

  await createController(failingRepository).signup(asRequest(validSignup), response);

  assert.equal(response.statusCode, 500);
  const message = payload<{ message: string }>(response).message;
  assert.match(message, /unable to create your account/i);
  assert.doesNotMatch(message, /private-password|mongodb:\/\//i);
});

test('registered users can log in and verify the session after controller reinitialization', async () => {
  const users = new TestUserRepository();
  const initialController = createController(users);
  const signupResponse = createResponse();
  await initialController.signup(asRequest(validSignup), signupResponse);

  const newController = createController(users);
  const loginResponse = createResponse();
  await newController.login(
    asRequest({ email: 'CITIZEN@example.com', password: validSignup.password }),
    loginResponse
  );

  assert.equal(loginResponse.statusCode, 200);
  const loginResult = payload<{ token: string; user: { id: string; email: string } }>(loginResponse);
  const claims = jwt.verify(loginResult.token, TEST_JWT_SECRET) as JwtPayload;
  assert.equal(claims.email, 'citizen@example.com');

  const profileResponse = createResponse();
  const profileRequest = {
    user: { id: claims.id as string, email: claims.email as string, name: claims.name as string },
  } as unknown as AuthRequest;
  await newController.getMe(profileRequest, profileResponse);

  assert.equal(profileResponse.statusCode, 200);
  assert.equal(
    payload<{ user: { email: string } }>(profileResponse).user.email,
    'citizen@example.com'
  );
});

test('login rejects invalid credentials and unavailable database without issuing a token', async () => {
  const users = new TestUserRepository();
  const controller = createController(users);

  const invalidResponse = createResponse();
  await controller.login(
    asRequest({ email: validSignup.email, password: 'wrong-password' }),
    invalidResponse
  );
  assert.equal(invalidResponse.statusCode, 401);
  assert.equal('token' in payload<Record<string, unknown>>(invalidResponse), false);

  const unavailableResponse = createResponse();
  await createController(users, false).login(
    asRequest({ email: validSignup.email, password: validSignup.password }),
    unavailableResponse
  );
  assert.equal(unavailableResponse.statusCode, 503);
});

test('authentication fails closed when JWT_SECRET is missing or too short', async () => {
  const users = new TestUserRepository();
  const response = createResponse();

  await createController(users, true, 'short').signup(asRequest(validSignup), response);

  assert.equal(response.statusCode, 503);
  assert.equal(users.users.size, 0);
});
