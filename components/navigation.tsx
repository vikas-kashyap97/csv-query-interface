'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, FileText, BarChart2, Settings, Menu, X } from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: FileText, label: 'Files', href: '/files' },
  { icon: BarChart2, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      <motion.nav
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 bg-background border-r p-4 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full">
          <div className="text-2xl font-bold mb-8">CSV Query App</div>
          <ul className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            {/* Add user profile or logout button here */}
          </div>
        </div>
      </motion.nav>
    </>
  )
}

