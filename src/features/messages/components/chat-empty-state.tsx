import { MESSAGES_UI_TEXT } from '../constants/messages.constants';

export const ChatEmptyState = () => {
  return (
    <div className="flex-1 hidden md:flex flex-col bg-gray-50 border-l border-gray-200 justify-center items-center h-full">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {MESSAGES_UI_TEXT.emptyState.title}
        </h2>
        <p className="text-gray-500">
          {MESSAGES_UI_TEXT.emptyState.description}
        </p>
      </div>
    </div>
  );
};
