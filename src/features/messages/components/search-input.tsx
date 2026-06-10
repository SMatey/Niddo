import { MESSAGES_UI_TEXT } from '../constants/messages.constants';
import { SearchInputProps } from '../types/components.types';

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="p-4 border-b border-gray-100 bg-white">
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={MESSAGES_UI_TEXT.chat.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 text-sm border-transparent rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 placeholder-gray-500"
        />
      </div>
    </div>
  );
};
