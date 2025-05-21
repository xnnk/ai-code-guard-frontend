'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { codeGenApi } from '@/lib/api/code-gen';
import { CodeGenerationRequest, CodeGenerationResponse } from '@/types/api';

export default function CodeGeneratorPage() {
  const [generatedCode, setGeneratedCode] = useState<CodeGenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CodeGenerationRequest>();

  const onSubmit = async (data: CodeGenerationRequest) => {
    setLoading(true);
    try {
      const response = await codeGenApi.generateCode(data);
      if (response.status === 200) {
        setGeneratedCode(response.data);
      }
    } catch (error) {
      console.error('代码生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI 代码生成</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 生成表单 */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                代码描述
              </label>
              <textarea
                {...register('prompt', { required: '请输入代码描述' })}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="描述你想生成的代码..."
              />
              {errors.prompt && (
                <p className="text-red-500 text-xs mt-1">{errors.prompt.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                编程语言
              </label>
              <select
                {...register('language', { required: '请选择编程语言' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">选择语言</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="typescript">TypeScript</option>
              </select>
              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                AI 模型 (可选)
              </label>
              <select
                {...register('modelType')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">使用默认模型</option>
                <option value="deepseek">DeepSeek</option>
                <option value="claude">Claude</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '生成中...' : '生成代码'}
            </button>
          </form>
        </div>

        {/* 代码预览 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">生成的代码</h3>
          {generatedCode ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                语言: {generatedCode.language} | 模型: {generatedCode.modelUsed}
              </div>
              <Editor
                height="400px"
                language={generatedCode.language}
                value={generatedCode.content}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                }}
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center py-12">
              还没有生成代码，请先填写表单并提交
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
