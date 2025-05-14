'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatedCodeApi } from '@/lib/api/generated-code';
import { GeneratedCodeDocument } from '@/types/api';

export default function DashboardPage() {
  const router = useRouter();
  const [recentCodes, setRecentCodes] = useState<GeneratedCodeDocument[]>([]);
  const [stats, setStats] = useState({
    totalCodes: 0,
    completedScans: 0,
    criticalVulns: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await generatedCodeApi.getCodeList();
      if (response.status === 200) {
        const codes = response.data;
        setRecentCodes(codes.slice(0, 5)); // 显示最近5个
        
        // 计算统计数据
        setStats({
          totalCodes: codes.length,
          completedScans: codes.filter(code => code.scanStatus === 'COMPLETED').length,
          criticalVulns: 0, // 这需要额外的API调用来计算
        });
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '无效日期';
      }
      return date.toLocaleDateString('zh-CN');
    } catch (error) {
      console.error('日期解析错误:', error);
      return '无效日期';
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">📝</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">生成代码数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCodes}</p>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">🔒</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">已完成扫描</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedScans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl">⚠️</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">高危漏洞</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalVulns}</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push('/code-generator')}
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <div className="text-2xl mb-2">🤖</div>
          <h3 className="text-lg font-semibold">生成新代码</h3>
          <p className="text-sm opacity-90">使用AI生成代码</p>
        </button>

        <button
          onClick={() => router.push('/conversations')}
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition-colors"
        >
          <div className="text-2xl mb-2">💬</div>
          <h3 className="text-lg font-semibold">AI 对话</h3>
          <p className="text-sm opacity-90">与AI助手交流</p>
        </button>

        <button
          onClick={() => router.push('/generated-codes')}
          className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 transition-colors"
        >
          <div className="text-2xl mb-2">📄</div>
          <h3 className="text-lg font-semibold">查看代码</h3>
          <p className="text-sm opacity-90">管理已生成的代码</p>
        </button>
      </div>

      {/* 最近生成的代码 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">最近生成的代码</h2>
        </div>
        <div className="p-6">
          {recentCodes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              还没有生成任何代码
              <div className="mt-4">
                <button
                  onClick={() => router.push('/code-generator')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  立即开始生成代码 →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCodes.map((code) => (
                <div key={code.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{code.language} - {code.prompt.substring(0, 50)}...</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(code.createdAt)} | 模型: {code.aiModel}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/code-detail/${code.id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      查看
                    </button>
                    {code.scanStatus === 'COMPLETED' && (
                      <button
                        onClick={() => router.push(`/security-scan/${code.id}`)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        扫描结果
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}