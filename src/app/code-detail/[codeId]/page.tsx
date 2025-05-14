'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { generatedCodeApi } from '@/lib/api/generated-code';
import { codeSecurityApi } from '@/lib/api/code-security';
import { GeneratedCodeDocument } from '@/types/api';

export default function CodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const codeId = params.codeId as string;
  
  const [code, setCode] = useState<GeneratedCodeDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCodeDetail();
  }, [codeId]);

  const fetchCodeDetail = async () => {
    try {
      const response = await generatedCodeApi.getCodeDetail(codeId);
      if (response.status === 200) {
        setCode(response.data);
      }
    } catch (error) {
      console.error('获取代码详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async () => {
    if (!code) return;
    
    try {
      const response = await codeSecurityApi.scanCode(code.id);
      if (response.status === 200) {
        setCode(prev => prev ? { ...prev, scanStatus: 'SCANNING' } : null);
      }
    } catch (error) {
      console.error('触发扫描失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('zh-CN');
    } catch {
      return '无效日期';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-red-500">未找到代码详情</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">代码详情</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            返回
          </button>
          {code.scanStatus === 'COMPLETED' ? (
            <button
              onClick={() => router.push(`/security-scan/${code.id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              查看扫描结果
            </button>
          ) : (
            <button
              onClick={triggerScan}
              disabled={code.scanStatus === 'SCANNING'}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {code.scanStatus === 'SCANNING' ? '扫描中...' : '开始扫描'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              编程语言
            </label>
            <div className="text-lg">{code.language}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI 模型
            </label>
            <div className="text-lg">{code.aiModel}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              创建时间
            </label>
            <div className="text-lg">{formatDate(code.createdAt)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              扫描状态
            </label>
            <div className="text-lg">
              <span className={`px-2 py-1 text-xs rounded-full ${
                code.scanStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                code.scanStatus === 'SCANNING' ? 'bg-yellow-100 text-yellow-800' :
                code.scanStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {code.scanStatus === 'COMPLETED' ? '已完成' :
                 code.scanStatus === 'SCANNING' ? '扫描中' :
                 code.scanStatus === 'FAILED' ? '扫描失败' : '待扫描'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            提示词
          </label>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {code.prompt}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            生成的代码
          </label>
          <Editor
            height="600px"
            language={code.language}
            value={code.content}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 14,
              lineNumbers: 'on',
              minimap: { enabled: true },
            }}
          />
        </div>
      </div>
    </div>
  );
}