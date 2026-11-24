import test from 'node:test';
import assert from 'node:assert/strict';

// RBC compatibility rules to verify
const RBC_RECIPIENT_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'Oh (Bombay)': ['Oh (Bombay)'],
  'Rh-null': ['Rh-null']
};

function isRbcCompatible(donorGroup, recipientGroup) {
  const allowedDonors = RBC_RECIPIENT_COMPATIBILITY[recipientGroup];
  return allowedDonors ? allowedDonors.includes(donorGroup) : false;
}

function checkDonationEligibility(lastDonationDateString) {
  if (!lastDonationDateString) {
    return { isEligible: true, daysRemaining: 0 };
  }
  const lastDate = new Date(lastDonationDateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const cooldownPeriod = 90;

  if (diffDays >= cooldownPeriod) {
    return { isEligible: true, daysRemaining: 0 };
  } else {
    return { isEligible: false, daysRemaining: cooldownPeriod - diffDays };
  }
}

test('Smart Blood Compatibility - Universal RBC Donor (O-)', () => {
  const standardGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  for (const group of standardGroups) {
    assert.strictEqual(
      isRbcCompatible('O-', group),
      true,
      `O- should be compatible with recipient group ${group}`
    );
  }
});

test('Smart Blood Compatibility - Universal Recipient (AB+)', () => {
  const standardGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  for (const group of standardGroups) {
    assert.strictEqual(
      isRbcCompatible(group, 'AB+'),
      true,
      `AB+ recipient should be compatible with donor group ${group}`
    );
  }
});

test('Smart Blood Compatibility - Rare Bombay Blood Group (Oh)', () => {
  assert.strictEqual(
    isRbcCompatible('Oh (Bombay)', 'Oh (Bombay)'),
    true,
    'Bombay group can receive from another Bombay donor'
  );
  assert.strictEqual(
    isRbcCompatible('O-', 'Oh (Bombay)'),
    false,
    'Bombay group MUST NOT receive O- standard blood due to anti-H antibodies'
  );
  assert.strictEqual(
    isRbcCompatible('A+', 'Oh (Bombay)'),
    false,
    'Bombay group cannot receive A+ blood'
  );
});

test('Donation Eligibility - 90-day cooldown period', () => {
  const eligibleDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const ineligibleDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const res1 = checkDonationEligibility(eligibleDate);
  assert.strictEqual(res1.isEligible, true);
  assert.strictEqual(res1.daysRemaining, 0);

  const res2 = checkDonationEligibility(ineligibleDate);
  assert.strictEqual(res2.isEligible, false);
  assert.ok(res2.daysRemaining > 0);
});
