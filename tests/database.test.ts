import { databaseEngine } from '../src/services/database/database.engine';
import { projectRepository } from '../src/services/database/repositories/project.repository';
import { documentRepository } from '../src/services/database/repositories/document.repository';
import { mediaRepository } from '../src/services/database/repositories/media.repository';
import { oneOffOrderRepository } from '../src/services/database/repositories/one-off-order.repository';
import { userRepository } from '../src/services/database/repositories/user.repository';
import { serviceCatalogRepository } from '../src/services/database/repositories/service-catalog.repository';
import { notificationRepository } from '../src/services/database/repositories/notification.repository';
import { milestoneRevisionRepository } from '../src/services/database/repositories/milestone-revision.repository';
import { auditRepository } from '../src/services/database/repositories/audit.repository';

import {
  IDocumentEntity,
  IMediaAssetEntity,
  IProjectEntity,
  IUserEntity,
  IServiceCatalogEntity,
  INotificationEntity,
} from '../src/models/database/entities.types';

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

console.log('--- HUBIO 2026 ENTERPRISE DATABASE & REPOSITORY TESTS ---\n');

// 1. Database Engine Initialization & Self-Healing Seeder
console.log('[1] Database Engine & Self-Healing Seeder Verification');
const allProjects = databaseEngine.find<IProjectEntity>('projects');
assert(allProjects.length >= 3, `Database seeded with at least 3 enterprise projects (found: ${allProjects.length})`);

const allDocuments = databaseEngine.find<IDocumentEntity>('documents');
assert(allDocuments.length >= 6, `Database seeded with rich document catalog (found: ${allDocuments.length})`);

const allMedia = databaseEngine.find<IMediaAssetEntity>('media');
assert(allMedia.length >= 4, `Database seeded with 1080p demo videos and figma assets (found: ${allMedia.length})`);

const allUsers = userRepository.getAll();
assert(allUsers.length >= 3, `Database seeded with enterprise users (found: ${allUsers.length})`);

const allServices = serviceCatalogRepository.getAll();
assert(allServices.length >= 3, `Database seeded with services catalog (found: ${allServices.length})`);

const allNotifications = notificationRepository.getAll();
assert(allNotifications.length >= 2, `Database seeded with notifications (found: ${allNotifications.length})`);

// 2. Project Repository & Relational Graph
console.log('\n[2] Project Repository & Relational Graph Verification');
const graph = projectRepository.getFullGraph('prj-101');
assert(graph !== null, 'Full relational graph resolved for prj-101');
assert(graph?.project.id === 'prj-101', 'Graph contains correct project entity');
assert(graph!.documents.length >= 2, `Graph contains related documents (${graph?.documents.length})`);
assert(graph!.media.length >= 2, `Graph contains related media assets (${graph?.media.length})`);
assert(graph!.revisions.length >= 1, `Graph contains related revision items (${graph?.revisions.length})`);

// 3. Document Repository & Digital Signing
console.log('\n[3] Document Repository & Digital Signature Flow');
const targetDoc = allDocuments[0];
const initialDownload = targetDoc.downloadCount || 0;

documentRepository.incrementDownload(targetDoc.id);
const updatedDoc = documentRepository.getById(targetDoc.id);
assert(updatedDoc?.downloadCount === initialDownload + 1, 'incrementDownload increases download counter');

const signed = documentRepository.signDocument(targetDoc.id, 'CEO Barış Can');
assert(signed?.isSigned === true, 'Document marked as signed');
assert(signed?.signedBy === 'CEO Barış Can', 'Document records signer identity');
assert(typeof signed?.signedAt === 'string', 'Document records signed timestamp');

// 4. Media Repository & Filters
console.log('\n[4] Media Repository & Multi-Format Filtering');
const videoAssets = mediaRepository.getByProject('prj-101', 'video');
assert(videoAssets.every((v) => v.mediaType === 'video'), 'Filters strictly video media types');
const figmaAssets = mediaRepository.getByProject('prj-101', 'figma');
assert(figmaAssets.every((f) => f.mediaType === 'figma'), 'Filters strictly figma prototypes');

