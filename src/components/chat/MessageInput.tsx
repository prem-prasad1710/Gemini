'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Image, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { MessageFormData, messageSchema } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { isValidImageFile, fileToBase64 } from '@/lib/utils';

interface MessageInputProps {
  onSubmit: (data: MessageFormData) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function MessageInput({ onSubmit, loading = false, disabled = false }: MessageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const content = watch('content');

  const handleFormSubmit = (data: MessageFormData) => {
    onSubmit({
      ...data,
      image: imagePreview || undefined,
    });
    reset();
    setImagePreview(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP) under 5MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setValue('image', base64);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('image', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content?.trim() || imagePreview) {
        handleSubmit(handleFormSubmit)();
      }
    }
  };

  const canSubmit = (content?.trim() || imagePreview) && !loading && !disabled;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Image preview"
            className="max-w-32 max-h-32 rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-2 items-end">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Upload image"
        >
          <Image className="h-5 w-5" />
        </button>

        {/* Message input */}
        <div className="flex-1">
          <textarea
            {...register('content')}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            onKeyDown={handleKeyDown}
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Send button */}
        <Button
          type="submit"
          loading={loading}
          disabled={!canSubmit}
          className="flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
