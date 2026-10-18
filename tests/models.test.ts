import {
  LoginSchema,
  RegisterSchema,
  mapUserDTO,
} from '../src/models/auth.model';
import {
  MilestoneActionSchema,
  mapProjectDTO,
  mapMilestoneDTO,
} from '../src/models/project.model';
import { NewProjectWizardSchema } from '../src/models/service-catalog.model';

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

console.log('--- HUBIO 2026 MODEL & SCHEMA VALIDATION TESTS ---\n');

// 1. LoginSchema Tests
console.log('[1] LoginSchema Tests');
const validLogin = LoginSchema.safeParse({
  email: 'yonetim@novatech.com.tr',
  password: 'validPassword123',
});
assert(validLogin.success === true, 'Accepts valid email and password');

const invalidLogin = LoginSchema.safeParse({
  email: 'not-an-email',
  password: '123',
});
assert(invalidLogin.success === false, 'Rejects invalid email and short password');

// 2. RegisterSchema Tests
console.log('\n[2] RegisterSchema (Individual vs Corporate) Tests');
const validIndividual = RegisterSchema.safeParse({
  userType: 'individual',
  fullName: 'Barış Can',
  email: 'baris@can.com',
  password: 'password123',
  phone: '05321112233',
});
assert(validIndividual.success === true, 'Accepts valid individual registration');

const invalidCorporateMissingTax = RegisterSchema.safeParse({
  userType: 'corporate',
  fullName: 'Barış Can',
  email: 'baris@firma.com',
  password: 'password123',
  phone: '05321112233',
  companyTitle: 'Nova A.Ş.',
  // missing taxNumber
});
assert(
  invalidCorporateMissingTax.success === false,
  'Rejects corporate registration without taxNumber'
);

const validCorporate = RegisterSchema.safeParse({
  userType: 'corporate',
  fullName: 'Barış Can',
  email: 'baris@firma.com',
  password: 'password123',
  phone: '05321112233',
  companyTitle: 'NovaTech Bilişim A.Ş.',
  taxNumber: '1234567890',
  authorizedPersonTitle: 'Genel Müdür',
});
assert(validCorporate.success === true, 'Accepts complete corporate registration');

// 3. NewProjectWizardSchema Tests
console.log('\n[3] NewProjectWizardSchema Tests');
const validWizard = NewProjectWizardSchema.safeParse({
  serviceId: 'srv-001',
  projectTitle: 'Mobil Ödeme Yenilemesi',
  scopeDescription: 'Apple Pay ve Google Pay TurboModule entegrasyonu yapılacak',
  priority: 'urgent',
  estimatedBudget: '₺40.000',
  targetLaunchDate: '2 Hafta',
  approvedTerms: true,
});
assert(validWizard.success === true, 'Accepts valid project wizard payload');

const invalidWizardUnapproved = NewProjectWizardSchema.safeParse({
  serviceId: 'srv-001',
  projectTitle: 'Mobil Ödeme Yenilemesi',
  scopeDescription: 'Apple Pay ve Google Pay TurboModule entegrasyonu yapılacak',
  priority: 'standard',
  estimatedBudget: '₺40.000',
  targetLaunchDate: '2 Hafta',
  approvedTerms: false, // not approved
});
assert(
  invalidWizardUnapproved.success === false,
  'Rejects project wizard when terms are not approved'
);

// 4. DTO Mappers Tests
console.log('\n[4] DTO Mappers Tests');
const userDTO = mapUserDTO({ id: 10, email: 'test@hubio.com' }, 'token_abc');
assert(userDTO.id === '10', 'mapUserDTO converts id to string');
assert(userDTO.token === 'token_abc', 'mapUserDTO assigns token');

const projectDTO = mapProjectDTO({ id: 'p1', title: 'Test Web', progressPercentage: 80 });
assert(projectDTO.progressPercentage === 80, 'mapProjectDTO maps progress percentage');
assert(projectDTO.clientName === 'Kurumsal Müşteri', 'mapProjectDTO falls back to default client');

const milestoneDTO = mapMilestoneDTO({
  id: 'm1',
  projectId: 'p1',
  title: 'Test Milestone',
  description: 'Desc',
});
assert(milestoneDTO.status === 'pending_approval', 'mapMilestoneDTO assigns default pending status');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
