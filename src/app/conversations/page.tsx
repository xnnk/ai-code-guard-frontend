'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { conversationApi, type Conversation, type ConversationMessage } from '@/lib/api/conversation';
import { useAuthStore } from '@/lib/stores/auth';
import { toast } from 'react-hot-toast';

interface MessageForm {
  message: string;
}

export default function ConversationsPage() {
  const { user } = useAuthStore();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageForm>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewConversation = async (modelType?: string) => {
    setCreating(true);
    try {
      const response = await conversationApi.createConversation({ modelType });
      if (response.status === 200) {
        const newConversation: Conversation = {
          id: response.data.conversationId,
          userId: user?.id?.toString() || '',
          modelType: response.data.modelType,
          messages: [],
          createdAt: Date.now(),
          lastUpdatedAt: Date.now(),
        };
        setConversation(newConversation);
        setMessages([]);
        toast.success('已创建新对话');
      }
    } catch (error) {
      console.error('创建对话失败:', error);
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = async (data: MessageForm) => {
    if (!conversation) {
      toast.error('请先创建对话');
      return;
    }

    setLoading(true);
    const userMessage: ConversationMessage = {
      role: 'user',
      content: data.message,
    };
    
    // 立即显示用户消息
    setMessages(prev => [...prev, userMessage]);
    reset();

    try {
      const response = await conversationApi.sendMessage({
        conversationId: conversation.id,
        message: data.message,
      });

      if (response.status === 200) {
        const assistantMessage: ConversationMessage = {
          role: 'assistant',
          content: response.data.reply,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 移除失败的用户消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const endConversation = async () => {
    if (!conversation || !user) return;

    try {
      await conversationApi.endConversation(user.id, conversation.id);
      setConversation(null);
      setMessages([]);
      toast.success('对话已结束');
    } catch (error) {
      console.error('结束对话失败:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">AI 对话</h1>
        <div className="flex space-x-3">
          <select
            onChange={(e) => createNewConversation(e.target.value || undefined)}
            disabled={creating}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">创建新对话（选择模型）</option>
            <option value="claude">Claude</option>
            <option value="deepseek">DeepSeek</option>
            <option value="openai">OpenAI</option>
          </select>
          {conversation && (
            <button
              onClick={endConversation}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              结束对话
            </button>
          )}
        </div>
      </div>

      {conversation ? (
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <div className="text-sm text-gray-600">
              对话ID: {conversation.id} | 模型: {conversation.modelType}
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {message.role === 'user' ? '你' : 'AI助手'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="text-xs opacity-75 mb-1">AI助手</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 消息输入 */}
          <form onSubmit={handleSubmit(sendMessage)} className="p-4 border-t">
            <div className="flex space-x-3">
              <input
                {...register('message', { required: '请输入消息' })}
                type="text"
                placeholder="输入你的消息..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                发送
              </button>
            </div>
            {errors.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow">
          <div className="text-center text-gray-500">
            <div className="text-lg mb-4">还没有创建对话</div>
            <div>请选择一个模型来开始新的对话</div>
          </div>
        </div>
      )}
    </div>
  );
}
