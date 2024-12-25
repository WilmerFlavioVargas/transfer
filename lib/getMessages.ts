import { createTranslator } from 'next-intl';

export async function getMessages(locale: string) {
  return (await import(`../messages/${locale}.json`)).default;
}

export async function getIntl(locale: string) {
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });
  return { locale, messages, t };
}


