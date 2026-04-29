import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'andreiucm-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly darkMode = signal(this.getInitialDarkMode());

  readonly isDarkMode = this.darkMode.asReadonly();

  constructor() {
    effect(() => {
      const isDark = this.darkMode();
      this.document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    });
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.set(isDark);
  }

  toggleDarkMode(): void {
    this.darkMode.update(isDark => !isDark);
  }

  private getInitialDarkMode(): boolean {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme) {
      return storedTheme === 'dark';
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
