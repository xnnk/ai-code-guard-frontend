'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatedCodeApi } from '@/lib/api/generated-code';
import { codeSecurityApi } from '@/lib/api/code-security';
import { GeneratedCodeDocument } from '@/types/api';
import { toast } from 'react-hot-toast';

export default function GeneratedCodesPage() {
  const router = useRouter();
  const [codes, setCodes] = useState<GeneratedCodeDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await generatedCodeApi.getCodeList();
      if (response.status === 200) {
        setCodes(response.data);
      }
    } catch (error) {
      console.error('获取代码列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCode = async (codeId: string) => {
    if (!confirm('确定要删除这个代码吗？')) return;

    try {
      const response = await generatedCodeApi.deleteCode(codeId);
      if (response.status === 200) {
        setCodes(prev => prev.filter(code => code.id !== codeId));
        toast.success('代码已删除');
      }
    } catch (error) {
      console.error('删除代码失败:', error);
    }
  };

  const triggerScan = async (codeId: string) => {
    try {
      const response = await codeSecurityApi.scanCode(codeId);
      if (response.status === 200) {
        toast.success('安全扫描已启动');
        // 更新扫描状态
        setCodes(prev =>
          prev.map(code =>
            code.id === codeId
              ? { ...code, scanStatus: 'SCANNING' }
              : code
          )
        );
        
        // 轮询检查扫描结果
        checkScanStatus(codeId);
      }
    } catch (error) {
      console.error('触发扫描失败:', error);
    }
  };

  const checkScanStatus = async (codeId: string) => {
    const maxAttempts = 10;
    const interval = 3000; // 3秒轮询一次
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      
      try {
        const response = await codeSecurityApi.getScanResult(codeId);
        if (response.status === 200) {
          setCodes(prev =>
            prev.map(code =>
              code.id === codeId
                ? { ...code, scanStatus: 'COMPLETED' }
                : code
            )
          );
          toast.success('扫描完成');
          break;
        }
      } catch (error) {
        // 继续轮询
        if (i === maxAttempts - 1) {
          setCodes(prev =>
            prev.map(code =>
              code.id === codeId
                ? { ...code, scanStatus: 'FAILED' }
                : code
            )
          );
          toast.error('扫描超时，请稍后查看结果: '+ error);
        }
      }
    }
  };

  const viewScanResult = (codeId: string) => {
    router.push(`/security-scan/${codeId}`);
  };

  const getScanStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { text: '待扫描', color: 'bg-gray-500' },
      SCANNING: { text: '扫描中', color: 'bg-yellow-500' },
      COMPLETED: { text: '已完成', color: 'bg-green-500' },
      FAILED: { text: '扫描失败', color: 'bg-red-500' },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.PENDING;
    return (
      <span className={`px-2 py-1 text-xs text-white rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">生成的代码</h1>
        <button
          onClick={() => router.push('/code-generator')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          生成新代码
        </button>
      </div>

      {codes.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <div className="text-lg mb-4">还没有生成任何代码</div>
          <button
            onClick={() => router.push('/code-generator')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            开始生成代码
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {codes.map((code) => (
            <div key={code.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{code.language} 代码</h3>
                {getScanStatusBadge(code.scanStatus)}
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <div>模型: {code.aiModel}</div>
                <div>创建时间: {formatDate(code.createdAt)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">提示词:</div>
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {code.prompt}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">代码预览:</div>
                <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                  {code.content.length > 300
                    ? code.content.substring(0, 300) + '...'
                    : code.content}
                </pre>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => router.push(`/code-detail/${code.id}`)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  查看完整代码
                </button>
                
                {code.scanStatus === 'COMPLETED' ? (
                  <button
                    onClick={() => viewScanResult(code.id)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    查看扫描结果
                  </button>
                ) : (
                  <button
                    onClick={() => triggerScan(code.id)}
                    disabled={code.scanStatus === 'SCANNING'}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                  >
                    {code.scanStatus === 'SCANNING' ? '扫描中...' : '开始扫描'}
                  </button>
                )}

                <button
                  onClick={() => deleteCode(code.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
