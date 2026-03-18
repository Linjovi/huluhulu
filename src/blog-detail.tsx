import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DiaryContent } from './apps/diary/components/DiaryContent';

// 验证 Cookie 名称
const AUTH_COOKIE_NAME = 'blog_auth_verified';

// 日记详情类型
interface DiaryDetail {
  id: string;
  date: string;
  content: string;
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
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
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-medium text-teal-700 tracking-wide mb-2">对口令</h2>
        </div>

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

        {error && (
          <div className="text-center mb-4 text-red-400 text-sm animate-pulse">
            口令错误，请重试
          </div>
        )}

        <button
          onClick={handleVerify}
          className="w-full py-3 mb-3 rounded-xl bg-teal-400 text-white hover:bg-teal-500 transition-colors font-medium"
        >
          确认
        </button>

        <button
          onClick={handleClear}
          className="w-full py-3 rounded-xl text-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors text-sm font-light"
        >
          清除重输
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
const DiaryDetailPage: React.FC<{ id: string }> = ({ id }) => {
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/diary/content/${id}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setDiary(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

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
      {/* 返回按钮 */}
      <a
        href="/blog"
        className="absolute -left-2 -top-2 w-10 h-10 flex items-center justify-center text-teal-400 hover:text-teal-500 transition-colors z-10"
      >
        <span className="text-2xl">←</span>
      </a>

      {/* 日期 */}
      <div className="mb-6 pt-2">
        <time className="text-lg font-light text-teal-500 tracking-wide">{formatDate(diary.date)}</time>
      </div>

      {/* 内容 */}
      <DiaryContent 
        htmlContent={diary.content} 
        className="text-teal-600 leading-loose text-lg font-light"
      />
    </article>
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
const DiaryDetailApp: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [diaryId, setDiaryId] = useState<string>('');

  useEffect(() => {
    // 检查验证状态
    const verified = checkAuthStatus();
    setIsVerified(verified);
    setIsChecking(false);

    // 从 query 参数获取日记 ID
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setDiaryId(id);
    }
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
        <DiaryDetailPage id={diaryId} />
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
