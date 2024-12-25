import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define los idiomas soportados
export const locales = ['en', 'es', 'fr'];
export const defaultLocale = 'en';

// Exporta i18nConfig como un objeto unificado
export const i18nConfig = {
  locales,
  defaultLocale,
  getRequestConfig: getRequestConfig(async ({ locale }) => {
    // Valida que el locale solicitado esté soportado
    if (!locales.includes(locale as any)) notFound();

    return {
      messages: (await import(`./messages/${locale}.json`)).default
    };
  })
};

// Función auxiliar para obtener el path con el locale
export function getI18nPath(path: string, locale: string) {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

// Función auxiliar para eliminar el locale del path
export function removeLocaleFromPath(path: string) {
  return path.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';
}



