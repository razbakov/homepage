export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "es", label: "Español", short: "ES" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "uk", label: "Українська", short: "UK" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export function useLanguageFilter() {
  const { locale } = useI18n();

  const language = computed(() => locale.value as LanguageCode);

  const filterByLanguage = <T extends { language?: string }>(
    posts: T[]
  ): T[] => {
    return posts.filter(
      (post) => (post.language || "en") === locale.value
    );
  };

  return {
    language,
    filterByLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
