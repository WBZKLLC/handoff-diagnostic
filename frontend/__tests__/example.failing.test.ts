/**
 * INTENTIONAL FAILING TEST
 * 
 * This test demonstrates our red/green CI workflow.
 * Toggle .skip off in a PR to show how failures are handled.
 * 
 * Used in walkthroughs to demonstrate:
 * - CI catches failures before merge
 * - How to investigate red builds
 * - The value of automated testing
 */

describe('Demo: Red/Green Workflow', () => {
  test.skip('INTENTIONAL: demonstrates red/green workflow', () => {
    // Remove .skip to see this fail in CI
    // This is intentionally wrong to demonstrate failure handling
    expect(1 + 1).toBe(3);
  });

  test('Basic sanity check (should pass)', () => {
    expect(1 + 1).toBe(2);
  });
});
