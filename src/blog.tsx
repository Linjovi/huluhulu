import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 验证 Cookie 名称
const AUTH_COOKIE_NAME = 'blog_auth_verified';

// 日记索引项类型 - 日期字符串数组
// 例如: ["20260307", "20260314"]
type DiaryIndex = string[];

// 密码验证组件
const PasswordAuth: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const correctPassword = '枕边书怀中猫意中人';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(false);
  };

  const handleVerify = () => {
    if (input === correctPassword) {
      // 设置 cookie，有效期 30 天
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `${AUTH_COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/`;
      onVerified();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
    }
  };

  const handleClear = () => {
    setInput('');
    setError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
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
          <h2 className="text-xl font-medium text-teal-700 tracking-wide mb-2">对口令</h2>
        </div>

        {/* 输入框 */}
        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={9}
            autoFocus
            className={`
              w-full px-4 py-3 text-center text-xl tracking-widest
              bg-white/50 border-2 rounded-xl
              outline-none transition-colors
              ${error
                ? 'border-red-300 bg-red-50 text-red-600'
                : 'border-teal-200 text-teal-700 focus:border-teal-400 focus:bg-teal-50'
              }
            `}
            placeholder="请输入"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="text-center mb-4 text-red-400 text-sm animate-pulse">
            口令错误，请重试
          </div>
        )}

        {/* 确认按钮 */}
        <button
          onClick={handleVerify}
          className="w-full py-3 mb-3 rounded-xl bg-teal-400 text-white hover:bg-teal-500 transition-colors font-medium"
        >
          确认
        </button>

        {/* 清除按钮 */}
        <button
          onClick={handleClear}
          className="w-full py-3 rounded-xl text-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors text-sm font-light"
        >
          清除重输
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
const DiaryList: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryIndex>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/diary/content/index.json')
      .then(res => res.json())
      .then(data => {
        setDiaries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

// 检查是否已验证
const checkAuthStatus = (): boolean => {
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => {
    const [name, value] = cookie.trim().split('=');
    return name === AUTH_COOKIE_NAME && value === 'true';
  });
};

// 主页面组件
const DiaryPage: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // 检查验证状态
    const verified = checkAuthStatus();
    setIsVerified(verified);
    setIsChecking(false);
  }, []);

  const handleVerified = () => {
    setIsVerified(true);
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

  // 未验证，显示验证界面
  if (!isVerified) {
    return <PasswordAuth onVerified={handleVerified} />;
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

        <DiaryList />
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
