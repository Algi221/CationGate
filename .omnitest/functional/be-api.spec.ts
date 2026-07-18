
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BE_URL || 'http://localhost:5000';

test.describe('Backend API Functional Endpoint Tests', () => {

  test('GET /api/applicants/health should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/health';
    const startTime = Date.now();

    const response = await request.get('/health', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/health responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/ws should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/ws';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/ws', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/ws responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET admin should return valid response', async ({ request }) => {
    const url = BASE_URL + 'admin';
    const startTime = Date.now();

    const response = await request.get('admin', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET admin responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/admin/users/ysbmo/staff should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/ysbmo/staff';
    const startTime = Date.now();

    const response = await request.get('/api/admin/users/ysbmo/staff', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/admin/users/ysbmo/staff responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/admin/users/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/';
    const startTime = Date.now();

    const response = await request.get('/api/admin/users/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/admin/users/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/admin/users/trashed should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/trashed';
    const startTime = Date.now();

    const response = await request.get('/api/admin/users/trashed', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/admin/users/trashed responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/admin/users/:id/restore should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/1/restore';
    const startTime = Date.now();

    const response = await request.post('/api/admin/users/:id/restore', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/admin/users/:id/restore responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/admin/users/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/';
    const startTime = Date.now();

    const response = await request.post('/api/admin/users/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/admin/users/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PUT /api/admin/users/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/1';
    const startTime = Date.now();

    const response = await request.put('/api/admin/users/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PUT /api/admin/users/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('DELETE /api/admin/users/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/admin/users/1';
    const startTime = Date.now();

    const response = await request.delete('/api/admin/users/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint DELETE /api/admin/users/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/applicants/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/';
    const startTime = Date.now();

    const response = await request.post('/api/applicants/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/applicants/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/public should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/public';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/public', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/public responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/trashed should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/trashed';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/trashed', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/trashed responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/applicants/:id/restore should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/1/restore';
    const startTime = Date.now();

    const response = await request.post('/api/applicants/:id/restore', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/applicants/:id/restore responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/1';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PUT /api/applicants/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/1';
    const startTime = Date.now();

    const response = await request.put('/api/applicants/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PUT /api/applicants/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PATCH /api/applicants/:id/status should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/1/status';
    const startTime = Date.now();

    const response = await request.patch('/api/applicants/:id/status', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PATCH /api/applicants/:id/status responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('DELETE /api/applicants/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/1';
    const startTime = Date.now();

    const response = await request.delete('/api/applicants/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint DELETE /api/applicants/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/check-payment/:nisn should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/check-payment/1';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/check-payment/:nisn', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/check-payment/:nisn responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/public-invoice/:nisn should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/public-invoice/1';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/public-invoice/:nisn', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/public-invoice/:nisn responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/applicants/verify/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/applicants/verify/1';
    const startTime = Date.now();

    const response = await request.get('/api/applicants/verify/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/applicants/verify/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/auth/login should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/auth/login';
    const startTime = Date.now();

    const response = await request.post('/api/auth/login', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/auth/login responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PATCH /api/auth/change-password should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/auth/change-password';
    const startTime = Date.now();

    const response = await request.patch('/api/auth/change-password', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PATCH /api/auth/change-password responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PATCH /api/auth/profile should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/auth/profile';
    const startTime = Date.now();

    const response = await request.patch('/api/auth/profile', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PATCH /api/auth/profile responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/config/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/config/';
    const startTime = Date.now();

    const response = await request.get('/api/config/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/config/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/config/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/config/';
    const startTime = Date.now();

    const response = await request.post('/api/config/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/config/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/config/revisions should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/config/revisions';
    const startTime = Date.now();

    const response = await request.get('/api/config/revisions', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/config/revisions responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/config/save-all should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/config/save-all';
    const startTime = Date.now();

    const response = await request.post('/api/config/save-all', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/config/save-all responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/config/restore should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/config/restore';
    const startTime = Date.now();

    const response = await request.post('/api/config/restore', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/config/restore responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET / should return valid response', async ({ request }) => {
    const url = BASE_URL + '/';
    const startTime = Date.now();

    const response = await request.get('/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET / responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/1';
    const startTime = Date.now();

    const response = await request.get('/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST / should return valid response', async ({ request }) => {
    const url = BASE_URL + '/';
    const startTime = Date.now();

    const response = await request.post('/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST / responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PUT /:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/1';
    const startTime = Date.now();

    const response = await request.put('/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PUT /:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('DELETE /:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/1';
    const startTime = Date.now();

    const response = await request.delete('/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint DELETE /:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /targets should return valid response', async ({ request }) => {
    const url = BASE_URL + '/targets';
    const startTime = Date.now();

    const response = await request.post('/targets', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /targets responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/payment/confirm-payment-option should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/payment/confirm-payment-option';
    const startTime = Date.now();

    const response = await request.post('/api/payment/confirm-payment-option', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/payment/confirm-payment-option responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (false) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/siswa-aktif/ should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/';
    const startTime = Date.now();

    const response = await request.get('/api/siswa-aktif/', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/siswa-aktif/ responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('GET /api/siswa-aktif/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/1';
    const startTime = Date.now();

    const response = await request.get('/api/siswa-aktif/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint GET /api/siswa-aktif/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('PUT /api/siswa-aktif/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/1';
    const startTime = Date.now();

    const response = await request.put('/api/siswa-aktif/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint PUT /api/siswa-aktif/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('DELETE /api/siswa-aktif/:id should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/1';
    const startTime = Date.now();

    const response = await request.delete('/api/siswa-aktif/:id', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint DELETE /api/siswa-aktif/:id responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/siswa-aktif/generate-nipd should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/generate-nipd';
    const startTime = Date.now();

    const response = await request.post('/api/siswa-aktif/generate-nipd', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/siswa-aktif/generate-nipd responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });


  test('POST /api/siswa-aktif/:id/mutasi should return valid response', async ({ request }) => {
    const url = BASE_URL + '/api/siswa-aktif/1/mutasi';
    const startTime = Date.now();

    const response = await request.post('/api/siswa-aktif/:id/mutasi', {
      headers: { 'Accept': 'application/json' },
      ignoreHTTPSErrors: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Endpoint POST /api/siswa-aktif/:id/mutasi responded in ${duration}ms with status ${response.status()}`);

    // Protected endpoints should return 401 or 403, public should return 200/400
    if (true) {
      expect([200, 400, 401, 403]).toContain(response.status());
    } else {
      expect([200, 400, 404]).toContain(response.status());
    }

    // Response time SLA check (< 2000ms)
    expect(duration).toBeLessThan(2000);
  });

});
