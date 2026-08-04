import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export function Footer() {
  return (
    <footer className="w-full py-6 transition-colors">
      <div className="mx-auto px-4 py-4 sm:py-6">
        <div className="mb-8 h-1 w-full rounded-full bg-gradient-to-r from-blue-600 via-white to-red-600 opacity-60" />

        <div className="mx-8 mt-3 flex flex-col items-center justify-between gap-3 lg:flex-row">
          <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row md:text-left lg:w-3/5 xl:w-2/5">
            <div className="flex w-full flex-row items-center justify-center gap-3 sm:w-auto">
              <Image
                src="/Eco-portal-logo.svg"
                alt="Logo Eco Portal"
                width={200}
                height={56}
                className="h-auto w-12 object-contain sm:w-20 md:w-16 lg:w-20"
              />

              <Image
                src="/Marianne.svg"
                alt="Logo République française"
                width={200}
                height={56}
                className="h-auto w-14 object-contain sm:w-20 md:w-24 lg:w-24"
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
        </div>

        <div className="mt-20">
          <p className="mb-8 text-center text-xs text-gray-600 sm:text-sm">
            © Tous droits réservés Ambassade de France à Tunis
            <br />
            Avec le support du Comité Tunisie des Conseillers du commerce
            extérieur de la France.
          </p>

          <div className="my-3 pt-8 text-center text-sm">
            <Link
              href="https://edonec.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Made with ♥ by eDonec
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}