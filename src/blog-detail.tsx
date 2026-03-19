import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DiaryContent } from './apps/diary/components/DiaryContent';

// 口令 Cookie 名称
const PASSPHRASE_COOKIE_NAME = 'diary_passphrase';

// 日记详情类型
interface DiaryDetail {
  date: string;  // 日期ID，格式：YYYYMMDD
  content: string;  // 纯文本内容
}

// 获取存储的口令
const getStoredPassphrase = (): string => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === PASSPHRASE_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return '';
};

// 保存口令到 cookie
const savePassphrase = (passphrase: string) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  document.cookie = `${PASSPHRASE_COOKIE_NAME}=${encodeURIComponent(passphrase)}; expires=${expires.toUTCString()}; path=/`;
};

// 格式化日期 (YYYYMMDD -> X月X日 周X)
const formatDate = (dateStr: string) => {
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6));
  const day = parseInt(dateStr.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
};

// 装饰元素组件
const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${10 + i * 12}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          <span className="text-2xl opacity-40">
            {['🌿', '🍃', '💧', '✿', '❀', '🌊', '☘️', '✿'][i]}
          </span>
        </div>
      ))}
    </div>
  );
};

// 口令输入组件
const PassphraseInput: React.FC<{ onVerified: (passphrase: string) => void }> = ({ onVerified }) => {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleConfirm = () => {
    if (input.trim()) {
      savePassphrase(input.trim());
      onVerified(input.trim());
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-6">
      <div className={`
        bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-teal-100/50 border border-white/50
        max-w-sm w-full
        ${shake ? 'animate-shake' : ''}
      `}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-medium text-teal-700 tracking-wide mb-2">输入口令</h2>
          <p className="text-sm text-teal-400 font-light">不同口令看到不同日记</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className="
              w-full px-4 py-3 text-center text-xl
              bg-white/50 border-2 rounded-xl
              border-teal-200 text-teal-700 focus:border-teal-400 focus:bg-teal-50
              outline-none transition-colors
            "
            placeholder="请输入口令"
          />
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-teal-400 text-white hover:bg-teal-500 transition-colors font-medium"
        >
          确认
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// 日记详情页
const DiaryDetailPage: React.FC<{ id: string; passphrase: string }> = ({ id, passphrase }) => {
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 从 API 获取日记详情
    fetch(`/api/diary/${id}?passphrase=${encodeURIComponent(passphrase)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDiary({ date: data.data.id, content: data.data.content });
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id, passphrase]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 animate-pulse">✨</div>
        <p className="text-teal-400 font-light">加载中...</p>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🥀</div>
        <p className="text-teal-400 font-light mb-4">日记不存在</p>
        <a href="/blog" className="text-cyan-500 hover:text-cyan-600 transition-colors">
          返回列表
        </a>
      </div>
    );
  }

  return (
    <article className="relative">
      {/* 返回按钮和编辑按钮 */}
      <div className="absolute -left-2 -top-2 flex items-center gap-2 z-10">
        <a
          href="/blog"
          className="w-10 h-10 flex items-center justify-center text-teal-400 hover:text-teal-500 transition-colors"
        >
          <span className="text-2xl">←</span>
        </a>
      </div>

      {/* 日期 */}
      <div className="mb-6 pt-2">
        <time className="text-lg font-light text-teal-500 tracking-wide">{formatDate(diary.date)}</time>
      </div>

      {/* 内容 */}
      <DiaryContent 
        textContent={diary.content} 
        className="text-teal-600 leading-loose text-lg font-light"
      />
    </article>
  );
};

// 主页面组件
const DiaryDetailApp: React.FC = () => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [diaryId, setDiaryId] = useState<string>('');

  useEffect(() => {
    // 检查是否有存储的口令
    const stored = getStoredPassphrase();
    setPassphrase(stored);
    setIsChecking(false);

    // 从 query 参数获取日记 ID
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setDiaryId(id);
    }
  }, []);

  const handleVerified = (newPassphrase: string) => {
    setPassphrase(newPassphrase);
  };

  // 加载中
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">✨</div>
          <p className="text-teal-400 font-light">加载中...</p>
        </div>
      </div>
    );
  }

  // 没有口令，显示输入界面
  if (!passphrase) {
    return <PassphraseInput onVerified={handleVerified} />;
  }

  // 没有 id 参数，返回列表
  if (!diaryId) {
    window.location.href = '/blog';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* 装饰背景 */}
      <FloatingElements />
      
      {/* 装饰圆圈 */}
      <div className="fixed top-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl" />

      {/* 主内容 */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-12">
        <DiaryDetailPage id={diaryId} passphrase={passphrase} />
      </main>

      {/* 底部装饰 */}
      <div className="fixed bottom-6 left-0 right-0 text-center z-10">
        <a href="/blog" className="text-teal-400 hover:text-teal-500 text-sm font-light transition-colors">
          🏠 返回列表
        </a>
      </div>

      {/* 自定义动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DiaryDetailApp />
    </React.StrictMode>
  );
}
