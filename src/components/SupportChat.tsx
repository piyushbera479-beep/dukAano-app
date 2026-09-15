import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  User, 
  Clock, 
  CheckCheck, 
  Package, 
  Phone, 
  Sparkles,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
  orderId?: string;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOrderId?: string;
}

const QUICK_PROMPTS = [
  'Where is my active order?',
  'Need to change delivery instructions',
  'When will my DUKAANO Coins be credited?',
  'Issue with received items or damaged package',
  'How do I cancel or modify my order?'
];

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose, defaultOrderId }) => {
  const { orders } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    defaultOrderId || (orders.length > 0 ? orders[0].id : '')
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'support',
      text: 'Namaste! Welcome to DUKAANO Support. I am your automated order assistant. How can we help you with your order or delivery today?',
      timestamp: 'Just now',
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const generateSupportReply = (userQuery: string, order?: Order): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('where') || q.includes('status') || q.includes('track') || q.includes('rider') || q.includes('active')) {
      if (order) {
        if (order.status === 'out_for_delivery') {
          return `Your order #${order.id} is currently Out for Delivery with rider Suresh Kumar! Estimated arrival is within ${order.estimatedDelivery || '15 mins'}. You can also call Suresh directly from the Orders tab.`;
        } else if (order.status === 'delivered') {
          return `Order #${order.id} was marked as successfully delivered to ${order.deliveryAddress.house}, ${order.deliveryAddress.street}. If you haven't received it, we will immediately initiate an investigation with the neighborhood store partner.`;
        } else {
          return `Order #${order.id} is currently in the "${order.status.replace('_', ' ')}" stage at the local partner store. Fresh items are being packed securely!`;
        }
      }
      return 'I see your inquiry regarding order tracking. Please select an order from the dropdown above so I can fetch live GPS and store updates for you.';
    }

    if (q.includes('coin') || q.includes('reward') || q.includes('cashback') || q.includes('balance')) {
      return `DUKAANO Coins are automatically credited right after the delivery is marked complete! For SANIVOX items you earn a massive 10 Coins per ₹100, and for groceries/eats you earn 3-5 Coins per ₹100. Check your Coins tab to view your full passbook.`;
    }

    if (q.includes('instruction') || q.includes('gate') || q.includes('address') || q.includes('change')) {
      return `We have relayed your updated delivery notes to the delivery partner. For order #${order?.id || 'your order'}, the assigned rider will ring bell or call you before gate entry.`;
    }

    if (q.includes('cancel') || q.includes('modify')) {
      if (order && order.status === 'placed') {
        return `Your order #${order.id} is still in 'Placed' status. You can cancel or modify it directly without cancellation charges. Would you like our support executive to notify the store?`;
      }
      return `Since orders are prepared fresh by local neighborhood stores within 15-20 minutes, cancellation after the packing stage requires store approval. Our team can help arrange a replacement or instant refund to your original payment method.`;
    }

    if (q.includes('damage') || q.includes('wrong') || q.includes('missing') || q.includes('refund')) {
      return `We sincerely apologize for any inconvenience! Please keep the package handy. We guarantee a 100% replacement or full refund in DUKAANO Coins/UPI for missing or damaged items from our local partners within 2 hours.`;
    }

    return `Thank you for reaching out regarding order #${order?.id || 'your query'}. I've logged ticket #SUP-${Math.floor(1000 + Math.random() * 9000)} with our Bengaluru merchant support team. An agent will also follow up if required!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderId: selectedOrderId,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    // Realistic bot response delay
    setTimeout(() => {
      setIsTyping(false);
      const replyText = generateSupportReply(messageContent, currentOrder);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'support',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orderId: selectedOrderId,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm-welcome',
        sender: 'support',
        text: 'Namaste! Welcome to DUKAANO Support. I am your automated order assistant. How can we help you with your order or delivery today?',
        timestamp: 'Just now',
      }
    ]);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      {/* Chat Container Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 w-full max-w-md h-[88vh] max-h-[640px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-colors"
      >
        {/* Header */}
        <div className="bg-teal-900 dark:bg-neutral-950 text-white p-4 flex items-center justify-between shadow-xs border-b dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-teal-800 dark:bg-neutral-800 border border-teal-700 dark:border-neutral-700 flex items-center justify-center shadow-inner">
                <Headphones className="w-5 h-5 text-amber-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-teal-900 dark:border-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm font-brand tracking-tight">
                  DUKAANO Support
                </h3>
                <span className="bg-teal-800 dark:bg-neutral-800 text-teal-200 dark:text-teal-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-teal-200 dark:text-neutral-400">
                Order queries & store resolution • Avg reply: 1 min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-full text-teal-200 dark:text-neutral-400 hover:text-white hover:bg-teal-800 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-teal-200 dark:text-neutral-400 hover:text-white hover:bg-teal-800 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Selector Banner */}
        {orders.length > 0 && (
          <div className="bg-teal-50/80 dark:bg-neutral-900 border-b border-teal-100 dark:border-neutral-800 px-3.5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-teal-900 dark:text-teal-300 font-semibold truncate">
              <Package className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />
              <span className="text-[11px] text-teal-700 dark:text-teal-400">Querying Order:</span>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="bg-white dark:bg-neutral-800 border border-teal-300 dark:border-neutral-700 text-teal-950 dark:text-white font-bold rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id} className="dark:bg-neutral-800 dark:text-white">
                    #{o.id} • ₹{o.grandTotal} ({o.status.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {currentOrder && (
              <span className="text-[10px] font-extrabold capitalize bg-teal-200/80 dark:bg-teal-950 dark:text-teal-300 text-teal-900 px-2 py-0.5 rounded-full shrink-0">
                {currentOrder.status.replace('_', ' ')}
              </span>
            )}
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50 dark:bg-neutral-950/70">
          <div className="text-center my-1">
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 rounded-full shadow-2xs">
              End-to-End Encrypted Support Channel
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-teal-800 dark:bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs mb-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-teal-800 dark:bg-teal-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-200/80 dark:border-neutral-700 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-medium ${
                      isMe ? 'text-teal-200 dark:text-teal-100' : 'text-neutral-400 dark:text-neutral-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-300" />}
                  </div>
                </div>

                {isMe && (
                  <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 mb-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal-800 dark:bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 dark:bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 dark:bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700 dark:bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-neutral-400 dark:text-neutral-400 ml-1 font-medium">Assistant typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 pt-2 pb-1 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-semibold text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-neutral-800 hover:bg-teal-100 dark:hover:bg-neutral-700 border border-teal-200/80 dark:border-neutral-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors touch-press shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your order query here..."
            className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:bg-white dark:focus:bg-neutral-800 focus:ring-1 focus:ring-teal-600 transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-2xl bg-teal-800 dark:bg-teal-600 hover:bg-teal-900 dark:hover:bg-teal-700 active:bg-teal-950 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 text-white flex items-center justify-center transition-all touch-press shrink-0 shadow-xs cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
