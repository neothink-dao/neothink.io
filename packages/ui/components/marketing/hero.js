import Image from 'next/image';
import Link from 'next/link';
const platformGradients = {
    ascenders: 'from-blue-600 to-indigo-600',
    neothinkers: 'from-emerald-600 to-teal-600',
    immortals: 'from-purple-600 to-indigo-600',
    hub: 'from-gray-600 to-slate-600',
};
export function Hero({ platform, title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, imageSrc, }) {
    const gradientClasses = platformGradients[platform];
    return (<div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {subtitle}
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href={ctaLink} className={`rounded-md bg-gradient-to-r ${gradientClasses} px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}>
              {ctaText}
            </Link>
            {secondaryCtaText && secondaryCtaLink && (<Link href={secondaryCtaLink} className="text-sm font-semibold leading-6 text-gray-900">
                {secondaryCtaText} <span aria-hidden="true">→</span>
              </Link>)}
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image src={imageSrc} alt="Platform preview" width={2432} height={1442} className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"/>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=hero.js.map