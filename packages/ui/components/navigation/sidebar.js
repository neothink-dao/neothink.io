import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@neothink/utils';
const navigationItems = {
    ascenders: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Courses', href: '/courses' },
        { name: 'Community', href: '/community' },
        { name: 'Resources', href: '/resources' },
    ],
    neothinkers: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Library', href: '/library' },
        { name: 'Discussions', href: '/discussions' },
        { name: 'Research', href: '/research' },
    ],
    immortals: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Protocols', href: '/protocols' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Network', href: '/network' },
    ],
    hub: [
        { name: 'Overview', href: '/overview' },
        { name: 'Platforms', href: '/platforms' },
        { name: 'Settings', href: '/settings' },
    ],
};
export function Sidebar({ platform }) {
    const pathname = usePathname();
    const items = navigationItems[platform];
    return (<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img className="h-8 w-auto" src={`/images/${platform}-logo.svg`} alt={`${platform} logo`}/>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {items.map((item) => (<li key={item.name}>
                    <Link href={item.href} className={cn(pathname === item.href
                ? 'bg-gray-50 text-black'
                : 'text-gray-700 hover:text-black hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold')}>
                      {item.name}
                    </Link>
                  </li>))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>);
}
//# sourceMappingURL=sidebar.js.map