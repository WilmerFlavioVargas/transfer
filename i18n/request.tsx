import { GetServerSidePropsContext } from 'next';
import { i18nConfig } from '../i18n.config';
import { notFound } from 'next/navigation';

export default async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, resolvedUrl } = context;

  // Valida que el idioma esté soportado
  if (!i18nConfig.locales.includes(locale as string)) {
    notFound();
    return { props: {} };
  }

  // Redirige a la URL con el locale correspondiente
  const localizedPath = `/${locale}${resolvedUrl}`;

  return {
    redirect: {
      destination: localizedPath,
      permanent: false
    }
  };
}




