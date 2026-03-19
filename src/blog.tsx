import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 口令 Cookie 名称
const PASSPHRASE_COOKIE_NAME = 'diary_passphrase';

// 日记索引项类型 - 日期字符串数组
// 例如: ["20260307", "20260314"]
type DiaryIndex = string[];

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
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-medium text-teal-700 tracking-wide mb-2">输入口令</h2>
          <p className="text-sm text-teal-400 font-light">不同口令看到不同日记</p>
        </div>

        {/* 输入框 */}
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

        {/* 确认按钮 */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-teal-400 text-white hover:bg-teal-500 transition-colors font-medium"
        >
          确认
        </button>
      </div>

      {/* 摇晃动画 */}
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

// 清除存储的口令
const clearPassphrase = () => {
  document.cookie = `${PASSPHRASE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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

// 日记列表组件
const DiaryList: React.FC<{ passphrase: string }> = ({ passphrase }) => {
  const [diaries, setDiaries] = useState<DiaryIndex>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 API 获取日记列表，按口令过滤
    fetch(`/api/diary/list?passphrase=${encodeURIComponent(passphrase)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDiaries(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [passphrase]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 animate-pulse">✨</div>
        <p className="text-teal-400 font-light">加载中...</p>
      </div>
    );
  }

  if (diaries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">💌</div>
        <p className="text-teal-400 font-light">暂无日记</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {diaries.map((dateId, index) => (
        <a
          key={dateId}
          href={`/blog/detail?id=${dateId}`}
          className="group block relative"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-200/50 to-cyan-200/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 shadow-md shadow-teal-100/50 hover:shadow-cyan-200/50 transition-all duration-500 hover:-translate-y-0.5 flex items-center justify-between">
            <time className="text-base font-light text-teal-600 tracking-wide">{formatDate(dateId)}</time>
            <span className="text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
          </div>
        </a>
      ))}
    </div>
  );
};

// 主页面组件
const DiaryPage: React.FC = () => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // 检查是否有存储的口令
    const stored = getStoredPassphrase();
    setPassphrase(stored);
    setIsChecking(false);
  }, []);

  const handleVerified = (newPassphrase: string) => {
    setPassphrase(newPassphrase);
  };

  const handleChangePassphrase = () => {
    clearPassphrase();
    setPassphrase('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* 装饰背景 */}
      <FloatingElements />
      
      {/* 装饰圆圈 */}
      <div className="fixed top-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl" />

      {/* 主内容 */}
      <main className="relative z-10 max-w-xl mx-auto px-6 py-12">
        {/* 标题区域 */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-light text-teal-500 tracking-widest mb-2">
            ✿ 心情日记 ✿
          </h1>
          <p className="text-teal-400 font-light text-sm">记录每一个温柔的时刻</p>
        </header>

        {/* 新建日记按钮和更改口令 */}
        <div className="text-center mb-6 space-y-3">
          <a
            href="/blog/edit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-400 text-white hover:bg-teal-500 transition-colors font-light text-sm"
          >
            <span>✨</span>
            <span>写日记</span>
          </a>
          <div>
            <button
              onClick={handleChangePassphrase}
              className="text-teal-400 hover:text-teal-500 text-xs font-light underline transition-colors"
            >
              更改口令
            </button>
          </div>
        </div>

        <DiaryList passphrase={passphrase} />
      </main>

      {/* 底部装饰 */}
      <div className="fixed bottom-6 left-0 right-0 text-center z-10">
        <a href="/" className="text-teal-400 hover:text-teal-500 text-sm font-light transition-colors">
          🏠 返回首页
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
      <DiaryPage />
    </React.StrictMode>
  );
}