// 5. One-Off Order Repository
console.log('\n[5] One-Off Service Orders & Fulfillment Lifecycle');
const newOrder = oneOffOrderRepository.create({
  clientId: 'client_unit_test',
  serviceId: 'srv_seo_audit',
  serviceTitle: 'SEO & GEO Deep Audit',
  category: 'seo_geo',
  priceFormatted: '₺18.500',
  invoiceNumber: 'INV-2026-TEST',
  paymentStatus: 'paid',
  orderStatus: 'queued',
  deliverables: [{ name: 'Audit.pdf', url: 'https://cdn.hubio.com/audit.pdf', size: '3.2 MB' }],
});

assert(newOrder.id.startsWith('ord_'), 'Created order with ord_ prefix');
const retrieved = oneOffOrderRepository.getById(newOrder.id);
assert(retrieved?.paymentStatus === 'paid', 'Order persisted with paid status');

const updatedStatus = oneOffOrderRepository.updateStatus(newOrder.id, 'delivered');
assert(updatedStatus?.orderStatus === 'delivered', 'Order transitioned to delivered status');
assert(typeof updatedStatus?.deliveredAt === 'string', 'Order records delivery timestamp');

// 6. User Repository & O(1) Index Lookups
console.log('\n[6] User Repository & O(1) Secondary Index Lookups');
const userByEmail = userRepository.findByEmail('yonetim@novatech.com.tr');
assert(userByEmail?.fullName === 'Ahmet Yılmaz', 'O(1) email index finds Ahmet Yılmaz');
assert(userByEmail?.companyTitle?.includes('NovaTech') === true, 'Found user has correct company');

const createdUser = userRepository.create({
  email: 'test.developer@hubio.digital',
  fullName: 'Test Geliştirici',
  userType: 'individual',
  role: 'hubio_developer',
});
assert(createdUser.id.startsWith('usr_'), 'Created user has usr_ prefix');
const lookupCreated = userRepository.findByEmail('test.developer@hubio.digital');
assert(lookupCreated?.fullName === 'Test Geliştirici', 'Index updated immediately with newly created user');

