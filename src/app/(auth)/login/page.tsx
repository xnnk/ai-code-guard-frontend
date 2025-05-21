'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/auth';
import { LoginRequest } from '@/types/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(data);
      if (response.status === 200) {
        // 假设用户信息需要单独获取，这里简化处理
        const user = { id: 1, name: data.account, account: data.account };
        login(user, response.data);
        toast.success('登录成功');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">登录 AICodeGuard</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              账号
            </label>
            <input
              {...register('account', { required: '请输入账号' })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.account && (
              <p className="text-red-500 text-xs mt-1">{errors.account.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              {...register('password', { required: '请输入密码' })}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
          
          <div className="text-center">
            <Link href="/register" className="text-blue-600 hover:text-blue-800">
              没有账号？立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
