import { expect, it } from 'vitest';
import { PHONE, PHONE_HREF, WHATSAPP_HREF, TELEGRAM_HREF, CONTACT_NAME } from './contact';
it('uses the confirmed Sergey phone for calling and phone-based messaging', () => {
  expect(CONTACT_NAME).toBe('Сергей');
  expect(PHONE.replace(/\D/g, '')).toBe('79612232716');
  expect(PHONE_HREF).toBe('tel:+79612232716');
  expect(WHATSAPP_HREF).toBe('https://wa.me/79612232716');
  expect(TELEGRAM_HREF).toBe('https://t.me/+79612232716');
});