// 7. Cascading Relational Delete Integrity
console.log('\n[7] Cascading Relational Delete Integrity');
const cascadeProjectId = 'prj-test-cascade-999';
databaseEngine.insert('projects', {
  id: cascadeProjectId,
  clientId: 'cli-cascade',
  clientName: 'Cascade Test Corp',
  title: 'Cascade Delete Test Project',
  category: 'mobile_web',
  status: 'planning',
  progressPercentage: 10,
  totalBudgetFormatted: '₺10.000',
  spentBudgetFormatted: '₺0',
  startDate: '2026-04-01',
  targetLaunchDate: '2026-05-01',
  techStack: ['Test'],
  description: 'To be deleted',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

databaseEngine.insert('documents', {
  id: 'doc-cascade-1',
  projectId: cascadeProjectId,
  title: 'Child Document 1',
  type: 'contract',
  fileUrl: 'http://test.com/doc1.pdf',
  fileSizeBytes: 100,
  fileSizeFormatted: '100 B',
  mimeType: 'application/pdf',
  version: 'v1.0',
  isSigned: false,
  downloadCount: 0,
  createdAt: new Date().toISOString(),
});

databaseEngine.insert('media', {
  id: 'med-cascade-1',
  projectId: cascadeProjectId,
  title: 'Child Media 1',
  mediaType: 'image',
  url: 'http://test.com/img.png',
  thumbnailUrl: 'http://test.com/thumb.png',
  tags: ['test'],
  uploaderName: 'Tester',
  fileSizeBytes: 200,
  createdAt: new Date().toISOString(),
});

databaseEngine.insert('revisions', {
  id: 'rev-cascade-1',
  projectId: cascadeProjectId,
  milestoneId: 'ms-test',
  title: 'Child Revision 1',
  tag: 'UI/UX',
  notes: 'test note',
  status: 'pending',
  requestedAt: new Date().toISOString(),
});

// Verify children exist before delete
assert(databaseEngine.findById('documents', 'doc-cascade-1') !== null, 'Child document exists before cascade');
assert(databaseEngine.findById('media', 'med-cascade-1') !== null, 'Child media exists before cascade');
assert(databaseEngine.findById('revisions', 'rev-cascade-1') !== null, 'Child revision exists before cascade');

// Perform cascading delete of the parent project
databaseEngine.delete('projects', cascadeProjectId);

// Assert parent AND all children are completely removed
assert(databaseEngine.findById('projects', cascadeProjectId) === null, 'Parent project deleted');
assert(databaseEngine.findById('documents', 'doc-cascade-1') === null, 'Child document automatically cascade-deleted');
assert(databaseEngine.findById('media', 'med-cascade-1') === null, 'Child media automatically cascade-deleted');
assert(databaseEngine.findById('revisions', 'rev-cascade-1') === null, 'Child revision automatically cascade-deleted');

// 8. ACID Transaction & Rollback Testing
console.log('\n[8] ACID Transaction & Rollback Mechanics');
const rollbackUserId = 'usr-trans-rollback-123';

try {
  databaseEngine.transaction((tx) => {
    tx.insert('users', {
      id: rollbackUserId,
      email: 'trans.rollback@test.com',
      fullName: 'Rollback User',
      userType: 'individual',
      role: 'client_viewer',
      createdAt: new Date().toISOString(),
    });

    // Simulate fatal error midway through multi-step operation
    throw new Error('SIMULATED_TRANSACTION_FAILURE');
  });
} catch (e: any) {
  assert(e.message === 'SIMULATED_TRANSACTION_FAILURE', 'Caught simulated transaction error');
}

// Verify record was rolled back and DOES NOT exist in database!
const rolledBackRecord = databaseEngine.findById('users', rollbackUserId);
assert(rolledBackRecord === null, 'Transaction rollback successfully reverted inserted record');

// Test successful transaction commit
const commitUserId = 'usr-trans-commit-456';
databaseEngine.transaction((tx) => {
  tx.insert('users', {
    id: commitUserId,
    email: 'trans.commit@test.com',
    fullName: 'Committed User',
    userType: 'corporate',
    role: 'client_admin',
    createdAt: new Date().toISOString(),
  });
});

const committedRecord = databaseEngine.findById<IUserEntity>('users', commitUserId);
assert(committedRecord !== null && committedRecord?.fullName === 'Committed User', 'Successful transaction committed and persisted');

// Clean up test user
databaseEngine.delete('users', commitUserId);
databaseEngine.delete('users', createdUser.id);

// 8. Milestone Revision Repository Verification
console.log('\n[8] Milestone Revision Repository Verification');
const revisions = milestoneRevisionRepository.getAll();
assert(revisions.length >= 3, `Seeded with at least 3 revisions (found: ${revisions.length})`);

const projectRevisions = milestoneRevisionRepository.getByProject('prj-101');
assert(projectRevisions.length >= 2, `Retrieved revisions for project prj-101 (found: ${projectRevisions.length})`);

const createdRev = milestoneRevisionRepository.create({
  projectId: 'prj-101',
  milestoneId: 'ms-001',
  title: 'Test Revision',
  tag: 'UI/UX',
  notes: 'Testing repository revision note',
  status: 'in_progress',
});
assert(createdRev.id.startsWith('rev_'), 'Created milestone revision entity with rev_ ID');

const resolvedRev = milestoneRevisionRepository.resolveRevision(createdRev.id, 'Test resolution notes');
assert(resolvedRev?.status === 'resolved', 'Revision successfully marked resolved');
milestoneRevisionRepository.delete(createdRev.id);

// 9. Audit Repository Verification
console.log('\n[9] Audit Repository Verification');
const audits = auditRepository.getAll();
assert(audits.length >= 2, `Audit table initialized with seed records (found: ${audits.length})`);

const recordedAudit = auditRepository.record({
  entityType: 'project',
  entityId: 'prj-101',
  action: 'update',
  performedBy: 'Test Runner',
  details: 'Automated test suite audit verification',
});
assert(recordedAudit.id.startsWith('aud_'), 'Audit entry recorded with aud_ prefix');
const foundAudit = auditRepository.getById(recordedAudit.id);
assert(foundAudit !== null && foundAudit.action === 'update', 'Audit entry retrievable by ID');

console.log(`\n========================================`);
console.log(`DATABASE TESTS RESULT: ${passed} PASSED / ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}

