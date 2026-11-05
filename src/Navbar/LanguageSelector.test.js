import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LANGUAGE_STORAGE_KEY, LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

function Page() {
    const { t } = useLanguage();
    const [draft, setDraft] = useState('');
    return <>
        <LanguageSelector />
        <h1>{t('خدمات', 'Services')}</h1>
        <label>{t('نام', 'Name')}<input value={draft} onChange={(event) => setDraft(event.target.value)} /></label>
    </>;
}

beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
});
afterEach(() => { jest.restoreAllMocks(); });

function openMenu() {
    const trigger = screen.getByRole('button', { name: /انتخاب زبان|Choose language/ });
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
        x: 10, y: 10, width: 40, height: 40, top: 10, left: 10, bottom: 50, right: 50, toJSON: () => ({}),
    });
    trigger.focus();
    fireEvent.click(trigger);
    return trigger;
}

test('actual globe menu exposes Persian and English radio options and switches content without losing form drafts', async () => {
    render(<LanguageProvider><Page /></LanguageProvider>);
    fireEvent.change(screen.getByRole('textbox', { name: 'نام' }), { target: { value: 'Unsaved notes' } });
    const trigger = openMenu();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toHaveAttribute('aria-labelledby', 'language-selector-trigger');
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(2);
    expect(screen.getByRole('menuitemradio', { name: /فارسی/ })).toHaveAttribute('aria-checked', 'true');
    const english = screen.getByRole('menuitemradio', { name: /English/ });
    expect(english).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(english);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Unsaved notes');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(screen.getByRole('button', { name: 'Choose language' })).toHaveAttribute('aria-expanded', 'false');
    openMenu();
    expect(screen.getByRole('menuitemradio', { name: /English/ })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(screen.getByRole('menuitemradio', { name: /فارسی/ }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'خدمات' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'نام' })).toHaveValue('Unsaved notes');
});

test('menu options support arrow-key navigation and Escape dismisses without changing language', async () => {
    render(<LanguageProvider><Page /></LanguageProvider>);
    openMenu();
    const persian = screen.getByRole('menuitemradio', { name: /فارسی/ });
    const english = screen.getByRole('menuitemradio', { name: /English/ });
    await waitFor(() => expect(persian).toHaveFocus());
    fireEvent.keyDown(persian, { key: 'ArrowDown' });
    expect(english).toHaveFocus();
    fireEvent.keyDown(english, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'خدمات' })).toBeInTheDocument();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole('button', { name: 'انتخاب زبان' })).toHaveFocus();
});
