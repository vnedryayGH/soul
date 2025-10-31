import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTelegramUser, apiRequest, hasValidAuthToken } from '../api';
import { usePermissions } from '../hooks/usePermissions';
import { Button, Input, Space, Typography, message } from 'antd';

// Авторизация через мини-приложение Telegram
// 1) Проверяет, запущено ли приложение из Telegram WebApp
// 2) Если да - перенаправляет в основной интерфейс
// 3) Если нет - показывает инструкцию по запуску из мини-приложения

const WebAuth: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [manualTgId, setManualTgId] = useState<string>(() => {
    try { return sessionStorage.getItem('tg_id') || localStorage.getItem('tg_id') || ''; } catch { return ''; }
  });
  const [verifying, setVerifying] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [issuedOtp, setIssuedOtp] = useState<string>('');
  const [issuedTtl, setIssuedTtl] = useState<number>(0);
  const { refreshPermissions } = usePermissions();

  // Шаги авторизации: 0=detected tg_id, 1=OTP verifying, 2=verified&cookie, 3=roles loaded
  const [step, setStep] = useState<number>(0);
  const location = useLocation();
  const stepItems = useMemo(() => ([
    { title: 'MiniApp', description: 'tg_id найден' },
    { title: 'OTP', description: 'проверка кода' },
    { title: 'Сессия', description: 'токен/куки' },
    { title: 'Роли', description: 'полномочия загружены' },
  ]), []);

  const mapHttpError = (status: number, text: string) => {
    if (status === 401) return '401: нет cookie/Bearer или неверный OTP';
    if (status === 400) return '400: отсутствует tg_id или тело запроса';
    if (status === 404) return '404: маршрут не найден (проверьте alias /api/web-auth)';
    if (status >= 500) return `5xx: сервер/сеть недоступны (${status})`;
    return `Ошибка ${status}: ${text || 'неизвестная ошибка'}`;
  };

  useEffect(() => {
    console.log('[WEBAUTH] 🚀 Проверяем авторизацию через Telegram WebApp...');

    // Проверяем, запущено ли приложение из Telegram
    const checkTelegramAuth = async () => {
      const ensureSimpleReturn = (target?: string | null) => {
        try {
          let t = (target && decodeURIComponent(target)) || '/';
          const url = new URL(t, window.location.origin);
          if (!url.searchParams.get('simple')) {
            url.searchParams.set('simple', '1');
          }
          return url.pathname + (url.search || '');
        } catch {
          return '/?simple=1';
        }
      };
      // Проверяем URL параметры на наличие данных пользователя (HashRouter хранит их в location.search)
      const urlParams = new URLSearchParams(location.search || window.location.search || '');
      const tgIdParam = urlParams.get('tg_id');
      const userDataParam = urlParams.get('user_data');
      const otpParam = urlParams.get('otp') || urlParams.get('token') || urlParams.get('code');
      const returnTo = urlParams.get('return');

      console.log('[WEBAUTH] 🔍 URL параметры:', { tgIdParam, userDataParam, otp: otpParam ? 'найден' : 'не найден' });

      // 1. Приоритет: данные из URL параметров (переход из мини-приложения). Принимаем tg_id+otp даже без user_data.
      if (tgIdParam) {
        try {
          let userData: any = null;
          if (userDataParam) {
            // URLSearchParams уже декодирует значение, поэтому повторно декодировать не нужно
            userData = JSON.parse(userDataParam);
            console.log('[WEBAUTH] ✅ Найдены данные пользователя в URL:', userData);
          } else {
            console.log('[WEBAUTH] ⚠️ user_data отсутствует в URL, продолжаем по tg_id/otp');
          }
          setStep(0);
          
          // Сохраняем tg_id ДО вызова apiRequest, чтобы buildAuthHeaders() мог его найти
          try { sessionStorage.setItem('tg_id', tgIdParam); localStorage.setItem('tg_id', tgIdParam); } catch {}
          
          // Если есть OTP токен - проверяем его на сервере
          if (otpParam) {
            console.log('[WEBAUTH] 🔐 Проверяем OTP токен...');
            setStep(1);
            
            try {
              const data = await apiRequest('/web-auth/verify-otp', 'POST', { tg_id: parseInt(tgIdParam), otp: otpParam });
              console.log('[WEBAUTH] ✅ OTP токен валидный, авторизация успешна');
              
              // Сохраняем токен авторизации
              if (data.token) {
                try { sessionStorage.setItem('token', data.token); } catch {}
                try { localStorage.setItem('token', data.token); } catch {}
                try { window.dispatchEvent(new Event('sp:auth')); } catch {}
                // Пытаемся синхронизировать tg_id из JWT
                try {
                  const parts = String(data.token).split('.');
                  if (parts.length >= 2) {
                    const pad = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);
                    const b64 = pad(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
                    const json = typeof atob === 'function' ? decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')) : '';
                    if (json) {
                      const payload = JSON.parse(json);
                      const claimTg = String(payload.tg_id || payload.sub || '');
                      if (claimTg) { try { sessionStorage.setItem('tg_id', claimTg); } catch {} }
                    }
                  }
                } catch {}
                setStep(2);
                // Жёсткий рефреш полномочий до редиректа
                try { await refreshPermissions(); setStep(3); } catch {}
              }
            } catch (e: any) {
              const status = (e && e.status) || 0;
              const raw = (e && e.raw) || '';
              setError(mapHttpError(status, raw || String(e?.message || '')));
            }
          }
          if (userData) {
            try { sessionStorage.setItem('telegram_user', JSON.stringify(userData)); localStorage.setItem('telegram_user', JSON.stringify(userData)); } catch {}
          }
          try { window.dispatchEvent(new Event('sp:auth')); } catch {}
          
          setLoading(false);
          
          // Очищаем URL от параметров и сохраняем токен из sessionStorage/localStorage
          const cleanUrl = (() => {
            try {
              const u = new URL(window.location.href);
              u.search = '';
              return u.toString();
            } catch {
              return window.location.origin + window.location.pathname;
            }
          })();
          window.history.replaceState({}, document.title, cleanUrl);
          const target = ensureSimpleReturn(returnTo);
          navigate(target.startsWith('/') ? target : '/?simple=1', { replace: true });
          return;
        } catch (e) {
          console.error('[WEBAUTH] ❌ Ошибка парсинга данных из URL:', e);
        }
      }

      // 2. Проверяем Telegram WebApp (если приложение запущено в Telegram)
      const isTelegram = typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp;
      if (isTelegram) {
        try { (window as any).Telegram?.WebApp?.ready?.(); } catch {}
        const telegramUser = getTelegramUser();
        if (telegramUser && telegramUser.id) {
          console.log('[WEBAUTH] ✅ Пользователь авторизован через Telegram WebApp:', telegramUser.id);
          sessionStorage.setItem('tg_id', String(telegramUser.id));
          localStorage.setItem('tg_id', String(telegramUser.id));
          sessionStorage.setItem('telegram_user', JSON.stringify(telegramUser));
          localStorage.setItem('telegram_user', JSON.stringify(telegramUser));
          try { window.dispatchEvent(new Event('sp:auth')); } catch {}
        } else {
          console.log('[WEBAUTH] ⚠️ Telegram WebApp без initDataUnsafe.user; отображаем форму без редиректа');
        }
        // В Telegram-контексте показываем форму WebAuth без мгновенного редиректа,
        // чтобы пользователь мог вручную ввести OTP/JWT при необходимости.
        setLoading(false);
        return;
      }

      // 3. Проверяем существующие данные в SessionStorage — требуем валидный JWT
      const existingTgId = sessionStorage.getItem('tg_id');
      const existingUser = sessionStorage.getItem('telegram_user');
      const tokenOk = hasValidAuthToken();
      if (existingTgId && existingUser && tokenOk) {
        console.log('[WEBAUTH] ✅ Найдены tg_id/user + валидный токен:', existingTgId);
        setLoading(false);
        const usp = new URLSearchParams(location.search || window.location.search || '');
        const target = usp.get('return');
        const path = ensureSimpleReturn(target);
        navigate(path, { replace: true });
        return;
      }

      console.log('[WEBAUTH] ❌ Авторизация не найдена');
      setLoading(false);
      setError('Приложение должно быть запущено из Telegram мини-приложения');
    };

    // Небольшая задержка для инициализации Telegram WebApp
    setTimeout(checkTelegramAuth, 200);
  }, [refreshPermissions]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Проверяем авторизацию...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 24,
      padding: '20px',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#e3f2fd',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px'
        }}>
          ⚠️
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 16px 0'
        }}>
          Требуется авторизация
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 24px 0',
          lineHeight: '1.5'
        }}>
          Это веб-приложение работает только в рамках Telegram мини-приложения.
          Пожалуйста, откройте приложение через Telegram бота.
        </p>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', fontSize: 12, color: '#555' }}>
            {stepItems.map((it, idx) => (
              <div key={it.title} style={{ opacity: idx <= step ? 1 : 0.4 }}>
                <span style={{ fontWeight: 600 }}>{idx+1}.</span> {it.title}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 12px 0'
          }}>
            📱 Как открыть приложение:
          </h3>
          <ol style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#555',
            lineHeight: '1.6'
          }}>
            <li>Откройте Telegram</li>
            <li>Откройте мини‑приложение из Telegram (кнопка бота)</li>
            <li>Запустите мини-приложение</li>
            <li>Приложение откроется автоматически</li>
          </ol>
        </div>

        <div style={{ marginTop: 24, textAlign: 'left' }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>Вход по одноразовому коду</Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>Если у вас есть одноразовый код (token/code/otp), введите его ниже. Мы сверим код на сервере и выполним вход.</Typography.Paragraph>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:8, marginBottom:8 }}>
            <Input placeholder="Ваш Telegram ID (число)" value={manualTgId} onChange={e => setManualTgId(e.target.value)} />
          </div>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Введите одноразовый код" value={manualCode} onChange={e => setManualCode(e.target.value)} />
            <Button type="primary" loading={verifying} onClick={async () => {
              if (!manualCode.trim()) { message.warning('Введите код'); return; }
              const tgIdRaw = (manualTgId || '').trim() || sessionStorage.getItem('tg_id') || localStorage.getItem('tg_id') || '';
              if (!tgIdRaw) { message.warning('Укажите ваш Telegram ID'); return; }
              const tgIdNum = Number.parseInt(tgIdRaw, 10);
              if (!Number.isFinite(tgIdNum)) { message.warning('Telegram ID должен быть числом'); return; }
              try {
                setVerifying(true);
                setStep(1);
                const resp = await apiRequest('/web-auth/verify-otp', 'POST', { tg_id: tgIdNum, otp: manualCode.trim() });
                if (resp?.token) { try { sessionStorage.setItem('token', resp.token); } catch {}; try { localStorage.setItem('token', resp.token); } catch {}; }
                try { sessionStorage.setItem('tg_id', String(tgIdNum)); localStorage.setItem('tg_id', String(tgIdNum)); } catch {}
                setStep(2);
                try { await refreshPermissions(); setStep(3); } catch {}
                message.success('Авторизация успешна');
                const usp = new URLSearchParams(window.location.search);
                const target = usp.get('return');
                const ensure = (t?: string | null) => {
                  try {
                    let path = (t && decodeURIComponent(t)) || '/';
                    const u = new URL(path, window.location.origin);
                    if (!u.searchParams.get('simple')) u.searchParams.set('simple','1');
                    return u.pathname + (u.search || '');
                  } catch { return '/?simple=1'; }
                };
                window.location.replace(ensure(target));
              } catch (e: any) {
                const status = (e && e.status) || 0;
                const raw = (e && e.raw) || '';
                setError(mapHttpError(status, raw || String(e?.message || '')));
                message.error('Код не принят');
              } finally {
                setVerifying(false);
              }
            }}>Войти</Button>
          </Space.Compact>
          {/* Если страница открыта внутри Telegram WebApp — позволим сгенерировать код */}
          <div style={{ marginTop: 10 }}>
            {typeof window !== 'undefined' && (window as any).Telegram?.WebApp ? (
              <Space>
                <Button loading={issueLoading} onClick={async () => {
                  try {
                    setIssueLoading(true);
                    const resp = await apiRequest('/web-auth/issue-one-time-token', 'POST');
                    if (resp?.otp) {
                      setIssuedOtp(String(resp.otp));
                      setIssuedTtl(Number(resp.expires_in || 300));
                      message.success('Код сгенерирован');
                    } else {
                      message.error('Не удалось получить код');
                    }
                  } catch (e: any) {
                    message.error(String(e?.message || 'Ошибка генерации кода'));
                  } finally {
                    setIssueLoading(false);
                  }
                }}>Сгенерировать код в Telegram</Button>
                {issuedOtp ? (() => {
                  const origin = (typeof window !== 'undefined') ? window.location.origin : '';
                  const link = `${origin}/#/webauth?tg_id=${encodeURIComponent(String(manualTgId||''))}&otp=${encodeURIComponent(issuedOtp)}&return=%2F#/soul/city3d?simple=1`;
                  return (
                    <>
                      <Space.Compact>
                        <Input value={issuedOtp} readOnly style={{ width: 180 }} />
                        <Button onClick={() => { try { navigator.clipboard.writeText(issuedOtp); message.success('Код скопирован'); } catch {} }}>Копировать код</Button>
                        <Button disabled>{issuedTtl ? `TTL ~${Math.ceil(issuedTtl/60)} мин` : 'TTL'}</Button>
                      </Space.Compact>
                      <div style={{ marginTop: 8 }}>
                        <Space.Compact style={{ width: '100%' }}>
                          <Input value={link} readOnly />
                          <Button onClick={() => { try { navigator.clipboard.writeText(link); message.success('Ссылка скопирована'); } catch {} }}>Копировать ссылку</Button>
                        </Space.Compact>
                      </div>
                    </>
                  );
                })() : null}
              </Space>
            ) : null}
          </div>
        </div>

        {/* Ручной ввод JWT токена для временной сессии (админ/диагностика) */}
        <div style={{ marginTop: 16, textAlign: 'left' }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>Ввести JWT токен вручную</Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>Для диагностики/аварийного входа вставьте JWT. Токен будет сохранён в sessionStorage и применён к запросам (Authorization Bearer + cookie-сессия).</Typography.Paragraph>
          <Space.Compact style={{ width: '100%' }}>
            <Input.Password placeholder="Пастните JWT здесь" id="sp_manual_jwt_input" />
            <Button onClick={async () => {
              try {
                const el = document.getElementById('sp_manual_jwt_input') as HTMLInputElement | null;
                const tok = el?.value?.trim() || '';
                if (!tok) { message.warning('Вставьте JWT'); return; }
                try { sessionStorage.setItem('token', tok); } catch {}
                try { localStorage.setItem('token', tok); } catch {}
                // Синхронизируем tg_id из токена для корректного заголовка
                try {
                  const parts = tok.split('.')
                  if (parts.length >= 2) {
                    const pad = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);
                    const b64 = pad(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
                    const json = typeof atob === 'function' ? decodeURIComponent(Array.prototype.map.call(atob(b64), (c: string) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')) : '';
                    if (json) {
                      const payload = JSON.parse(json);
                      const claimTg = String(payload.tg_id || payload.sub || '');
                      if (claimTg) { try { sessionStorage.setItem('tg_id', claimTg); localStorage.setItem('tg_id', claimTg); } catch {} }
                    }
                  }
                } catch {}
                // Жёсткое обновление полномочий
                await refreshPermissions();
                message.success('JWT применён, роли обновлены');
              } catch (e) {
                message.error('Не удалось применить токен');
              }
            }}>Применить</Button>
          </Space.Compact>
        </div>

        <div style={{
          marginTop: '24px',
          padding: '12px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#2e7d32'
        }}>
          💡 <strong>Безопасность:</strong> Приложение получает доступ только к вашим данным в Telegram и сохраняет их только на время сессии.
        </div>
      </div>
    </div>
  );
};

export default WebAuth;


