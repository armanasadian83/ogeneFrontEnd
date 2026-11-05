import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
    LANGUAGE_STORAGE_KEY, LanguageProvider, localizedField, readStoredLanguage, translate, useLanguage,
} from './LanguageContext';

function LanguageProbe() {
    const { language, dir, locale, isEnglish, setLanguage, t, localize } = useLanguage();
    return <>
        <button onClick={() => setLanguage('en')}>Select English</button>
        <button onClick={() => setLanguage('fa')}>Select Persian</button>
        <button onClick={() => setLanguage('unsupported')}>Select unsupported</button>
        <output data-testid="language">{language}</output>
        <output data-testid="direction">{dir}</output>
        <output data-testid="locale">{locale}</output>
        <output data-testid="is-english">{String(isEnglish)}</output>
        <p>{t('خانه')}</p>
        <p>{localize({ name: 'عنوان فارسی', nameEn: 'English title' }, 'name')}</p>
    </>;
}

beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    document.documentElement.lang = '';
    document.documentElement.dir = '';
    document.body.style.direction = '';
});
afterEach(() => { jest.restoreAllMocks(); });

test('Persian is the default with matching document language and direction', () => {
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
    expect(screen.getByTestId('direction')).toHaveTextContent('rtl');
    expect(screen.getByTestId('locale')).toHaveTextContent('fa-IR');
    expect(screen.getByTestId('is-english')).toHaveTextContent('false');
    expect(screen.getByText('خانه')).toBeInTheDocument();
    expect(screen.getByText('عنوان فارسی')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('lang', 'fa');
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.body.style.direction).toBe('rtl');
});

test('English selection updates content and document attributes, persists, and survives remount', () => {
    localStorage.setItem('token', 'existing-session');
    localStorage.setItem('user', 'existing-profile');
    const view = render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Select English' }));
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
    expect(screen.getByTestId('is-english')).toHaveTextContent('true');
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('English title')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    expect(document.body.style.direction).toBe('ltr');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(localStorage.getItem('token')).toBe('existing-session');
    expect(localStorage.getItem('user')).toBe('existing-profile');
    view.unmount();
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    fireEvent.click(screen.getByRole('button', { name: 'Select Persian' }));
    expect(document.documentElement).toHaveAttribute('lang', 'fa');
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('fa');
});

test('unsupported stored or selected languages fall back to Persian', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'unsupported');
    expect(readStoredLanguage()).toBe('fa');
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Select English' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select unsupported' }));
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('fa');
});

test('blocked storage reads and writes do not prevent in-memory language selection', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    expect(readStoredLanguage()).toBe('fa');
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Select English' }));
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    fireEvent.click(screen.getByRole('button', { name: 'Select Persian' }));
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
});

test('cross-tab changes synchronize the language and ignore unrelated storage keys', () => {
    render(<LanguageProvider><LanguageProbe /></LanguageProvider>);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' })); });
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: LANGUAGE_STORAGE_KEY })); });
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: null })); });
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
});

test('switching localized page content preserves draft form inputs and the current URL', () => {
    function Page() {
        const { t } = useLanguage();
        const [name, setName] = useState('');
        return <><h1>{t('خدمات', 'Services')}</h1><label>{t('نام', 'Name')}
            <input value={name} onChange={(event) => setName(event.target.value)} />
        </label><LanguageProbe /></>;
    }
    window.history.replaceState({}, '', '/services?field=genetics');
    render(<LanguageProvider><Page /></LanguageProvider>);
    fireEvent.change(screen.getByRole('textbox', { name: 'نام' }), { target: { value: 'Unsubmitted draft' } });
    fireEvent.click(screen.getByRole('button', { name: 'Select English' }));
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Unsubmitted draft');
    expect(window.location.pathname + window.location.search).toBe('/services?field=genetics');
});

test('isolated components receive the existing Persian fallback without a provider', () => {
    render(<LanguageProbe />);
    expect(screen.getByTestId('language')).toHaveTextContent('fa');
    expect(screen.getByText('عنوان فارسی')).toBeInTheDocument();
});

test.each([
    ['English text', 'English text'], ['', 'فارسی'], ['   \n\t', 'فارسی'], [undefined, 'فارسی'], [null, 'فارسی'], [123, 'فارسی'],
])('record localization uses nonblank English content or the original Persian (%p)', (nameEn, expected) => {
    const record = { name: 'فارسی', nameEn };
    expect(localizedField(record, 'name', 'en')).toBe(expected);
    expect(localizedField(record, 'name', 'fa')).toBe('فارسی');
    expect(record).toEqual({ name: 'فارسی', nameEn });
});

test('missing records and missing fields have a safe empty fallback', () => {
    expect(localizedField(undefined, 'name', 'en')).toBe('');
    expect(localizedField({}, 'name', 'en')).toBe('');
    expect(localizedField({ nameEn: 'English only' }, 'name', 'en')).toBe('English only');
});

test('translated arrays retain untranslated Persian entries by index and preserve identifiers', () => {
    const record = { event: ['اول', 'دوم', 'سوم', 'چهارم'], eventEn: ['First', '', '  ', 'Fourth', 'Unused'] };
    expect(localizedField(record, 'event', 'en')).toEqual(['First', 'دوم', 'سوم', 'Fourth']);
    expect(localizedField(record, 'event', 'fa')).toEqual(record.event);
    expect(localizedField({ event: record.event, eventEn: ['First'] }, 'event', 'en')).toEqual(['First', 'دوم', 'سوم', 'چهارم']);
    const prerequisites = ['111111111111111111111111'];
    expect(localizedField({ prerequisite: prerequisites }, 'prerequisite', 'en')).toEqual(prerequisites);
    expect(record.event).toEqual(['اول', 'دوم', 'سوم', 'چهارم']);
});

test('shared labels normalize Persian/Arabic spellings and interpolate without losing unknown content', () => {
    expect(translate('en', 'ميكروبيولوژي')).toBe('Microbiology');
    expect(translate('en', '  خانه \n')).toBe('  Home \n');
    expect(translate('en', 'متن بدون ترجمه')).toBe('متن بدون ترجمه');
    expect(translate('en', 'سلام {name}', 'Hello {name}', { name: 'Arman' })).toBe('Hello Arman');
    expect(translate('fa', 'سلام {name}', 'Hello {name}', { name: 'آرمان' })).toBe('سلام آرمان');
});
