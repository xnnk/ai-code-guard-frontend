'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '@/lib/api/auth';
import { RegisterRequest } from '@/types/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('两次密码输入不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({
        account: data.account,
        password: data.password,
        name: data.name,
      });
      if (response.status === 200) {
        toast.success('注册成功，请登录');
        router.push('/login');
      }
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-center">注册 AICodeGuard</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              {...register('name', { required: '请输入用户名' })}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          
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
              {...register('password', { 
                required: '请输入密码',
                minLength: { value: 6, message: '密码至少6位' }
              })}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              确认密码
            </label>
            <input
              {...register('confirmPassword', { required: '请确认密码' })}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
          
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              已有账号？立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}