import React from 'react';
import Link from 'next/link';
const sections = [
    {
        label: 'Superachiever',
        gradient: 'from-stone-400 via-amber-300 to-yellow-200',
        routes: [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/users', label: 'Users' },
        ],
    },
    {
        label: 'Superachievers',
        gradient: 'from-slate-500 via-rose-400 to-emerald-300',
        routes: [
            { path: '/claims', label: 'Token Claims' },
            { path: '/analytics', label: 'Analytics' },
        ],
    },
    {
        label: 'Supercivilization',
        gradient: 'from-zinc-500 via-gray-400 to-blue-300',
        routes: [
            { path: '/ecosystem', label: 'Ecosystem' },
        ],
    },
];
export function Sidebar() {
    return (<aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-zinc-900 via-slate-900 to-gray-950 shadow-xl z-40">
      <div className="py-8 px-6">
        <h1 className="text-2xl font-bold text-white mb-8 tracking-wide">Avolve Admin</h1>
        <nav>
          {sections.map((section) => (<div key={section.label} className="mb-6">
              <div className={`text-lg font-semibold mb-2 bg-gradient-to-r ${section.gradient} text-transparent bg-clip-text`}>
                {section.label}
              </div>
              <ul>
                {section.routes.map((route) => (<li key={route.path} className="mb-2">
                    <Link href={route.path} className="text-slate-200 hover:text-white transition-colors px-2 py-1 rounded block">
                      {route.label}
                    </Link>
                  </li>))}
                {/* Add referrals to Superachievers section */}
                {section.label === 'Superachievers' && (<li className="mb-2">
                    <Link href="/referrals" className="text-slate-200 hover:text-white transition-colors px-2 py-1 rounded block">
                      Referrals
                    </Link>
                  </li>)}
              </ul>
            </div>))}
        </nav>
      </div>
    </aside>);
}
//# sourceMappingURL=sidebar.js.map