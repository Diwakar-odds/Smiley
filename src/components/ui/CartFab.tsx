import React from "react";

const CartFab = ({ onClick, itemCount }: { onClick: () => void; itemCount: number }) => (
  <button
    className="fixed top-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-orange-500 shadow-lg ring-1 ring-orange-200 transition-transform hover:scale-105 active:scale-95"
    onClick={onClick}
    aria-label="Open cart"
  >
    <span className="relative">
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
          {itemCount}
        </span>
      )}
    </span>
  </button>
);

export default CartFab;
