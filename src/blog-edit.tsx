import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 口令 Cookie 名称
const PASSPHRASE_COOKIE_NAME = 'diary_passphrase';

// 日记数据类型
interface DiaryData {
  id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
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

// 格式化日期为 YYYYMMDD 格式
const formatDateId = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// 格式化日期为显示格式 (YYYYMMDD -> X月X日 周X)
const formatDateDisplay = (dateStr: string) => {
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6));
  const day = parseInt(dateStr.slice(6, 8));
  const date = new Date(year, month - 1, day);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日 ${weekday}`;
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

// 日记编辑器组件
const DiaryEditor: React.FC<{ 
  diaryId?: string;
  passphrase: string;
  onSaveSuccess: (id: string) => void;
}> = ({ diaryId, passphrase, onSaveSuccess }) => {
  const isNew = !diaryId;
  const [date, setDate] = useState(formatDateId(new Date()));
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载现有日记
  useEffect(() => {
    if (diaryId) {
      setLoading(true);
      fetch(`/api/diary/${diaryId}?passphrase=${encodeURIComponent(passphrase)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setDate(data.data.id);
            setContent(data.data.content);
          } else {
            setError('加载日记失败');
          }
        })
        .catch(() => setError('加载日记失败'))
        .finally(() => setLoading(false));
    }
  }, [diaryId, passphrase]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError('日记内容不能为空');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let response;
      if (isNew) {
        // 创建新日记，关联当前口令
        response = await fetch('/api/diary/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: date, content, passphrase }),
        });
      } else {
        // 更新现有日记
        response = await fetch(`/api/diary/update/${diaryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, passphrase }),
        });
      }

      const data = await response.json();
      
      if (data.success) {
        onSaveSuccess(isNew ? date : diaryId!);
      } else {
        setError(data.error || '保存失败');
      }
    } catch (err) {
      setError('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 animate-pulse">✨</div>
        <p className="text-teal-400 font-light">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-light text-teal-600 tracking-wide">
          {isNew ? '✨ 新日记' : '📝 编辑日记'}
        </h1>
      </div>

      {/* 日期选择 */}
      <div className="space-y-2">
        <label className="block text-teal-500 font-light text-sm">日期</label>
        <input
          type="date"
          value={`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`}
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            setDate(formatDateId(selectedDate));
          }}
          disabled={!isNew}
          className={`
            w-full px-4 py-3 rounded-xl border-2 
            ${isNew 
              ? 'bg-white/50 border-teal-200 text-teal-700 focus:border-teal-400 focus:bg-teal-50' 
              : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
            }
            outline-none transition-colors
          `}
        />
        <p className="text-xs text-teal-400 font-light">
          {formatDateDisplay(date)}
        </p>
      </div>

      {/* 内容编辑 */}
      <div className="space-y-2">
        <label className="block text-teal-500 font-light text-sm">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下今天的故事..."
          rows={12}
          className="w-full px-4 py-3 rounded-xl border-2 border-teal-200 bg-white/50 text-teal-700 focus:border-teal-400 focus:bg-teal-50 outline-none transition-colors resize-none leading-relaxed"
        />
        <p className="text-xs text-teal-400 font-light text-right">
          {content.length} 字
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="text-center text-red-400 text-sm animate-pulse">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => window.location.href = '/blog'}
          className="flex-1 py-3 rounded-xl border-2 border-teal-200 text-teal-500 hover:bg-teal-50 transition-colors font-light"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            flex-1 py-3 rounded-xl transition-colors font-medium
            ${saving 
              ? 'bg-teal-200 text-white cursor-not-allowed' 
              : 'bg-teal-400 text-white hover:bg-teal-500'
            }
          `}
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
};

// 主页面组件
const DiaryEditApp: React.FC = () => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [diaryId, setDiaryId] = useState<string | undefined>(undefined);

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

  const handleSaveSuccess = (id: string) => {
    window.location.href = `/blog/detail?id=${id}`;
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
        {/* 返回按钮 */}
        <a
          href="/blog"
          className="absolute -left-2 top-10 w-10 h-10 flex items-center justify-center text-teal-400 hover:text-teal-500 transition-colors z-10"
        >
          <span className="text-2xl">←</span>
        </a>
        
        <DiaryEditor diaryId={diaryId} passphrase={passphrase} onSaveSuccess={handleSaveSuccess} />
      </main>

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
      <DiaryEditApp />
    </React.StrictMode>
  );
}
