import ko from '@/locales/ko.json';
import en from '@/locales/en.json';

const messages = { ko, en } as const;

export type Lang = 'ko' | 'en';
export type MessageKey = keyof typeof ko;

export function t(lang: Lang, key: MessageKey): string {
  return messages[lang][key] ?? messages['ko'][key];
}
