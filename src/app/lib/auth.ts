/**
 * Phone + OTP auth boundary.
 *
 * Everything below is a PLACEHOLDER. No SMS is sent and nothing is stored.
 * When an SMS/WhatsApp provider is chosen (MSG91, Twilio, Firebase Auth, ...),
 * replace the bodies of these functions with calls to your server and set
 * AUTH_LIVE to true. The UI in components/AuthModal.tsx does not need to change.
 *
 * Never log phone numbers or codes.
 */

export const AUTH_LIVE = false;

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;

/** Indian mobile numbers: 10 digits, starting with 6-9. */
export const isValidIndianMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function requestOtp(phone: string): Promise<void> {
  void phone;
  await wait(700);
}

export async function verifyOtp(phone: string, code: string): Promise<{ ok: boolean }> {
  void phone;
  await wait(700);
  // Placeholder rule so the error state can be previewed: 000000 is "wrong".
  return { ok: code !== "000000" };
}
