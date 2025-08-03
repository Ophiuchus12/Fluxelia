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
            <label className="block mb-2 font-semibold">Filtrer par catégorie :</label>
            <select
                className="p-2 border rounded"
                value={selected}
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
