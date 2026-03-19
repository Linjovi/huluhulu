/**
 * Diary API client for frontend
 */

export interface DiaryData {
  id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get diary list
 */
export async function getDiaryList(): Promise<ApiResponse<string[]>> {
  try {
    const response = await fetch('/api/diary/list');
    return response.json();
  } catch (error) {
    return { success: false, error: '获取日记列表失败' };
  }
}

/**
 * Get diary by ID
 */
export async function getDiaryById(id: string): Promise<ApiResponse<DiaryData>> {
  try {
    const response = await fetch(`/api/diary/${id}`);
    return response.json();
  } catch (error) {
    return { success: false, error: '获取日记失败' };
  }
}

/**
 * Create a new diary
 */
export async function createDiary(id: string, content: string): Promise<ApiResponse<DiaryData>> {
  try {
    const response = await fetch('/api/diary/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: '创建日记失败' };
  }
}

/**
 * Update an existing diary
 */
export async function updateDiary(id: string, content: string): Promise<ApiResponse<DiaryData>> {
  try {
    const response = await fetch(`/api/diary/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: '更新日记失败' };
  }
}
