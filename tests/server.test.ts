import { createServer } from '../server/src/server';
import { backendDb } from '../server/src/services/database.service';
import { pushService } from '../server/src/services/push.service';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- HUBIO 2026 ENTERPRISE BACKEND REST API TESTS ---\n');

// 1. Express App Creation
console.log('[1] Express Server & Architecture Initialization');
const app = createServer();
assert(typeof app === 'function', 'Express application factory creates valid app instance');

// 2. Database Service
console.log('\n[2] Backend Database Service & Relational Graphs');
const projects = backendDb.getAllProjects();
assert(projects.length >= 3, `Backend seeded with at least 3 enterprise projects (found: ${projects.length})`);

const vaultGraph = backendDb.getProjectFullGraph('prj-101');
assert(vaultGraph !== null, 'Full vault graph resolved for prj-101');
assert(vaultGraph!.documents.length >= 2, `Vault contains related documents (${vaultGraph?.documents.length})`);

// 3. Document Digital Signing
console.log('\n[3] Document Digital Signature on Backend');
const signed = backendDb.signDocument('doc-001', 'Enterprise Director');
assert(signed?.isSigned === true, 'Document digital signature persisted');
assert(signed?.signedBy === 'Enterprise Director', 'Document signer identity saved');

// 4. One-Off Order Management
console.log('\n[4] Backend One-Off Service Orders');
const newOrder = backendDb.createOrder({
  id: 'ord_backend_test',
  clientId: 'cli-001',
  serviceId: 'srv_perf',
  serviceTitle: 'Full Redis Cache Optimization',
  category: 'maintenance',
  priceFormatted: '₺22.000',
  invoiceNumber: 'INV-2026-SRV-99',
  paymentStatus: 'paid',
  orderStatus: 'queued',
  deliverables: [],
  orderedAt: new Date().toISOString(),
});
assert(newOrder.id === 'ord_backend_test', 'Order successfully inserted into backend db');

async function runServerTests() {
  console.log('\n[5] Push Notification Service Gateway');
  const result = await pushService.sendNotification({
    to: 'ExponentPushToken[test_token]',
    title: 'Backend Sprint Update',
    body: 'Sprint 6 has completed successfully.',
  });
  assert(result.success === true, 'Push notification payload validated and dispatched');
  assert(result.sentCount === 1, 'Push sent to targeted token');

  console.log(`\n========================================`);
  console.log(`BACKEND TESTS RESULT: ${passed} PASSED / ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runServerTests();
