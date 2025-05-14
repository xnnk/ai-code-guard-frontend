'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { codeSecurityApi } from '@/lib/api/code-security';
import { generatedCodeApi } from '@/lib/api/generated-code';
import { VulnerabilityReport, GeneratedCodeDocument} from '@/types/api';

export default function SecurityScanPage() {
  const params = useParams();
  const router = useRouter();
  const codeId = params.codeId as string;
  
  const [code, setCode] = useState<GeneratedCodeDocument | null>(null);
  const [scanResult, setScanResult] = useState<VulnerabilityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [codeId]);

  const fetchData = async () => {
    try {
      // 获取代码详情
      const codeResponse = await generatedCodeApi.getCodeDetail(codeId);
      if (codeResponse.status === 200) {
        setCode(codeResponse.data);
      }

      // 获取扫描结果
      const scanResponse = await codeSecurityApi.getScanResult(codeId);
      if (scanResponse.status === 200) {
        setScanResult(scanResponse.data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colorMap = {
      CRITICAL: 'text-red-700 bg-red-100',
      HIGH: 'text-orange-700 bg-orange-100',
      MEDIUM: 'text-yellow-700 bg-yellow-100',
      LOW: 'text-green-700 bg-green-100',
    };
    return colorMap[severity as keyof typeof colorMap] || colorMap.LOW;
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (!code || !scanResult) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-red-500">
          未找到代码或扫描结果
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">安全扫描报告</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          返回
        </button>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">安全评分</h3>
          <div className={`text-3xl font-bold ${getSecurityScoreColor(scanResult.securityScore)}`}>
            {scanResult.securityScore}/100
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">发现漏洞</h3>
          <div className="text-3xl font-bold text-red-600">
            {scanResult.vulnerabilities.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">扫描时间</h3>
          <div className="text-sm text-gray-600">
            {new Date(scanResult.scanTime).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>

      {/* 扫描总结 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">扫描总结</h3>
        <p className="text-gray-700">{scanResult.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 代码展示 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">代码内容</h3>
          <Editor
            height="500px"
            language={code.language}
            value={code.content}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 14,
              lineNumbers: 'on',
            }}
          />
        </div>

        {/* 漏洞列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">安全漏洞</h3>
          {scanResult.vulnerabilities.length === 0 ? (
            <div className="text-green-600 text-center py-8">
              恭喜！未发现安全漏洞
            </div>
          ) : (
            <div className="space-y-4">
              {scanResult.vulnerabilities.map((vulnerability, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{vulnerability.type}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(vulnerability.severity)}`}>
                      {vulnerability.severity}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {vulnerability.description}
                  </p>

                  <div className="bg-gray-50 rounded p-2 mb-3">
                    <div className="text-xs text-gray-500 mb-1">
                      第 {vulnerability.line} 行
                    </div>
                    <code className="text-red-600 text-sm">
                      {vulnerability.codeSnippet}
                    </code>
                  </div>

                  <div className="text-sm">
                    <strong className="text-green-700">修复建议: </strong>
                    <span className="text-gray-700">{vulnerability.suggestion}</span>
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