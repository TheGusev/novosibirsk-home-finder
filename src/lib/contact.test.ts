import { expect, it } from 'vitest';
import { PHONE, PHONE_HREF, WHATSAPP_HREF, TELEGRAM_HREF, AVITO_HREF, CONTACT_NAME } from './contact';
it('uses the confirmed Sergey phone for calling and phone-based messaging', () => {
  expect(CONTACT_NAME).toBe('Сергей');
  expect(PHONE.replace(/\D/g, '')).toBe('79612232716');
  expect(PHONE_HREF).toBe('tel:+79612232716');
  expect(WHATSAPP_HREF).toBe('https://wa.me/79612232716');
  expect(TELEGRAM_HREF).toBe('https://t.me/+79612232716');
});
it('links Avito to the exact listing confirmed by the owner', () => {
  expect(AVITO_HREF).toBe('https://m.avito.ru/budennovsk/ptitsy/yaytsa_perepelinye_inkubatsionnye_s_fermy_8177951194?context=H4sIAAAAAAAA_0q0MrKqLrYytlIqLkpWsi62srRSSkssyy_KLEktBvENrZQqQLSRkZWSR6GbWXhKZWqgU2aGpU9uVkhIeGBBoJJ1LSAAAP__gw6MaUYAAAA');
});
