'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Header } from '@/payload-types'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = () => {
  return (
    <header className="transition-colors">
      <div className="mx-auto px-4 py-4 sm:py-6">
        <div className="mx-8 my-3 flex flex-col justify-between gap-6 space-y-4 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row md:text-left lg:w-3/5 xl:w-2/5">
            <div className="flex w-full flex-row items-center justify-center gap-3 sm:w-auto">
              <Image
                src="/Eco-portal-logo.svg"
                alt="Logo Eco Portal"
                width={200}
                height={56}
                className="h-auto w-12 object-contain sm:w-20 md:w-16 lg:w-20"
                priority
              />

              <Image
                src="/Marianne.svg"
                alt="Logo République française"
                width={200}
                height={56}
                className="h-auto w-14 object-contain sm:w-20 md:w-24 lg:w-24"
                priority
              />
            </div>

            <Link
              href="/"
              className="ml-0 block text-[0.85rem] font-bold leading-[initial] text-blue-700 lg:ml-4"
            >
              Portail web d&rsquo;orientation des acteurs économiques de la
              relation franco-tunisienne
            </Link>
          </div>

          <nav className="w-full justify-self-center lg:w-2/5 lg:flex-none">
            <ul className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row md:items-center md:justify-end">
              <li>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-700 bg-transparent px-4 py-2 text-[0.85rem] font-bold text-blue-700 shadow-sm transition-all duration-500 hover:shadow-lg sm:w-auto"
                >
                  Accueil
                </Link>
              </li>

              <li>
                <Link
                  href="/questionnaire"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-[0.85rem] font-bold text-white shadow-md transition-all duration-500 hover:shadow-lg sm:w-auto"
                >
                  Laissez-vous guider
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-blue-600 via-white to-red-600 opacity-60" />
      </div>
    </header>
  )
}