'use client'
import { ChangeEvent } from 'react'

interface CategoryFilterProps {
    selected: string
    onChange: (value: string) => void
    categories: string[]
}

export function CategoryFilter({ selected, onChange, categories }: CategoryFilterProps) {
    return (
        <div className="mb-6">
            <label className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4 z-10">Filtrer par catégorie :</label>
            <select
                className="pl-10 pr-8 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none appearance-none min-w-[180px] transition-all duration-200" value={selected}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
            >
                <option value="">Toutes</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    )
}
